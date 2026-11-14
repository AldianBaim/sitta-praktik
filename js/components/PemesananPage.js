/**
 * Komponen: PemesananPage
 * Halaman formulir pemesanan bahan ajar. Kombinasi v-model untuk two-way
 * data binding, computed untuk total pembayaran, watcher untuk memantau
 * perubahan barang dan jumlah, serta filter untuk format rupiah.
 *
 * Event:
 * - buat-pesanan : mengirim data pesanan ke root untuk dicatat sebagai transaksi
 */
Vue.component("pemesanan-page", {
  // Props: bahan ajar dan transaksi berasal dari state root.
  props: {
    bahanAjar: {
      type: Array,
      required: true
    },
    transaksi: {
      type: Array,
      required: true
    },
    pengguna: {
      type: Object,
      required: true
    }
  },

  data: function () {
    return {
      form: {
        namaPemesan: this.pengguna.nama,
        upbjj: this.pengguna.lokasi || "Pusat",
        kodeBarang: "",
        jumlah: 1,
        ekspedisi: "JNE Reguler",
        catatan: ""
      },
      pesanError: "",
      pesanSukses: ""
    };
  },

  // Computed: total pembayaran dan sisa stok dihitung otomatis dari pilihan user.
  computed: {
    barangDipilih: function () {
      var kode = this.form.kodeBarang;
      return this.bahanAjar.find(function (item) {
        return item.kodeBarang === kode;
      }) || null;
    },

    stokTersedia: function () {
      return this.barangDipilih ? this.barangDipilih.stok : 0;
    },

    totalBayar: function () {
      if (!this.barangDipilih) return 0;
      return this.barangDipilih.harga * (Number(this.form.jumlah) || 0);
    },

    stokSetelahPesan: function () {
      return Math.max(0, this.stokTersedia - (Number(this.form.jumlah) || 0));
    },

    ringkasanStatus: function () {
      return this.transaksi.reduce(function (hasil, item) {
        hasil[item.status] = (hasil[item.status] || 0) + 1;
        return hasil;
      }, {});
    }
  },

  // Watch: perubahan barang dan jumlah langsung memicu validasi.
  watch: {
    // Watcher 1: saat bahan ajar diganti, jumlah kembali ke 1 dan pesan lama dibersihkan.
    "form.kodeBarang": function () {
      this.form.jumlah = 1;
      this.pesanError = "";
      this.pesanSukses = "";
    },

    // Watcher 2: jumlah pesanan langsung divalidasi terhadap stok yang tersedia.
    "form.jumlah": function (nilai) {
      if (!this.barangDipilih) {
        this.pesanError = "";
        return;
      }

      var jumlah = Number(nilai) || 0;

      if (jumlah < 1) {
        this.pesanError = "Jumlah pemesanan minimal 1 eksemplar.";
      } else if (jumlah > this.stokTersedia) {
        this.pesanError = "Jumlah melebihi stok tersedia (" + this.stokTersedia + " eksemplar).";
      } else {
        this.pesanError = "";
      }
    }
  },

  // Methods: validasi akhir dan pengiriman event buat-pesanan ke root.
  methods: {
    kirimPesanan: function () {
      var jumlah = Number(this.form.jumlah);
      var barang = this.barangDipilih;

      if (!this.form.namaPemesan.trim()) {
        this.pesanError = "Nama pemesan wajib diisi.";
        return;
      }

      if (!barang) {
        this.pesanError = "Pilih bahan ajar yang akan dipesan terlebih dahulu.";
        return;
      }

      if (!Number.isInteger(jumlah) || jumlah < 1) {
        this.pesanError = "Jumlah pemesanan harus bilangan bulat minimal 1.";
        return;
      }

      if (jumlah > barang.stok) {
        this.pesanError = "Stok tidak mencukupi. Tersedia " + barang.stok + " eksemplar.";
        return;
      }

      this.$emit("buat-pesanan", {
        kodeBarang: barang.kodeBarang,
        namaBarang: barang.namaBarang,
        jumlah: jumlah,
        pemesan: this.form.namaPemesan.trim(),
        upbjj: this.form.upbjj.trim() || "Pusat",
        ekspedisi: this.form.ekspedisi,
        catatan: this.form.catatan.trim()
      });

      var komponen = this;
      var namaBarang = barang.namaBarang;

      this.pesanError = "";
      this.form.kodeBarang = "";
      this.form.jumlah = 1;
      this.form.catatan = "";

      // Watcher kodeBarang di atas membersihkan pesan; pesan sukses ditulis
      // setelah proses render berikutnya agar tidak ikut terhapus.
      this.$nextTick(function () {
        komponen.pesanSukses =
          "Pesanan " + jumlah + ' eksemplar "' + namaBarang + '" berhasil dicatat.';
      });
    }
  },

  template: `
    <main class="container page-main">
      <header class="stock-page-header">
        <div>
          <span class="page-eyebrow">LAYANAN PEMESANAN BAHAN AJAR</span>
          <h1 class="page-title">Pemesanan Bahan Ajar UPBJJ</h1>
          <p class="page-desc">
            Pilih bahan ajar, tentukan jumlah, lalu kirim pesanan. Total pembayaran dihitung
            otomatis oleh computed property dan stok langsung berkurang setelah pesanan dicatat.
          </p>
        </div>
        <div class="page-header-actions">
          <span class="badge-count-pill">{{ transaksi.length }} Transaksi Tercatat</span>
          <button type="button" class="btn btn-outline btn-sm" @click="$emit('navigasi', 'histori')">
            📜 Lihat Histori
          </button>
        </div>
      </header>

      <div class="order-layout">
        <article class="table-card order-card">
          <div class="order-card-head">
            <h2 class="section-title">🧾 Formulir Pemesanan</h2>
            <p class="section-subtitle">Semua isian memakai directive <code>v-model</code>.</p>
          </div>

          <form novalidate @submit.prevent="kirimPesanan">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="namaPemesan" class="form-label">Nama Pemesan</label>
                <!-- v-model.trim: input nama terikat dua arah dan spasi tepi dipotong. -->
                <input id="namaPemesan" v-model.trim="form.namaPemesan" type="text" class="form-input" placeholder="Nama lengkap">
              </div>
              <div class="form-group">
                <label for="unitPemesan" class="form-label">Unit / UPBJJ</label>
                <input id="unitPemesan" v-model.trim="form.upbjj" type="text" class="form-input" placeholder="Contoh: UPBJJ Bandung">
              </div>
            </div>

            <div class="form-group">
              <label for="pilihBahanAjar" class="form-label">Bahan Ajar</label>
              <!-- v-model pada select: pilihan bahan ajar masuk ke form.kodeBarang. -->
              <select id="pilihBahanAjar" v-model="form.kodeBarang" class="form-input">
                <option value="">— Pilih bahan ajar —</option>
                <!-- v-for zero-based index + v-bind: nomor urut memakai index,
                     sedangkan :value dan :disabled adalah one-way binding. -->
                <option
                  v-for="(item, index) in bahanAjar"
                  :key="item.kodeBarang"
                  :value="item.kodeBarang"
                  :disabled="item.stok === 0"
                >
                  {{ index + 1 }}. {{ item.kodeBarang }} — {{ item.namaBarang }} (stok {{ item.stok | angka }})
                </option>
              </select>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label for="jumlahPesanan" class="form-label">Jumlah Eksemplar</label>
                <!-- v-model.number: jumlah dikonversi menjadi angka.
                     v-bind:max: batas atas input mengikuti stok yang tersedia. -->
                <input
                  id="jumlahPesanan"
                  v-model.number="form.jumlah"
                  type="number"
                  min="1"
                  :max="stokTersedia || null"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="pilihEkspedisi" class="form-label">Ekspedisi</label>
                <select id="pilihEkspedisi" v-model="form.ekspedisi" class="form-input">
                  <option value="JNE Reguler">JNE Reguler</option>
                  <option value="Pos Indonesia">Pos Indonesia</option>
                  <option value="J&amp;T Express">J&amp;T Express</option>
                  <option value="SiCepat HALU">SiCepat HALU</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="catatanPesanan" class="form-label">Catatan Pengiriman (Opsional)</label>
              <textarea id="catatanPesanan" v-model.trim="form.catatan" rows="2" class="form-input" placeholder="Contoh: kirim ke gudang UPBJJ lantai 2"></textarea>
            </div>

            <!-- v-if: pesan error/sukses berganti sesuai hasil validasi. -->
            <div v-if="pesanError" class="custom-alert alert-danger">{{ pesanError }}</div>
            <div v-if="pesanSukses" class="custom-alert alert-success">{{ pesanSukses }}</div>

            <!-- v-bind:disabled: tombol otomatis nonaktif jika belum ada bahan ajar dipilih. -->
            <button type="submit" class="btn btn-primary btn-block" :disabled="!barangDipilih">
              Kirim Pesanan ➔
            </button>
          </form>
        </article>

        <aside class="order-summary">
          <h2 class="section-title">📋 Ringkasan Pesanan</h2>

          <!-- v-if/v-else: ringkasan tampil hanya setelah bahan ajar dipilih. -->
          <div v-if="barangDipilih" class="summary-body">
            <!-- v-bind: atribut gambar diikat ke data barang yang dipilih. -->
            <img :src="barangDipilih.cover" :alt="barangDipilih.namaBarang" class="summary-cover">
            <div>
              <strong class="summary-title">{{ barangDipilih.namaBarang }}</strong>
              <span class="summary-meta">{{ barangDipilih.kodeBarang }} • Edisi {{ barangDipilih.edisi }}</span>
              <span class="summary-meta">{{ barangDipilih.jenisBarang }} • {{ barangDipilih.stok | angka }} eksemplar tersedia</span>
            </div>

            <div class="summary-row"><span>Harga satuan</span><strong>{{ barangDipilih.harga | rupiah }}</strong></div>
            <div class="summary-row"><span>Jumlah</span><strong>{{ form.jumlah | angka }} eksemplar</strong></div>
            <div class="summary-row"><span>Ekspedisi</span><strong>{{ form.ekspedisi }}</strong></div>
            <div class="summary-row"><span>Sisa stok</span><strong>{{ stokSetelahPesan | angka }} eksemplar</strong></div>
            <!-- filter: total pembayaran diformat menjadi rupiah. -->
            <div class="summary-total">
              <span>Total Pembayaran</span>
              <strong>{{ totalBayar | rupiah }}</strong>
            </div>
          </div>

          <p v-else class="empty-note">
            Belum ada bahan ajar yang dipilih. Ringkasan harga akan muncul di sini.
          </p>

          <div class="status-recap">
            <h3>Status Transaksi</h3>
            <!-- v-for name-based index: (jumlah, status) membaca object ringkasanStatus. -->
            <div v-for="(jumlah, status) in ringkasanStatus" :key="status" class="summary-row">
              <span>{{ status }}</span>
              <strong>{{ jumlah }} transaksi</strong>
            </div>
            <button type="button" class="btn btn-outline btn-sm btn-block btn-recap" @click="$emit('navigasi', 'histori')">
              Buka Histori Lengkap ➔
            </button>
          </div>
        </aside>
      </div>
    </main>
  `
});
