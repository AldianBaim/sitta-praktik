/**
 * Komponen: AppHeader
 * Header navigasi utama SITTA UT. Menerima data pengguna aktif dan halaman
 * yang sedang dibuka sebagai props, lalu mengirim event ke root saat menu
 * diklik. Pola inilah yang membuat header bisa dipakai ulang di semua halaman.
 */
// Komunikasi komponen: header menerima props dan mengirim event ke root.
Vue.component("app-header", {
  // Props: data dari root masuk sebagai props (one-way binding).
  props: {
    pengguna: {
      type: Object,
      required: true
    },
    halaman: {
      type: String,
      default: "dashboard"
    }
  },

  // Computed: label peran dihitung dari props pengguna.
  computed: {
    labelPeran: function () {
      return this.pengguna.role + " • " + (this.pengguna.lokasi || "Pusat");
    }
  },

  methods: {
    pilih: function (tujuan) {
      this.$emit("navigasi", tujuan);
    },

    bukaLaporan: function (jenis) {
      this.$emit("laporan", jenis);
    },

    keluar: function () {
      this.$emit("logout");
    }
  },

  template: `
    <header class="main-header">
      <div class="container navbar-container">

        <a href="#/dashboard" class="brand-wrapper" aria-label="Beranda SITTA UT" @click.prevent="pilih('dashboard')">
          <img src="assets/pngwing.com%20(2).png" alt="Logo UT SITTA" class="brand-logo-img">
          <div class="brand-text">
            <span class="brand-title">SITTA <span class="badge-ut">UT</span></span>
            <span class="brand-subtitle">Sistem Informasi Tiras &amp; Transaksi Bahan Ajar</span>
          </div>
        </a>

        <nav class="main-nav" aria-label="Menu Utama">
          <!-- v-bind:class: class "active" mengikuti halaman yang sedang dibuka. -->
          <!-- event mouse: @click.prevent mencegah reload lalu mengirim event navigasi. -->
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#/dashboard" class="nav-link" :class="{ active: halaman === 'dashboard' }" @click.prevent="pilih('dashboard')">
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a href="#/stok" class="nav-link" :class="{ active: halaman === 'stok' }" title="Informasi Bahan Ajar" @click.prevent="pilih('stok')">
                Bahan Ajar
              </a>
            </li>
            <li class="nav-item">
              <a href="#/pemesanan" class="nav-link" :class="{ active: halaman === 'pemesanan' }" @click.prevent="pilih('pemesanan')">
                Pemesanan
              </a>
            </li>
            <li class="nav-item">
              <a href="#/tracking" class="nav-link" :class="{ active: halaman === 'tracking' }" title="Tracking Pengiriman" @click.prevent="pilih('tracking')">
                Tracking
              </a>
            </li>
            <li class="nav-item dropdown">
              <a href="#laporan" class="nav-link" aria-haspopup="true" @click.prevent="bukaLaporan('monitoring')">
                Laporan <span class="dropdown-arrow">▼</span>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <!-- emit: child meminta root membuka modal lewat event laporan. -->
                  <a href="#laporan" class="dropdown-link" @click.prevent="bukaLaporan('monitoring')">
                    <span class="dropdown-icon">📊</span> Monitoring Progress DO Bahan Ajar
                  </a>
                </li>
                <li>
                  <a href="#laporan" class="dropdown-link" @click.prevent="bukaLaporan('rekap')">
                    <span class="dropdown-icon">📑</span> Rekap Bahan Ajar
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="#/histori" class="nav-link" :class="{ active: halaman === 'histori' }" title="Histori Transaksi Bahan Ajar" @click.prevent="pilih('histori')">
                Histori
              </a>
            </li>
          </ul>
        </nav>

        <div class="nav-user">
          <div class="user-badge">
            <!-- filter: pipe | inisial mengubah nama menjadi dua huruf awal. -->
            <div class="user-avatar">{{ pengguna.nama | inisial }}</div>
            <div class="user-meta">
              <span class="user-name">{{ pengguna.nama }}</span>
              <span class="user-role">{{ labelPeran }}</span>
            </div>
          </div>
          <button type="button" class="btn-logout" title="Keluar dari Akun" @click="keluar">Keluar</button>
        </div>

      </div>
    </header>
  `
});
