/**
 * SITTA UT - Root Instance Vue.js
 * File: js/app.js
 *
 * Root menyimpan state aplikasi (pengguna aktif, daftar bahan ajar, transaksi)
 * dan menjadi penghubung antar komponen. Navigasi memakai hash agar tombol
 * back/forward browser tetap bekerja.
 */
new Vue({
  el: "#app",

  // State root: data di sini dipakai bersama oleh semua komponen.
  // Komponen menerimanya lewat props dan mengirim perubahan lewat emit.
  data: {
    halaman: "dashboard",
    pengguna: null,
    daftarBahanAjar: dataBahanAjar.slice(),
    daftarTracking: dataTracking,
    daftarTransaksi: dataTransaksi.slice(),
    nomorDOAwal: "",
    modal: "",
    toast: { pesan: "", tipe: "success" },
    timerToast: null
  },

  // Computed: nilai turunan yang dihitung otomatis dan di-cache Vue.
  computed: {
    totalStok: function () {
      return this.daftarBahanAjar.reduce(function (total, item) {
        return total + Number(item.stok || 0);
      }, 0);
    },

    totalNilaiStok: function () {
      return this.daftarBahanAjar.reduce(function (total, item) {
        return total + Number(item.stok || 0) * Number(item.harga || 0);
      }, 0);
    },

    // Objek dengan nama jenis barang sebagai key, dipakai untuk v-for name based index.
    rekapJenis: function () {
      return this.daftarBahanAjar.reduce(function (hasil, item) {
        if (!hasil[item.jenisBarang]) {
          hasil[item.jenisBarang] = { jumlahModul: 0, totalStok: 0, nilaiStok: 0 };
        }
        hasil[item.jenisBarang].jumlahModul += 1;
        hasil[item.jenisBarang].totalStok += Number(item.stok || 0);
        hasil[item.jenisBarang].nilaiStok += Number(item.stok || 0) * Number(item.harga || 0);
        return hasil;
      }, {});
    },

    judulModal: function () {
      if (this.modal === "monitoring") return "📊 Monitoring Progress DO Bahan Ajar";
      if (this.modal === "rekap") return "📑 Rekapitulasi Stok Bahan Ajar SITTA";
      return "";
    }
  },

  // Watch: watcher bereaksi terhadap perubahan data, bukan untuk menampilkan nilai.
  watch: {
    // Watcher root 1: kelas body menyesuaikan tampilan login dan aplikasi.
    pengguna: function (nilai) {
      document.body.classList.toggle("login-body", !nilai);

      if (!nilai) {
        sessionStorage.removeItem("sitta_user");
        this.halaman = "dashboard";
        this.modal = "";
      }
    },

    // Watcher root 2: setiap perpindahan halaman, modal ditutup dan judul dokumen diperbarui.
    halaman: function (nilai) {
      this.modal = "";
      document.title = this.pengguna
        ? nilai.charAt(0).toUpperCase() + nilai.slice(1) + " | SITTA UT"
        : "Login | SITTA UT";
    }
  },

  created: function () {
    var sesi = sessionStorage.getItem("sitta_user");

    if (sesi) {
      try {
        this.pengguna = JSON.parse(sesi);
      } catch (error) {
        sessionStorage.removeItem("sitta_user");
      }
    }

    var halamanDariHash = window.location.hash.replace("#/", "").split("?")[0];
    if (["dashboard", "stok", "pemesanan", "histori", "tracking"].indexOf(halamanDariHash) > -1) {
      this.halaman = halamanDariHash;
    }

    document.body.classList.toggle("login-body", !this.pengguna);
    document.title = this.pengguna
      ? this.halaman.charAt(0).toUpperCase() + this.halaman.slice(1) + " | SITTA UT"
      : "Login | SITTA UT";
    window.addEventListener("hashchange", this.sinkronHash);
  },

  beforeDestroy: function () {
    window.removeEventListener("hashchange", this.sinkronHash);
    if (this.timerToast) clearTimeout(this.timerToast);
  },

  methods: {
    // Emit ke root: event login dari LoginPage masuk ke method ini.
    loginBerhasil: function (pengguna) {
      this.pengguna = pengguna;
      sessionStorage.setItem("sitta_user", JSON.stringify(pengguna));
      this.pindahHalaman("dashboard");
      this.tampilkanToast("Selamat datang, " + pengguna.nama + ".", "success");
    },

    logout: function () {
      if (!window.confirm("Apakah Anda yakin ingin keluar dari sistem SITTA UT?")) return;
      this.pengguna = null;
      this.nomorDOAwal = "";
      window.location.hash = "";
      document.title = "Login | SITTA UT";
    },

    // Navigasi: state halaman + hash URL diubah agar tombol back browser tetap bekerja.
    pindahHalaman: function (halaman) {
      this.halaman = halaman;

      if (window.location.hash !== "#/" + halaman) {
        window.location.hash = "#/" + halaman;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    sinkronHash: function () {
      if (!this.pengguna) return;

      var halaman = window.location.hash.replace("#/", "").split("?")[0];
      if (["dashboard", "stok", "pemesanan", "histori", "tracking"].indexOf(halaman) > -1) {
        this.halaman = halaman;
      }
    },

    bukaTracking: function (nomorDO) {
      this.nomorDOAwal = nomorDO;
      this.pindahHalaman("tracking");
    },

    bukaLaporan: function (jenis) {
      this.modal = jenis;
    },

    tutupModal: function () {
      this.modal = "";
    },

    lihatDO: function (nomorDO) {
      this.modal = "";
      this.bukaTracking(nomorDO);
    },

    // Emit ke root: StokPage mengirim tambah-stok, root mengubah array reaktif.
    tambahStok: function (item) {
      this.daftarBahanAjar.unshift(item);
      this.tampilkanToast('Bahan ajar "' + item.namaBarang + '" berhasil ditambahkan.', "success");
    },

    hapusStok: function (kodeBarang) {
      var index = this.daftarBahanAjar.findIndex(function (item) {
        return item.kodeBarang === kodeBarang;
      });

      if (index > -1) {
        var dihapus = this.daftarBahanAjar[index];
        this.daftarBahanAjar.splice(index, 1);
        this.tampilkanToast('Bahan ajar "' + dihapus.namaBarang + '" telah dihapus.', "danger");
      }
    },

    // Alur pesanan: PemesananPage mengirim data -> root mengurangi stok,
    // menambah transaksi, lalu semua komponen yang menerima props ikut ter-render ulang.
    buatPesanan: function (pesanan) {
      var barang = this.daftarBahanAjar.find(function (item) {
        return item.kodeBarang === pesanan.kodeBarang;
      });

      if (!barang) {
        this.tampilkanToast("Bahan ajar tidak ditemukan.", "danger");
        return;
      }

      if (pesanan.jumlah > barang.stok) {
        this.tampilkanToast("Stok tidak mencukupi untuk pesanan ini.", "danger");
        return;
      }

      barang.stok = barang.stok - pesanan.jumlah;

      this.daftarTransaksi.unshift({
        id: "TRX-" + Date.now().toString().slice(-8),
        tanggal: new Date().toISOString().slice(0, 10),
        kodeBarang: barang.kodeBarang,
        namaBarang: barang.namaBarang,
        jumlah: pesanan.jumlah,
        total: barang.harga * pesanan.jumlah,
        status: "Diproses",
        pemesan: pesanan.pemesan,
        upbjj: pesanan.upbjj,
        ekspedisi: pesanan.ekspedisi
      });

      this.tampilkanToast(
        "Pesanan " + pesanan.jumlah + " eksemplar " + barang.namaBarang + " berhasil dicatat.",
        "success"
      );
    },

    // Notifikasi: toast dipakai sebagai umpan balik setelah aksi berhasil/gagal.
    tampilkanToast: function (pesan, tipe) {
      var komponen = this;
      if (this.timerToast) clearTimeout(this.timerToast);

      this.toast = { pesan: pesan, tipe: tipe || "success" };
      this.timerToast = setTimeout(function () {
        komponen.toast = { pesan: "", tipe: "success" };
      }, 3200);
    }
  }
});
