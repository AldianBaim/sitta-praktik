/**
 * Komponen: StokPage
 * Halaman Informasi Bahan Ajar. Menampilkan data array dengan v-for,
 * pencarian dan filter jenis memakai computed property, format stok dan
 * harga memakai filter, serta form tambah data dengan validasi sederhana.
 *
 * Event:
 * - tambah-stok : mengirim objek bahan ajar baru ke root
 * - hapus-stok  : mengirim kode barang yang akan dihapus
 */
Vue.component("stok-page", {
  // Props: daftar bahan ajar berasal dari state root.
  props: {
    bahanAjar: {
      type: Array,
      required: true
    }
  },

  data: function () {
    return {
      kataKunci: "",
      jenisDipilih: "",
      urutan: "kode",
      pesanForm: "",
      modalTambah: false,
      itemDetail: null,
      formTambah: this.formKosong()
    };
  },

  // Computed: hasil pencarian, filter, urutan, dan ringkasan dihitung otomatis.
  computed: {
    daftarTampil: function () {
      var kunci = this.kataKunci.toLowerCase();
      var jenis = this.jenisDipilih;
      var hasil = this.bahanAjar.filter(function (item) {
        var cocokTeks =
          item.namaBarang.toLowerCase().indexOf(kunci) > -1 ||
          item.kodeBarang.toLowerCase().indexOf(kunci) > -1 ||
          item.kodeLokasi.toLowerCase().indexOf(kunci) > -1;
        var cocokJenis = !jenis || item.jenisBarang === jenis;
        return cocokTeks && cocokJenis;
      });

      var kriteria = this.urutan;
      return hasil.slice().sort(function (a, b) {
        if (kriteria === "nama") return a.namaBarang.localeCompare(b.namaBarang);
        if (kriteria === "stok") return b.stok - a.stok;
        return a.kodeBarang.localeCompare(b.kodeBarang);
      });
    },

    ringkasanJenis: function () {
      return this.bahanAjar.reduce(function (hasil, item) {
        if (!hasil[item.jenisBarang]) {
          hasil[item.jenisBarang] = { jumlahModul: 0, totalStok: 0 };
        }
        hasil[item.jenisBarang].jumlahModul += 1;
        hasil[item.jenisBarang].totalStok += Number(item.stok || 0);
        return hasil;
      }, {});
    },

    adaDuplikat: function () {
      var kode = this.formTambah.kodeBarang;
      return this.bahanAjar.some(function (item) {
        return item.kodeBarang === kode;
      });
    }
  },

  // Watch: normalisasi input dan koreksi nilai stok negatif.
  watch: {
    // Watcher 1: kode barang otomatis dibersihkan dan diubah menjadi huruf kapital.
    "formTambah.kodeBarang": function (nilai) {
      var bersih = String(nilai).toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (bersih !== nilai) this.formTambah.kodeBarang = bersih;
    },

    // Watcher 2: jumlah stok tidak boleh negatif, langsung dikoreksi saat diketik.
    "formTambah.stok": function (nilai) {
      if (nilai === "" || nilai === null) return;
      if (Number(nilai) < 0) this.formTambah.stok = 0;
    }
  },

  // Methods: aksi tombol dan validasi form dijalankan dari sini.
  methods: {
    formKosong: function () {
      return {
        kodeLokasi: "",
        kodeBarang: "",
        namaBarang: "",
        jenisBarang: "BMP",
        edisi: "1",
        stok: 0,
        harga: 65000,
        cover: ""
      };
    },

    kelasStok: function (stok) {
      if (stok >= 300) return "high";
      if (stok >= 200) return "medium";
      return "low";
    },

    bukaTambah: function () {
      this.pesanForm = "";
      this.formTambah = this.formKosong();
      this.modalTambah = true;
    },

    simpanStok: function () {
      var data = this.formTambah;
      var stok = Number(data.stok);
      var harga = Number(data.harga);

      if (!data.kodeLokasi.trim() || !data.kodeBarang.trim() || !data.namaBarang.trim() || !data.edisi.trim()) {
        this.pesanForm = "Kode lokasi, kode barang, nama bahan ajar, dan edisi wajib diisi.";
        return;
      }

      if (isNaN(stok) || stok < 0) {
        this.pesanForm = "Jumlah stok harus berupa angka 0 atau lebih.";
        return;
      }

      if (isNaN(harga) || harga <= 0) {
        this.pesanForm = "Harga bahan ajar harus lebih besar dari 0.";
        return;
      }

      if (this.adaDuplikat) {
        this.pesanForm = 'Kode barang "' + data.kodeBarang + '" sudah terdaftar.';
        return;
      }

      this.$emit("tambah-stok", {
        kodeLokasi: data.kodeLokasi.trim().toUpperCase(),
        kodeBarang: data.kodeBarang.trim().toUpperCase(),
        namaBarang: data.namaBarang.trim(),
        jenisBarang: data.jenisBarang,
        edisi: data.edisi.trim(),
        stok: stok,
        harga: harga,
        cover: data.cover.trim() || "img/pengantar_komunikasi.jpg"
      });

      this.modalTambah = false;
      this.formTambah = this.formKosong();
    },

    konfirmasiHapus: function (item) {
      if (window.confirm('Hapus bahan ajar "' + item.namaBarang + '" (' + item.kodeBarang + ")?")) {
        this.$emit("hapus-stok", item.kodeBarang);
      }
    },

    lihatDetail: function (item) {
      this.itemDetail = item;
    },

    gantiCover: function (event) {
      event.target.src = "img/pengantar_komunikasi.jpg";
    }
  },

  template: `
    <main class="container page-main">
      <header class="stock-page-header">
        <div>
          <span class="page-eyebrow">INVENTARIS TIRAS &amp; GUDANG UT</span>
          <h1 class="page-title">Informasi Stok Bahan Ajar (BMP)</h1>
          <p class="page-desc">
            Data ketersediaan modul Buku Materi Pokok yang dikelola melalui komponen Vue
            dan dirender dengan directive <code>v-for</code>.
          </p>
        </div>

        <div class="page-header-actions">
          <span class="badge-count-pill">{{ daftarTampil.length }} / {{ bahanAjar.length }} Bahan Ajar</span>
          <button type="button" class="btn btn-primary" @click="bukaTambah">
            <span>➕</span> Tambah Stok Bahan Ajar
          </button>
        </div>
      </header>

      <article class="table-card">
        <div class="table-toolbar">
          <div class="input-with-icon table-search">
            <span class="input-icon">🔍</span>
            <!-- v-model: kata kunci pencarian terikat dua arah ke state kataKunci. -->
            <input
              v-model.trim="kataKunci"
              type="text"
              class="form-input"
              placeholder="Cari kode atau nama modul..."
              @keyup.esc="kataKunci = ''"
            >
          </div>

          <div class="filter-actions">
            <!-- v-show: tombol reset hanya disembunyikan lewat CSS saat pencarian kosong. -->
            <button v-show="kataKunci" type="button" class="link-btn reset-link" @click="kataKunci = ''">
              Reset pencarian
            </button>
            <label for="filterJenisBarang" class="filter-label">Jenis Barang:</label>
            <!-- v-model pada select: pilihan filter langsung mengubah state jenisDipilih. -->
            <select id="filterJenisBarang" v-model="jenisDipilih" class="form-input filter-select">
              <option value="">Semua Jenis</option>
              <option value="BMP">BMP (Buku Materi Pokok)</option>
              <option value="Non-BMP">Non-BMP</option>
              <option value="Suplemen">Suplemen Digital / Audio</option>
            </select>

            <label for="urutkanData" class="filter-label">Urutkan:</label>
            <select id="urutkanData" v-model="urutan" class="form-input filter-select">
              <option value="kode">Kode Barang</option>
              <option value="nama">Nama Bahan Ajar</option>
              <option value="stok">Stok Terbanyak</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Cover</th>
                <th scope="col">Kode Lokasi</th>
                <th scope="col">Kode Barang</th>
                <th scope="col">Nama Bahan Ajar</th>
                <th scope="col">Jenis</th>
                <th scope="col">Edisi</th>
                <th scope="col">Harga</th>
                <th scope="col">Stok Tersedia</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- v-if/v-else: template kosong tampil saat hasil filter tidak ada. -->
              <template v-if="daftarTampil.length === 0">
                <tr>
                  <td colspan="10" class="table-empty">
                    Tidak ada bahan ajar yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              </template>
              <template v-else>
                <!-- v-for zero-based index: (item, index) lalu index + 1 untuk nomor baris. -->
                <tr v-for="(item, index) in daftarTampil" :key="item.kodeBarang">
                  <td><strong>{{ index + 1 }}</strong></td>
                  <td>
                    <!-- v-bind: :src dan :alt mengikat atribut gambar ke data bahan ajar. -->
                    <img :src="item.cover" :alt="item.namaBarang" class="table-cover-thumb" @error="gantiCover">
                  </td>
                  <td><code>{{ item.kodeLokasi }}</code></td>
                  <td><strong class="kode-barang">{{ item.kodeBarang }}</strong></td>
                  <td>{{ item.namaBarang }}</td>
                  <td><span class="sample-badge">{{ item.jenisBarang }}</span></td>
                  <td>Edisi {{ item.edisi }}</td>
                  <td>{{ item.harga | rupiah }}</td>
                  <td>
                    <!-- v-bind:class + filter: warna badge mengikuti stok,
                         dan dua filter memformat angka serta label stok. -->
                    <span class="stock-badge" :class="'stock-' + kelasStok(item.stok)">
                      {{ item.stok | angka }} • {{ item.stok | labelStok }}
                    </span>
                  </td>
                  <td>
                    <div class="table-action-btns">
                      <button type="button" class="btn btn-outline btn-sm" title="Lihat detail" @click="lihatDetail(item)">
                        👁️ Detail
                      </button>
                      <button type="button" class="btn btn-danger-outline btn-sm" title="Hapus data" @click="konfirmasiHapus(item)">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </article>

      <section class="jenis-summary">
        <h2 class="section-title">📦 Ringkasan per Jenis Barang</h2>
        <div class="jenis-summary-grid">
          <!-- v-for name-based index: (ringkasan, jenis) membaca object ringkasanJenis. -->
          <article v-for="(ringkasan, jenis) in ringkasanJenis" :key="jenis" class="jenis-card">
            <span class="jenis-name">{{ jenis }}</span>
            <strong class="jenis-value">{{ ringkasan.jumlahModul }} modul</strong>
            <span class="jenis-stok">{{ ringkasan.totalStok | angka }} eksemplar</span>
          </article>
        </div>
      </section>

      <!-- custom element + props: modal tambah stok memakai BaseModal dan event tutup. -->
      <base-modal v-if="modalTambah" judul="➕ Tambah Baris Bahan Ajar Baru" lebar="600px" @tutup="modalTambah = false">
        <p class="modal-note">
          Data baru akan ditambahkan ke array reaktif sehingga tabel langsung diperbarui
          tanpa memuat ulang halaman.
        </p>

        <form novalidate @submit.prevent="simpanStok">
          <div class="form-grid-2">
            <div class="form-group">
              <label for="addKodeLokasi" class="form-label">Kode Lokasi</label>
              <input id="addKodeLokasi" v-model.trim="formTambah.kodeLokasi" type="text" class="form-input" placeholder="Misal: 0TMP01">
            </div>
            <div class="form-group">
              <label for="addKodeBarang" class="form-label">Kode Barang</label>
              <!-- v-model + watch: input ini mengubah formTambah.kodeBarang,
                   lalu watcher mengubahnya menjadi huruf kapital secara otomatis. -->
              <input id="addKodeBarang" v-model="formTambah.kodeBarang" type="text" class="form-input" placeholder="Misal: MKDU4110">
              <!-- v-if: peringatan duplikat muncul dari computed adaDuplikat. -->
              <small v-if="adaDuplikat" class="form-form-hint-danger">Kode ini sudah dipakai.</small>
            </div>
          </div>

          <div class="form-group">
            <label for="addNamaBarang" class="form-label">Nama Bahan Ajar / Modul</label>
            <input id="addNamaBarang" v-model.trim="formTambah.namaBarang" type="text" class="form-input" placeholder="Misal: Bahasa Indonesia Keilmuan">
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="addJenisBarang" class="form-label">Jenis Barang</label>
              <select id="addJenisBarang" v-model="formTambah.jenisBarang" class="form-input">
                <option value="BMP">BMP</option>
                <option value="Non-BMP">Non-BMP</option>
                <option value="Suplemen">Suplemen</option>
              </select>
            </div>
            <div class="form-group">
              <label for="addEdisi" class="form-label">Edisi</label>
              <input id="addEdisi" v-model.trim="formTambah.edisi" type="text" class="form-input" placeholder="Misal: 1">
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="addStok" class="form-label">Jumlah Stok</label>
              <!-- v-model.number: nilai input otomatis dikonversi menjadi angka. -->
              <input id="addStok" v-model.number="formTambah.stok" type="number" min="0" class="form-input" placeholder="Misal: 350">
            </div>
            <div class="form-group">
              <label for="addHarga" class="form-label">Harga Satuan (Rp)</label>
              <input id="addHarga" v-model.number="formTambah.harga" type="number" min="0" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label for="addCoverUrl" class="form-label">Path File Cover (Opsional)</label>
            <input id="addCoverUrl" v-model.trim="formTambah.cover" type="text" class="form-input" placeholder="img/pengantar_komunikasi.jpg">
          </div>

          <div v-if="pesanForm" class="custom-alert alert-danger">{{ pesanForm }}</div>

          <button type="submit" class="btn btn-primary btn-block">Simpan ke Daftar Stok</button>
        </form>
      </base-modal>

      <!-- conditional + props: modal detail hanya ada saat itemDetail terisi. -->
      <base-modal v-if="itemDetail" judul="Informasi Bahan Ajar" lebar="520px" @tutup="itemDetail = null">
        <div class="detail-card-layout">
          <img :src="itemDetail.cover" :alt="itemDetail.namaBarang" class="detail-cover-large" @error="gantiCover">
          <table class="detail-table">
            <tbody>
              <tr><th>Kode Lokasi</th><td><code>{{ itemDetail.kodeLokasi }}</code></td></tr>
              <tr><th>Kode Barang</th><td><strong class="kode-barang">{{ itemDetail.kodeBarang }}</strong></td></tr>
              <tr><th>Nama Barang</th><td>{{ itemDetail.namaBarang }}</td></tr>
              <tr><th>Jenis Barang</th><td><span class="sample-badge">{{ itemDetail.jenisBarang }}</span></td></tr>
              <tr><th>Edisi</th><td>Edisi {{ itemDetail.edisi }}</td></tr>
              <tr><th>Harga Satuan</th><td>{{ itemDetail.harga | rupiah }}</td></tr>
              <tr>
                <th>Stok Tersedia</th>
                <td>
                  <!-- filter + v-bind:class: angka diformat dan badge diberi warna sesuai stok. -->
                  <span class="detail-stok">{{ itemDetail.stok | angka }} Eksemplar</span>
                  <span class="stock-badge" :class="'stock-' + kelasStok(itemDetail.stok)">
                    {{ itemDetail.stok | labelStok }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </base-modal>
    </main>
  `
});
