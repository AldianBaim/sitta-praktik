/**
 * Komponen: AppFooter
 * Footer statis yang dipakai ulang di seluruh halaman aplikasi.
 */
Vue.component("app-footer", {
  template: `
    <footer class="main-footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <span class="footer-brand-title">SITTA UT • Sistem Informasi Tiras &amp; Bahan Ajar</span>
          <p class="footer-brand-desc">
            Implementasi antarmuka Vue.js untuk pemesanan dan distribusi bahan ajar Universitas Terbuka.
          </p>
        </div>
        <ul class="footer-links">
          <li><a href="#/dashboard">Dashboard</a></li>
          <li><a href="#/stok">Informasi Bahan Ajar</a></li>
          <li><a href="#/pemesanan">Pemesanan</a></li>
          <li><a href="#/tracking">Tracking Pengiriman</a></li>
        </ul>
      </div>
      <div class="footer-bottom">
        &copy; 2026 Universitas Terbuka • Tugas Praktik 3 Pemrograman Web (Vue.js)
      </div>
    </footer>
  `
});
