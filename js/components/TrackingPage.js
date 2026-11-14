/**
 * Komponen: TrackingPage
 * Halaman pelacakan Delivery Order. Nomor DO dicari ke objek dataTracking,
 * lalu status, progress bar, dan timeline dirender dengan v-for serta
 * conditional v-if / v-else-if / v-else.
 *
 * Props:
 * - tracking  : objek seluruh data DO, key-nya adalah nomor DO
 * - nomorAwal : nomor DO yang dikirim dari dashboard (opsional)
 */
Vue.component("tracking-page", {
  props: {
    tracking: {
      type: Object,
      required: true
    },
    nomorAwal: {
      type: String,
      default: ""
    }
  },

  data: function () {
    return {
      nomorDO: "",
      hasil: null,
      pesanError: "",
      sudahCari: false
    };
  },

  // Computed: status, ikon, persentase, dan style progress dihitung dari hasil tracking.
  computed: {
    contohDO: function () {
      var daftar = this.tracking;
      return Object.keys(daftar)
        .slice(0, 2)
        .map(function (nomor) {
          return daftar[nomor];
        });
    },

    statusInfo: function () {
      if (!this.hasil) {
        return { kelas: "badge-process", ikon: "⏳", persen: 0 };
      }

      var status = this.hasil.status.toLowerCase();

      if (status.indexOf("selesai") > -1 || status.indexOf("diterima") > -1) {
        return { kelas: "badge-delivered", ikon: "✅", persen: 100 };
      }
      if (status.indexOf("dikirim") > -1) {
        return { kelas: "badge-delivered", ikon: "📦", persen: 85 };
      }
      if (status.indexOf("perjalanan") > -1) {
        return { kelas: "badge-on-delivery", ikon: "🚚", persen: 55 };
      }
      return { kelas: "badge-process", ikon: "⏳", persen: 30 };
    },

    progressStyle: function () {
      return { width: this.statusInfo.persen + "%" };
    }
  },

  // Watch: watcher menjaga pesan error, memproses nomor dari dashboard, dan menggulir hasil.
  watch: {
    // Watcher 1: hasil pencarian baru otomatis digulir ke area pandang.
    hasil: function (nilai) {
      if (!nilai) return;
      var komponen = this;
      this.$nextTick(function () {
        if (komponen.$refs.hasilTracking) {
          komponen.$refs.hasilTracking.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },

    // Watcher 2: pesan error dibersihkan begitu nomor DO diubah.
    nomorDO: function () {
      if (this.pesanError) this.pesanError = "";
    },

    // Watcher 3: nomor DO yang dikirim dari dashboard langsung diproses.
    nomorAwal: function (nilai) {
      if (nilai) {
        this.nomorDO = nilai;
        this.cari();
      }
    }
  },

  created: function () {
    if (this.nomorAwal) {
      this.nomorDO = this.nomorAwal;
      this.cari();
    }
  },

  methods: {
    cari: function () {
      var nomor = this.nomorDO.trim();
      this.sudahCari = true;

      if (!nomor) {
        this.hasil = null;
        this.pesanError = "Silakan masukkan Nomor Delivery Order terlebih dahulu.";
        return;
      }

      var data = this.tracking[nomor];

      if (!data) {
        this.hasil = null;
        this.pesanError =
          'Nomor Delivery Order "' + nomor + '" tidak ditemukan. Contoh nomor yang tersedia: ' +
          this.contohDO.map(function (item) {
            return item.nomorDO;
          }).join(" atau ") + ".";
        return;
      }

      this.pesanError = "";
      this.hasil = data;
    },

    cariContoh: function (nomor) {
      this.nomorDO = nomor;
      this.cari();
    }
  },

  template: `
    <main class="container page-main">
      <section class="tracking-hero-card">
        <header>
          <span class="page-eyebrow">LAYANAN EKSPEDISI BAHAN AJAR UT</span>
          <h1 class="page-title">Lacak Pengiriman Bahan Ajar (Delivery Order)</h1>
          <p class="page-desc">
            Masukkan Nomor DO pesanan untuk memeriksa status kurir, estimasi, dan detail
            tahapan perjalanan paket.
          </p>
        </header>

        <form novalidate @submit.prevent="cari">
          <div class="tracking-search-bar">
            <div class="input-with-icon tracking-search-field">
              <span class="input-icon">🔍</span>
              <!-- v-model: nomor DO terikat dua arah ke state nomorDO. -->
              <input
                v-model.trim="nomorDO"
                type="text"
                class="form-input"
                placeholder="Masukkan Nomor DO (misal: 2023001234)"
                autocomplete="off"
                @keyup.enter="cari"
              >
            </div>
            <button type="submit" class="btn btn-primary tracking-search-btn">
              <span>Cari</span> ➔
            </button>
          </div>
        </form>

        <div class="pill-hint">
          <span>💡 Uji coba cepat (klik untuk mencari):</span>
          <!-- v-for zero-based index: menampilkan contoh nomor DO dari object tracking. -->
          <button
            v-for="(item, index) in contohDO"
            :key="item.nomorDO"
            type="button"
            class="sample-badge"
            @click="cariContoh(item.nomorDO)"
          >
            DO #{{ item.nomorDO }} ({{ item.nama }} - {{ item.ekspedisi }})
          </button>
        </div>
      </section>

      <!-- v-if: pesan error hanya tampil ketika pencarian gagal. -->
      <div v-if="pesanError" class="custom-alert alert-danger">{{ pesanError }}</div>

      <!-- v-if/v-else-if: hasil tracking tampil jika ditemukan, kartu kosong jika belum mencari. -->
      <section v-if="hasil" ref="hasilTracking" aria-live="polite">
        <div class="tracking-result-box">
          <div class="tracking-header-banner">
            <div>
              <div class="do-number-tag">Nomor Delivery Order: <strong>#{{ hasil.nomorDO }}</strong></div>
              <h2 class="do-recipient-name">{{ hasil.nama }}</h2>
            </div>
            <div>
              <!-- v-bind:class: kelas badge mengikuti status pengiriman. -->
              <span class="tracking-status-badge" :class="statusInfo.kelas">
                <span>{{ statusInfo.ikon }}</span> {{ hasil.status }}
              </span>
            </div>
          </div>

          <div class="tracking-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Ekspedisi</span>
              <span class="meta-value">{{ hasil.ekspedisi }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Tanggal Kirim</span>
              <!-- Filter: tanggal diformat menjadi format Indonesia. -->
              <span class="meta-value">{{ hasil.tanggalKirim | tanggal }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Jenis Paket</span>
              <span class="meta-value">{{ hasil.paket }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Total Pembayaran</span>
              <span class="meta-value meta-value-accent">{{ hasil.total }}</span>
            </div>
          </div>

          <div class="progress-bar-container">
            <div class="progress-label-row">
              <span>Proses Pengiriman SITTA</span>
              <span>{{ statusInfo.persen }}% Selesai</span>
            </div>
            <div class="progress-track">
              <!-- v-bind:style: lebar progress bar mengikuti persentase status. -->
              <div class="progress-fill" :style="progressStyle"></div>
            </div>
          </div>

          <div class="timeline-section">
            <h3 class="timeline-title">
              <span>📍</span> Riwayat Perjalanan Paket (Tracking Timeline)
            </h3>
            <ol class="timeline-list">
              <!-- v-for zero-based index: setiap langkah perjalanan mendapat nomor urut. -->
              <li v-for="(langkah, index) in hasil.perjalanan" :key="index" class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-box">
                  <div class="timeline-time">
                    <span>🕒</span> {{ langkah.waktu }}
                    <span class="timeline-step">Langkah {{ index + 1 }}</span>
                  </div>
                  <div class="timeline-desc">{{ langkah.keterangan }}</div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section v-else-if="!sudahCari" class="empty-tracking">
        <span class="empty-tracking-icon">📦</span>
        <h2>Belum ada nomor DO yang dicari</h2>
        <p>Gunakan formulir di atas atau pilih salah satu contoh nomor untuk melihat hasil pelacakan.</p>
      </section>
    </main>
  `
});
