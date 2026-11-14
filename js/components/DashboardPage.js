/**
 * Komponen: DashboardPage
 * Halaman utama setelah login. Menampilkan greeting yang mengikuti waktu
 * lokal (computed), jam digital lewat watcher + setInterval, ringkasan
 * statistik, pencarian cepat DO, dan pintasan menu.
 *
 * Event:
 * - navigasi      : pindah halaman
 * - laporan       : membuka modal laporan ('monitoring' / 'rekap')
 * - buka-tracking : membuka halaman tracking dengan nomor DO tertentu
 */
Vue.component("dashboard-page", {
  // Props: data bahan ajar, tracking, dan transaksi dibagikan dari root.
  props: {
    pengguna: {
      type: Object,
      required: true
    },
    bahanAjar: {
      type: Array,
      required: true
    },
    tracking: {
      type: Object,
      required: true
    },
    transaksi: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },

  data: function () {
    return {
      sekarang: new Date(),
      timerJam: null,
      kataKunciDO: "",
      pesanCari: ""
    };
  },

  // Computed: greeting, jam, tanggal, dan statistik dihitung dari state saat ini.
  computed: {
    salam: function () {
      var jam = this.sekarang.getHours();
      if (jam >= 4 && jam < 11) return "Selamat Pagi";
      if (jam >= 11 && jam < 15) return "Selamat Siang";
      if (jam >= 15 && jam < 18) return "Selamat Sore";
      return "Selamat Malam";
    },

    tagWaktu: function () {
      return "☀️ " + this.salam + " • Waktu Lokal";
    },

    // v-html dipakai karena sapaan menyisipkan penanda warna pada nama pengguna.
    // Nama hasil registrasi di-escape lebih dulu agar tidak bisa menyisipkan markup.
    sapaanHtml: function () {
      return (
        this.salam +
        ', <span style="color: var(--ut-gold);">' +
        this.escapeHtml(this.pengguna.nama) +
        "</span> 👋"
      );
    },

    jam: function () {
      return this.sekarang.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    },

    tanggal: function () {
      return this.sekarang.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    },

    totalStok: function () {
      return this.bahanAjar.reduce(function (total, item) {
        return total + Number(item.stok || 0);
      }, 0);
    },

    jumlahDO: function () {
      return Object.keys(this.tracking).length;
    },

    stokMenipis: function () {
      return this.bahanAjar.filter(function (item) {
        return item.stok < 200;
      });
    },

    contohDO: function () {
      var daftar = this.tracking;
      return Object.keys(daftar)
        .slice(0, 2)
        .map(function (nomor) {
          return daftar[nomor];
        });
    }
  },

  // Watch: input nomor DO dinormalisasi dan pesan error dibersihkan.
  watch: {
    // Watcher: nomor DO hanya boleh berisi angka dan pesan error lama dibersihkan.
    kataKunciDO: function (nilai) {
      if (this.pesanCari) this.pesanCari = "";

      var bersih = String(nilai).replace(/[^0-9]/g, "");
      if (bersih !== nilai) this.kataKunciDO = bersih;
    }
  },

  mounted: function () {
    var komponen = this;
    this.timerJam = setInterval(function () {
      komponen.sekarang = new Date();
    }, 1000);
  },

  beforeDestroy: function () {
    if (this.timerJam) clearInterval(this.timerJam);
  },

  // Methods: handler event untuk pencarian DO dan navigasi.
  methods: {
    escapeHtml: function (teks) {
      return String(teks).replace(/[&<>"']/g, function (karakter) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[karakter];
      });
    },

    cariDO: function () {
      var nomor = this.kataKunciDO.trim();

      if (!nomor) {
        this.pesanCari = "Silakan masukkan nomor Delivery Order terlebih dahulu.";
        return;
      }

      this.pesanCari = "";
      this.$emit("buka-tracking", nomor);
    },

    cariContoh: function (nomor) {
      this.kataKunciDO = nomor;
      this.cariDO();
    },

    bukaLaporan: function (jenis) {
      this.$emit("laporan", jenis);
    },

    pilih: function (halaman) {
      this.$emit("navigasi", halaman);
    }
  },

  template: `
    <div>
      <section class="dashboard-hero">
        <div class="container hero-content">
          <div class="hero-greeting-box">
            <!-- v-text: menampilkan tag waktu sebagai teks murni. -->
            <div class="greeting-time-tag" v-text="tagWaktu"></div>
            <!-- v-html: sapaan berisi <span> berwarna; nama pengguna sudah di-escape. -->
            <h1 class="hero-title" v-html="sapaanHtml"></h1>
            <p class="hero-subtitle">
              Selamat datang di portal pelayanan tiras dan pemesanan modul bahan ajar Universitas Terbuka.
              Pantau distribusi dan ketersediaan stok BMP secara real-time.
            </p>
          </div>

          <div class="hero-clock-box hero-banner-accent">
            <div class="hero-clock-label">Waktu Lokal Sistem</div>
            <div class="clock-time">{{ jam }}</div>
            <div class="clock-date">{{ tanggal | kapital }}</div>
            <div class="dashboard-badge-live">Status: Online</div>
          </div>
        </div>
      </section>

      <main class="container page-main">
        <section class="metrics-grid" aria-label="Ringkasan Statistik">
          <article class="metric-card">
            <div class="metric-icon-box metric-blue">📚</div>
            <div class="metric-info">
              <span class="metric-value">{{ bahanAjar.length }}</span>
              <span class="metric-label">Judul Modul Bahan Ajar</span>
            </div>
          </article>

          <article class="metric-card">
            <div class="metric-icon-box metric-gold">📦</div>
            <div class="metric-info">
              <!-- filter: pipe | angka memberi pemisah ribuan pada angka. -->
              <span class="metric-value">{{ totalStok | angka }}</span>
              <span class="metric-label">Total Eksemplar Tersedia</span>
            </div>
          </article>

          <article class="metric-card">
            <div class="metric-icon-box metric-green">🚚</div>
            <div class="metric-info">
              <span class="metric-value">{{ jumlahDO }}</span>
              <span class="metric-label">Delivery Order Terpantau</span>
            </div>
          </article>

          <article class="metric-card">
            <div class="metric-icon-box metric-purple">🧾</div>
            <div class="metric-info">
              <span class="metric-value">{{ transaksi.length }}</span>
              <span class="metric-label">Transaksi Pemesanan</span>
            </div>
          </article>
        </section>

        <section class="quick-search-section">
          <header class="section-head">
            <div>
              <h2 class="section-title">
                <span>🔎</span> Pencarian Cepat Delivery Order (DO)
              </h2>
              <p class="section-subtitle">
                Lacak progres pengiriman paket bahan ajar mahasiswa langsung dengan memasukkan nomor DO
              </p>
            </div>
          </header>

          <!-- event keyboard: @submit.prevent + @keyup.enter menjalankan pencarian DO. -->
          <form @submit.prevent="cariDO">
            <div class="search-input-group">
              <input
                v-model.trim="kataKunciDO"
                type="text"
                class="form-input"
                placeholder="Masukkan Nomor DO (misal: 2023001234)"
                @keyup.enter="cariDO"
              >
              <button type="submit" class="btn btn-primary btn-nowrap">
                <span>Cari Paket</span> ➔
              </button>
            </div>
            <!-- v-if: pesan validasi hanya tampil jika state pesanCari terisi. -->
            <div v-if="pesanCari" class="custom-alert alert-danger">{{ pesanCari }}</div>
          </form>

          <div class="sample-pills-row">
            <span>Contoh Nomor DO:</span>
            <!-- v-for zero-based index: menampilkan contoh nomor DO dari array. -->
            <button
              v-for="(item, index) in contohDO"
              :key="item.nomorDO"
              type="button"
              class="sample-badge"
              @click="cariContoh(item.nomorDO)"
            >
              #{{ item.nomorDO }} ({{ item.nama }} - {{ item.ekspedisi }})
            </button>
          </div>
        </section>

        <section aria-label="Menu Pintas">
          <h2 class="section-title section-title-spaced">📌 Akses Cepat Menu Layanan SITTA</h2>

          <div class="nav-shortcut-grid">
            <a href="#/stok" class="shortcut-card" @click.prevent="pilih('stok')">
              <div>
                <div class="shortcut-header">
                  <div class="shortcut-icon">📖</div>
                  <h3 class="shortcut-title">Informasi Bahan Ajar</h3>
                </div>
                <p class="shortcut-desc">
                  Kelola katalog Buku Materi Pokok (BMP), cek ketersediaan stok di gudang
                  dan UPBJJ, serta tambah data bahan ajar baru.
                </p>
              </div>
              <span class="shortcut-link-text">Buka Kelola Stok ➔</span>
            </a>

            <a href="#/pemesanan" class="shortcut-card" @click.prevent="pilih('pemesanan')">
              <div>
                <div class="shortcut-header">
                  <div class="shortcut-icon shortcut-icon-gold">🧾</div>
                  <h3 class="shortcut-title">Pemesanan Bahan Ajar</h3>
                </div>
                <p class="shortcut-desc">
                  Buat pesanan modul untuk UPBJJ, hitung total pembayaran secara otomatis,
                  dan pantau riwayat transaksi pemesanan.
                </p>
              </div>
              <span class="shortcut-link-text">Buat Pesanan ➔</span>
            </a>

            <a href="#/histori" class="shortcut-card" @click.prevent="pilih('histori')">
              <div>
                <div class="shortcut-header">
                  <div class="shortcut-icon shortcut-icon-purple">📜</div>
                  <h3 class="shortcut-title">Histori Transaksi</h3>
                </div>
                <p class="shortcut-desc">
                  Telusuri seluruh transaksi pemesanan, cari berdasarkan ID atau pemesan,
                  dan saring berdasarkan status pemrosesan.
                </p>
              </div>
              <span class="shortcut-link-text">Buka Histori ➔</span>
            </a>

            <a href="#/tracking" class="shortcut-card" @click.prevent="pilih('tracking')">
              <div>
                <div class="shortcut-header">
                  <div class="shortcut-icon shortcut-icon-blue">🚚</div>
                  <h3 class="shortcut-title">Tracking Pengiriman</h3>
                </div>
                <p class="shortcut-desc">
                  Cek status resi ekspedisi DO, rincian biaya pengiriman paket BMP,
                  dan timeline pergerakan paket antar kota.
                </p>
              </div>
              <span class="shortcut-link-text">Lacak Pengiriman ➔</span>
            </a>

            <button type="button" class="shortcut-card shortcut-card-button" @click="bukaLaporan('monitoring')">
              <div>
                <div class="shortcut-header">
                  <div class="shortcut-icon shortcut-icon-purple">📊</div>
                  <h3 class="shortcut-title">Monitoring Progress DO</h3>
                </div>
                <p class="shortcut-desc">
                  Pantau seluruh status pesanan DO yang sedang berjalan, dikemas di Puslaba,
                  diteruskan ke UPBJJ, atau telah sampai di alamat mahasiswa.
                </p>
              </div>
              <span class="shortcut-link-text">Buka Laporan DO ➔</span>
            </button>

            <button type="button" class="shortcut-card shortcut-card-button" @click="bukaLaporan('rekap')">
              <div>
                <div class="shortcut-header">
                  <div class="shortcut-icon shortcut-icon-green">📑</div>
                  <h3 class="shortcut-title">Rekap Bahan Ajar</h3>
                </div>
                <p class="shortcut-desc">
                  Lihat laporan rekapitulasi tiras, persentase persebaran inventaris modul,
                  dan statistik ketersediaan bahan ajar per jenis.
                </p>
              </div>
              <span class="shortcut-link-text">Buka Rekapitulasi ➔</span>
            </button>
          </div>
        </section>

        <!-- v-if + v-for: daftar restock hanya muncul jika stok di bawah 200. -->
        <section v-if="stokMenipis.length > 0" class="restock-card">
          <h2 class="section-title">⚠️ Bahan Ajar yang Perlu Restock</h2>
          <p class="section-subtitle">Stok di bawah 200 eksemplar dan perlu segera ditambah.</p>
          <ul class="restock-list">
            <li v-for="(item, index) in stokMenipis" :key="item.kodeBarang">
              <span class="restock-name">
                <strong>{{ index + 1 }}.</strong> {{ item.namaBarang | kapital }}
                <code>{{ item.kodeBarang }}</code>
              </span>
              <span class="stock-badge stock-low">{{ item.stok | angka }} eksemplar</span>
            </li>
          </ul>
          <button type="button" class="btn btn-outline btn-sm" @click="pilih('stok')">Kelola stok sekarang</button>
        </section>
      </main>
    </div>
  `
});
