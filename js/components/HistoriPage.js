/**
 * Komponen: HistoriPage
 * Halaman khusus riwayat transaksi pemesanan bahan ajar. Dipisahkan dari
 * PemesananPage agar formulir pesanan dan daftar histori punya fokus
 * masing-masing, tetapi tetap membaca array transaksi yang sama dari root.
 */
Vue.component("histori-page", {
  props: {
    transaksi: {
      type: Array,
      required: true
    }
  },

  // v-model: kata kunci pencarian dan filter status memakai two-way data binding.
  data: function () {
    return {
      kataKunci: "",
      filterStatus: ""
    };
  },

  // Computed: hasil filter, total eksemplar, nilai transaksi, dan rekap dihitung otomatis.
  computed: {
    transaksiTampil: function () {
      var kunci = this.kataKunci.toLowerCase();
      var status = this.filterStatus;

      return this.transaksi.filter(function (item) {
        var cocokTeks =
          item.id.toLowerCase().indexOf(kunci) > -1 ||
          item.namaBarang.toLowerCase().indexOf(kunci) > -1 ||
          item.kodeBarang.toLowerCase().indexOf(kunci) > -1 ||
          item.pemesan.toLowerCase().indexOf(kunci) > -1 ||
          item.upbjj.toLowerCase().indexOf(kunci) > -1;
        var cocokStatus = !status || item.status === status;
        return cocokTeks && cocokStatus;
      });
    },

    totalEksemplar: function () {
      return this.transaksiTampil.reduce(function (total, item) {
        return total + Number(item.jumlah || 0);
      }, 0);
    },

    totalNilai: function () {
      return this.transaksiTampil.reduce(function (total, item) {
        return total + Number(item.total || 0);
      }, 0);
    },

    ringkasanStatus: function () {
      return this.transaksi.reduce(function (hasil, item) {
        hasil[item.status] = (hasil[item.status] || 0) + 1;
        return hasil;
      }, {});
    }
  },

  methods: {
    kelasStatus: function (status) {
      if (status === "Selesai") return "stock-high";
      if (status === "Dikirim") return "stock-medium";
      return "stock-low";
    }
  },

  template: `
    <main class="container page-main">
      <header class="stock-page-header">
        <div>
          <span class="page-eyebrow">RIWAYAT DISTRIBUSI BAHAN AJAR</span>
          <h1 class="page-title">Histori Transaksi Bahan Ajar</h1>
          <p class="page-desc">
            Seluruh transaksi pemesanan yang tercatat pada sesi ini, lengkap dengan
            identitas pemesan, unit UPBJJ, jumlah eksemplar, dan status pemrosesan.
          </p>
        </div>
        <span class="badge-count-pill">{{ transaksi.length }} Transaksi Tercatat</span>
      </header>

      <section class="report-metrics histori-metrics" aria-label="Ringkasan Transaksi">
        <div class="report-metric">
          <span>{{ transaksiTampil.length }}</span>
          <small>Transaksi Ditampilkan</small>
        </div>
        <div class="report-metric">
          <span>{{ totalEksemplar | angka }}</span>
          <small>Total Eksemplar</small>
        </div>
        <div class="report-metric">
          <span>{{ totalNilai | rupiah }}</span>
          <small>Nilai Transaksi</small>
        </div>
      </section>

      <article class="table-card">
        <div class="table-toolbar">
          <div class="input-with-icon table-search">
            <span class="input-icon">🔍</span>
            <!-- v-model: input pencarian langsung memperbarui state kataKunci. -->
            <input
              v-model.trim="kataKunci"
              type="text"
              class="form-input"
              placeholder="Cari ID, bahan ajar, atau pemesan..."
              @keyup.esc="kataKunci = ''"
            >
          </div>

          <div class="filter-actions">
            <!-- v-show: tombol reset hanya disembunyikan lewat CSS saat pencarian kosong. -->
            <button v-show="kataKunci" type="button" class="link-btn reset-link" @click="kataKunci = ''">
              Reset pencarian
            </button>
            <label for="filterStatusHistori" class="filter-label">Status:</label>
            <!-- v-model pada select: pilihan status menyaring tabel secara reaktif. -->
            <select id="filterStatusHistori" v-model="filterStatus" class="form-input filter-select">
              <option value="">Semua Status</option>
              <option v-for="(jumlah, status) in ringkasanStatus" :key="status" :value="status">
                {{ status }} ({{ jumlah }})
              </option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table table-compact histori-table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">ID Transaksi</th>
                <th scope="col">Tanggal</th>
                <th scope="col">Bahan Ajar</th>
                <th scope="col">Pemesan</th>
                <th scope="col">Jumlah</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <!-- v-if/v-else: baris kosong tampil ketika hasil filter tidak ada. -->
              <template v-if="transaksiTampil.length === 0">
                <tr>
                  <td colspan="8" class="table-empty">Tidak ada transaksi yang sesuai dengan filter.</td>
                </tr>
              </template>
              <template v-else>
                <!-- v-for zero-based index: (item, index) lalu index + 1 untuk nomor urut. -->
                <tr v-for="(item, index) in transaksiTampil" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td><code>{{ item.id }}</code></td>
                  <td>{{ item.tanggal | tanggal }}</td>
                  <td>
                    <strong>{{ item.namaBarang }}</strong>
                    <span class="table-sub">{{ item.kodeBarang }}</span>
                  </td>
                  <td>
                    {{ item.pemesan }}
                    <span class="table-sub">{{ item.upbjj }}</span>
                  </td>
                  <td>{{ item.jumlah | angka }} eks.</td>
                  <td><strong>{{ item.total | rupiah }}</strong></td>
                  <!-- v-bind:class: warna badge mengikuti status transaksi. -->
                  <td><span class="stock-badge" :class="kelasStatus(item.status)">{{ item.status }}</span></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </article>

      <section class="jenis-summary">
        <h2 class="section-title">📊 Rekap Status Transaksi</h2>
        <div class="jenis-summary-grid">
          <!-- v-for name-based index: (jumlah, status) membaca object ringkasanStatus. -->
          <article v-for="(jumlah, status) in ringkasanStatus" :key="status" class="jenis-card">
            <span class="jenis-name">{{ status }}</span>
            <strong class="jenis-value">{{ jumlah }} transaksi</strong>
            <span class="jenis-stok">Status pemrosesan pesanan</span>
          </article>
        </div>
      </section>
    </main>
  `
});
