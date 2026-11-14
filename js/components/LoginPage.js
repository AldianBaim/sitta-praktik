/**
 * Komponen: LoginPage
 * Halaman masuk SITTA UT. Menampilkan formulir login, modal lupa password,
 * dan modal registrasi. Validasi dilakukan di methods, sedangkan pesan error
 * dibersihkan otomatis lewat watcher ketika pengguna mengetik ulang.
 *
 * Event:
 * - login : dikirim ke root bersama objek pengguna yang berhasil terautentikasi
 */
Vue.component("login-page", {
  // v-model: form di bawah terikat ke object form (two-way data binding).
  data: function () {
    return {
      form: {
        email: "",
        password: ""
      },
      lihatPassword: false,
      pesanError: "",
      pesanSukses: "",
      modalAktif: "",
      resetEmail: "",
      pesanReset: "",
      formDaftar: {
        nama: "",
        email: "",
        password: "",
        role: "UPBJJ-UT",
        lokasi: ""
      },
      pesanDaftar: "",
      daftarPengguna: dataPengguna.slice(),
      fiturLogin: [
        { ikon: "📚", judul: "Katalog & Stok BMP", teks: "Pantau ketersediaan tiap gudang UPBJJ" },
        { ikon: "🚚", judul: "Tracking Delivery Order", teks: "Riwayat perjalanan paket per kota" },
        { ikon: "📊", judul: "Laporan Real-Time", teks: "Monitoring DO & rekapitulasi tiras" }
      ]
    };
  },

  // Computed: daftar akun demo dan judul modal adalah nilai turunan dari state.
  computed: {
    akunDemo: function () {
      return this.daftarPengguna.slice(0, 2);
    },

    judulModal: function () {
      if (this.modalAktif === "lupa") return "🔑 Pemulihan Password";
      if (this.modalAktif === "daftar") return "📝 Registrasi Pengguna SITTA";
      return "";
    }
  },

  // Watch: pesan error dibersihkan otomatis saat email/password diubah.
  watch: {
    "form.email": function () {
      if (this.pesanError) this.pesanError = "";
    },

    "form.password": function () {
      if (this.pesanError) this.pesanError = "";
    }
  },

  // Methods: validasi dan aksi dijalankan saat form disubmit.
  methods: {
    masuk: function () {
      var email = this.form.email.trim().toLowerCase();
      var password = this.form.password;

      if (!email || !password) {
        this.pesanSukses = "";
        this.pesanError = "email/password yang anda masukkan salah";
        return;
      }

      var pengguna = this.daftarPengguna.find(function (akun) {
        return akun.email.toLowerCase() === email && akun.password === password;
      });

      if (!pengguna) {
        this.pesanSukses = "";
        this.pesanError = "email/password yang anda masukkan salah";
        return;
      }

      this.pesanError = "";
      this.pesanSukses = "Login berhasil. Mengalihkan ke dashboard SITTA...";
      this.$emit("login", pengguna);
    },

    pakaiAkun: function (akun) {
      this.form.email = akun.email;
      this.form.password = akun.password;
      this.pesanSukses = "";
      this.pesanError = "";
    },

    bukaModal: function (namaModal) {
      this.modalAktif = namaModal;
      this.pesanReset = "";
      this.pesanDaftar = "";
    },

    tutupModal: function () {
      this.modalAktif = "";
    },

    kirimReset: function () {
      var email = this.resetEmail.trim().toLowerCase();
      var terdaftar = this.daftarPengguna.some(function (akun) {
        return akun.email.toLowerCase() === email;
      });

      if (!email || !terdaftar) {
        this.pesanReset = 'Email "' + this.resetEmail + '" tidak terdaftar dalam sistem SITTA UT.';
        return;
      }

      this.pesanReset = "Instruksi reset password telah dikirimkan ke " + email + ".";
      this.resetEmail = "";
    },

    daftarAkun: function () {
      var data = this.formDaftar;
      var email = data.email.trim().toLowerCase();

      if (!data.nama.trim() || !email || !data.password || !data.lokasi.trim()) {
        this.pesanDaftar = "Semua field pendaftaran wajib diisi.";
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        this.pesanDaftar = "Format email belum sesuai, contoh: nama@ut.ac.id.";
        return;
      }

      if (data.password.length < 6) {
        this.pesanDaftar = "Password minimal 6 karakter.";
        return;
      }

      var sudahAda = this.daftarPengguna.some(function (akun) {
        return akun.email.toLowerCase() === email;
      });

      if (sudahAda) {
        this.pesanDaftar = "Email tersebut sudah terdaftar. Gunakan email lain.";
        return;
      }

      this.daftarPengguna.push({
        id: this.daftarPengguna.length + 1,
        nama: data.nama.trim(),
        email: email,
        password: data.password,
        role: data.role,
        lokasi: data.lokasi.trim()
      });

      this.form.email = email;
      this.form.password = data.password;
      this.pesanDaftar = "";
      this.pesanSukses = 'Akun "' + data.nama.trim() + '" berhasil dibuat. Silakan klik Masuk ke SITTA.';
      this.formDaftar = { nama: "", email: "", password: "", role: "UPBJJ-UT", lokasi: "" };
      this.modalAktif = "";
    }
  },

  template: `
    <main class="login-wrapper">
      <div class="login-shell">

        <aside class="login-brand-panel" aria-label="Tentang aplikasi SITTA UT">
          <span class="login-brand-chip">Universitas Terbuka</span>
          <h2 class="login-brand-title">SITTA <span>UT</span></h2>
          <p class="login-brand-tagline">
            Sistem Informasi Tiras &amp; Transaksi Bahan Ajar - satu pintu untuk pemesanan, distribusi,
            dan pemantauan stok modul BMP di seluruh UT-Daerah.
          </p>

          <!-- v-for zero-based index: (fitur, index) merender daftar fitur dari array. -->
          <ul class="login-feature-list">
            <li v-for="(fitur, index) in fiturLogin" :key="index">
              <span class="login-feature-icon">{{ fitur.ikon }}</span>
              <div>
                <strong>{{ fitur.judul }}</strong>
                <span>{{ fitur.teks }}</span>
              </div>
            </li>
          </ul>

          <p class="login-brand-foot">Layanan Akademik Digital • 2026</p>
        </aside>

        <article class="login-card login-container-card">
          <header class="login-header">
            <img src="assets/pngwing.com%20(2).png" alt="Logo Universitas Terbuka SITTA" class="login-logo">
            <div class="login-badge-header">SITTA UT DAERAH</div>
            <h1 class="login-title">Selamat Datang</h1>
            <!-- v-text: menulis teks murni tanpa memparsing tag HTML. -->
            <p class="login-subtitle" v-text="'Silakan masuk ke akun Sistem Pemesanan Bahan Ajar Anda'"></p>
          </header>

          <!-- v-if: alert hanya muncul ketika state pesanError berisi teks. -->
          <div v-if="pesanError" class="custom-alert alert-danger">
            <span>{{ pesanError }}</span>
          </div>
          <div v-if="pesanSukses" class="custom-alert alert-success">
            <span>{{ pesanSukses }}</span>
          </div>

          <!-- event form: @submit.prevent mencegah reload halaman lalu memanggil method masuk(). -->
          <form novalidate @submit.prevent="masuk">
            <div class="form-group">
              <label for="loginEmail" class="form-label">Alamat Email</label>
              <div class="input-with-icon">
                <span class="input-icon">✉️</span>
                <input
                  id="loginEmail"
                  ref="inputEmail"
                  v-model.trim="form.email"
                  type="email"
                  class="form-input"
                  :class="{ 'input-error': pesanError }"
                  placeholder="Contoh: nadia@ut.ac.id"
                  autocomplete="email"
                  @keyup.enter="$refs.inputPassword.focus()"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="loginPassword" class="form-label">Password</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input
                  id="loginPassword"
                  ref="inputPassword"
                  v-model="form.password"
                  :type="lihatPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'input-error': pesanError }"
                  placeholder="Masukkan password Anda"
                  autocomplete="current-password"
                >
              </div>
              <button type="button" class="link-btn password-toggle" @click="lihatPassword = !lihatPassword">
                {{ lihatPassword ? 'Sembunyikan password' : 'Lihat password' }}
              </button>
            </div>

            <!-- v-show: elemen tetap ada di DOM, hanya visibility-nya diatur CSS. -->
            <div class="login-helper-row" v-show="!pesanSukses">
              <button type="button" class="link-btn link-underline" @click="bukaModal('lupa')">
                Lupa password?
              </button>
            </div>

            <button type="submit" class="btn btn-primary btn-block">
              <span>Masuk ke SITTA</span> ➔
            </button>
          </form>

          <div class="demo-akun-row">
            <span>Akun demo (klik untuk mengisi otomatis):</span>
            <!-- v-for zero-based index: daftar akun demo diberi nomor index + 1. -->
            <button
              v-for="(akun, index) in akunDemo"
              :key="akun.id"
              type="button"
              class="sample-badge"
              @click="pakaiAkun(akun)"
            >
              {{ index + 1 }}. {{ akun.nama }} — {{ akun.email }}
            </button>
          </div>

          <footer class="login-register-prompt">
            <span>Belum punya akun?</span>
            <button type="button" class="link-btn link-bold" @click="bukaModal('daftar')">
              Daftar Sekarang
            </button>
          </footer>
        </article>

      </div>

      <!-- komponen + props + event: modal login memakai BaseModal, judul lewat v-bind, tutup lewat emit. -->
      <base-modal v-if="modalAktif" :judul="judulModal" @tutup="tutupModal">
        <!-- v-if/v-else: isi modal berganti antara form lupa password dan form daftar. -->
        <form v-if="modalAktif === 'lupa'" novalidate @submit.prevent="kirimReset">
          <p class="modal-note">
            Masukkan alamat email UT yang terdaftar. Sistem akan memverifikasi akun dan
            memberikan petunjuk pemulihan password.
          </p>
          <div class="form-group">
            <label for="resetEmail" class="form-label">Email Terdaftar</label>
            <input
              id="resetEmail"
              v-model.trim="resetEmail"
              type="email"
              class="form-input"
              placeholder="contoh: nadia@ut.ac.id"
            >
          </div>
          <div v-if="pesanReset" class="custom-alert" :class="pesanReset.indexOf('tidak terdaftar') > -1 ? 'alert-danger' : 'alert-success'">
            {{ pesanReset }}
          </div>
          <button type="submit" class="btn btn-ut btn-block">Kirim Tautan Reset</button>
        </form>

        <form v-else novalidate @submit.prevent="daftarAkun">
          <div class="form-group">
            <label for="daftarNama" class="form-label">Nama Lengkap</label>
            <input id="daftarNama" v-model.trim="formDaftar.nama" type="text" class="form-input" placeholder="Masukkan nama lengkap">
          </div>
          <div class="form-group">
            <label for="daftarEmail" class="form-label">Email UT (@ut.ac.id)</label>
            <input id="daftarEmail" v-model.trim="formDaftar.email" type="email" class="form-input" placeholder="nama@ut.ac.id">
          </div>
          <div class="form-group">
            <label for="daftarPassword" class="form-label">Password Baru</label>
            <input id="daftarPassword" v-model="formDaftar.password" type="password" class="form-input" placeholder="Minimal 6 karakter">
          </div>
          <div class="form-group">
            <label for="daftarRole" class="form-label">Peran / Unit Kerja</label>
            <select id="daftarRole" v-model="formDaftar.role" class="form-input">
              <option value="UPBJJ-UT">UPBJJ-UT (Daerah)</option>
              <option value="Puslaba">Puslaba (Pusat Distribusi)</option>
              <option value="Fakultas">Fakultas / Program Studi</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div class="form-group">
            <label for="daftarLokasi" class="form-label">Lokasi / Cabang UPBJJ</label>
            <input id="daftarLokasi" v-model.trim="formDaftar.lokasi" type="text" class="form-input" placeholder="Contoh: UPBJJ Bandung">
          </div>
          <div v-if="pesanDaftar" class="custom-alert alert-danger">{{ pesanDaftar }}</div>
          <button type="submit" class="btn btn-primary btn-block">Daftar Akun</button>
        </form>
      </base-modal>
    </main>
  `
});
