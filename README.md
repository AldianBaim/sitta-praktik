# SITTA UT — Tugas Praktik 3 (Vue.js)

Aplikasi **SITTA UT** (Sistem Informasi Tiras dan Transaksi Bahan Ajar) adalah antarmuka pemesanan dan distribusi bahan ajar Universitas Terbuka. Tugas Praktik 3 ini merevisi aplikasi sebelumnya menjadi **Single Page Application (SPA)** berbasis **Vue.js** dengan pendekatan **Vue Component** dan **Vue Template**.

Seluruh halaman berada dalam satu berkas `index.html`, lalu dirender oleh root instance Vue. Tidak ada back-end atau database; data contoh berasal dari `js/data.js`.

---

## 1. Halaman dan Fungsi Utama

| Halaman | Komponen | Fungsi |
|---|---|---|
| Login | `LoginPage.js` | Autentikasi, modal lupa password, registrasi akun baru |
| Dashboard | `DashboardPage.js` | Greeting sesuai waktu lokal, jam digital, statistik, pencarian cepat DO, pintasan menu |
| Informasi Bahan Ajar | `StokPage.js` | Tabel stok, pencarian, filter jenis, pengurutan, tambah/hapus data, modal detail |
| Pemesanan | `PemesananPage.js` | Formulir pesanan, perhitungan total otomatis, pengurangan stok |
| Histori Transaksi | `HistoriPage.js` | Daftar seluruh transaksi, pencarian, filter status, dan rekap nilai |
| Tracking Pengiriman | `TrackingPage.js` | Pencarian DO, status, progress bar, timeline perjalanan paket |
| Laporan | Modal global di `index.html` | Monitoring progress DO dan rekapitulasi stok per jenis barang |

---

## 2. Struktur Proyek

```text
sitta-praktik/
├── index.html                  # Shell SPA + template root + modal laporan
├── login.html                  # Pengalihan ke index.html
│
├── css/
│   └── style.css               # Design system, layout, komponen, responsif
│
├── js/
│   ├── vendor/
│   │   └── vue.min.js          # Vue 2.7.16 (disimpan lokal)
│   ├── data.js                 # Data pengguna, bahan ajar, tracking, transaksi
│   ├── filters.js              # Filter formatting teks (rupiah, tanggal, dll.)
│   ├── app.js                  # Root instance: state global, navigasi, aksi
│   └── components/
│       ├── AppHeader.js        # Header + menu + profil pengguna
│       ├── AppFooter.js        # Footer
│       ├── BaseModal.js        # Komponen modal serbaguna dengan slot
│       ├── LoginPage.js        # Halaman login + modal registrasi
│       ├── DashboardPage.js    # Halaman dashboard
│       ├── StokPage.js         # Halaman informasi stok
│       ├── PemesananPage.js    # Halaman pemesanan
│       ├── HistoriPage.js      # Halaman histori transaksi
│       └── TrackingPage.js     # Halaman tracking DO
│
├── assets/                     # Logo Universitas Terbuka
├── img/                        # Cover bahan ajar
└── README.md                   # Dokumentasi teknis proyek
```

Penamaan berkas memakai **PascalCase** untuk komponen, sedangkan berkas pendukung memakai huruf kecil. Setiap komponen berada di berkas terpisah agar tanggung jawabnya jelas dan mudah ditelusuri saat presentasi.

---

## 3. Arsitektur Vue

### 3.1 Root instance sebagai pusat state

`js/app.js` menyimpan data yang dipakai bersama:

- `pengguna` — akun yang sedang login;
- `daftarBahanAjar` — array bahan ajar yang reaktif;
- `daftarTracking` — objek data Delivery Order;
- `daftarTransaksi` — riwayat pemesanan;
- `halaman` — halaman aktif (`dashboard`, `stok`, `pemesanan`, `tracking`);
- `modal` — jenis modal laporan yang sedang terbuka;
- `toast` — notifikasi singkat.

Perubahan pada state ini langsung memperbarui seluruh komponen yang menerimanya sebagai props.

### 3.2 Komunikasi props dan emit

Data mengalir ke bawah melalui **props**, sedangkan aksi dikirim ke atas melalui **emit**:

```text
Root (app.js)
  │  props: bahan-ajar, transaksi, pengguna
  ▼
PemesananPage
  │  emit: buat-pesanan
  ▼
Root → kurangi stok → tambah transaksi → render ulang semua komponen
```

Pola yang sama dipakai `StokPage` (`tambah-stok`, `hapus-stok`), `DashboardPage` (`navigasi`, `laporan`, `buka-tracking`), dan `TrackingPage` (props `tracking`, `nomor-awal`).

### 3.3 Mengapa Vue 2.7

Modul praktikum menggunakan konsep **filter** dengan sintaks pipe (`{{ harga | rupiah }}`). Filter merupakan fitur bawaan Vue 2, sedangkan Vue 3 menghapusnya. Karena itu proyek ini memakai **Vue 2.7.16** yang masih mendukung filter sekaligus sudah menyediakan Composition API bila dibutuhkan. Berkas Vue disimpan di `js/vendor/` agar demo tidak bergantung pada koneksi internet.

---

## 4. Pemenuhan Indikator Capaian

### 4.1 Vue Component dan Vue Template

Ada delapan komponen yang saling melengkapi:

- **`AppHeader`** dan **`AppFooter`** dipakai ulang di semua halaman setelah login.
- **`BaseModal`** menjadi komponen dialog serbaguna. Judul dan lebar dikirim lewat props, isi dialog lewat `<slot>`, tombol lewat slot bernama `footer`, dan aksi tutup lewat event `tutup`.
- **`LoginPage`, `DashboardPage`, `StokPage`, `PemesananPage`, `TrackingPage`** adalah komponen halaman.

Setiap komponen menuliskan template di properti `template` dengan markup HTML semantik (`header`, `main`, `section`, `article`, `aside`, `table`, `form`, `footer`) dan atribut aksesibilitas seperti `aria-label` serta `role`.

### 4.2 Menampilkan data

| Teknik | Contoh pemakaian |
|---|---|
| Mustache `{{ }}` | `{{ pengguna.nama }}`, `{{ totalStok \| angka }}`, `{{ item.namaBarang }}` |
| `v-text` | `DashboardPage`: `<div v-text="tagWaktu">` untuk menulis tag waktu sebagai teks murni |
| `v-html` | `DashboardPage`: `v-html="sapaanHtml"` karena sapaan menyisipkan `<span>` berwarna pada nama pengguna |

Nilai yang ditampilkan selalu berasal dari data reaktif, bukan teks statis, sehingga perubahan stok atau transaksi langsung terlihat di antarmuka.

### 4.3 Conditional

| Directive | Lokasi | Kondisi |
|---|---|---|
| `v-if` | `index.html` | `!pengguna` menampilkan login; `modal === 'monitoring'` menampilkan laporan DO |
| `v-else-if` | `index.html`, `TrackingPage` | Memilih halaman aktif dan laporan rekap; status hasil tracking |
| `v-else` | `TrackingPage` | Menampilkan kartu kosong saat belum ada pencarian |
| `v-show` | `LoginPage`, `StokPage` | Tombol reset hanya tampil saat kata kunci terisi; baris bantuan login disembunyikan setelah login berhasil |

Operator perbandingan juga dipakai, misalnya `item.stok < 200`, `daftarTampil.length === 0`, `jumlah > stokTersedia`, dan `status.indexOf("diterima") > -1`.

### 4.4 Data binding dan property

**One-way binding (`v-bind` / `:`)** dipakai untuk:

- gambar cover: `:src="item.cover"` dan `:alt="item.namaBarang"`;
- kelas dinamis: `:class="'stock-' + kelasStok(item.stok)"`;
- style progress bar: `:style="progressStyle"`;
- atribut form: `:max="stokTersedia || null"`, `:disabled="!barangDipilih"`, `:value="item.kodeBarang"`.

**Two-way binding (`v-model`)** dipakai pada:

- email dan password login;
- form registrasi dan reset password;
- pencarian, filter jenis, dan pengurutan stok;
- form tambah stok;
- form pemesanan (nama, unit, bahan ajar, jumlah, ekspedisi, catatan);
- filter status pada riwayat transaksi.

**Computed property** dipakai ketika nilai merupakan turunan data dan sebaiknya di-cache:

| Komponen | Computed | Kegunaan |
|---|---|---|
| Dashboard | `salam`, `tagWaktu`, `sapaanHtml`, `jam`, `tanggal` | Greeting dan waktu lokal |
| Dashboard | `totalStok`, `jumlahDO`, `stokMenipis` | Statistik |
| Stok | `daftarTampil`, `ringkasanJenis`, `adaDuplikat` | Pencarian, filter, pengurutan, ringkasan |
| Pemesanan | `barangDipilih`, `stokTersedia`, `totalBayar`, `stokSetelahPesan`, `ringkasanStatus` | Perhitungan pesanan dan rekap status |
| Histori | `transaksiTampil`, `totalEksemplar`, `totalNilai`, `ringkasanStatus` | Pencarian, filter status, dan rekap transaksi |
| Tracking | `contohDO`, `statusInfo`, `progressStyle` | Status, persentase, dan lebar progress bar |
| Root | `totalStok`, `totalNilaiStok`, `rekapJenis`, `judulModal` | Laporan rekap dan judul modal |

**Methods** dipakai untuk aksi yang dijalankan saat event terjadi, misalnya `masuk()`, `simpanStok()`, `kirimPesanan()`, `cari()`, `cariDO()`, `kelasStok()`, dan `kelasStatus()`. Pembagian ini memperlihatkan pemahaman bahwa computed cocok untuk nilai turunan, sedangkan methods cocok untuk perilaku dan parameter.

### 4.5 Watcher

Ada lebih dari dua watcher yang memantau perubahan data. Semuanya memiliki efek nyata, bukan sekadar pencatatan:

| No | Komponen | Data yang dipantau | Perilaku |
|---|---|---|---|
| 1 | `LoginPage` | `form.email` | Pesan error login dibersihkan saat pengguna mengetik ulang |
| 2 | `LoginPage` | `form.password` | Pesan error login dibersihkan saat password diubah |
| 3 | `DashboardPage` | `kataKunciDO` | Nomor DO disaring menjadi angka saja dan pesan error dihapus |
| 4 | `StokPage` | `formTambah.kodeBarang` | Kode otomatis diubah ke huruf kapital dan karakter non-alfanumerik dibersihkan |
| 5 | `StokPage` | `formTambah.stok` | Nilai stok negatif langsung dikoreksi menjadi 0 |
| 6 | `PemesananPage` | `form.kodeBarang` | Jumlah kembali ke 1 setiap kali bahan ajar diganti |
| 7 | `PemesananPage` | `form.jumlah` | Jumlah divalidasi terhadap stok yang tersedia secara langsung |
| 8 | `TrackingPage` | `hasil` | Hasil pencarian otomatis digulir ke area pandang |
| 9 | `TrackingPage` | `nomorDO` | Pesan error lama dihapus saat nomor diubah |
| 10 | `TrackingPage` | `nomorAwal` | Nomor DO dari dashboard langsung diproses |
| 11 | Root | `pengguna` | Kelas `login-body` diatur dan state halaman direset saat logout |
| 12 | Root | `halaman` | Modal ditutup dan judul dokumen diperbarui saat pindah halaman |

Contoh watcher yang paling mudah dijelaskan saat presentasi adalah watcher nomor 4 dan 7: keduanya mengubah data lain sebagai reaksi terhadap input pengguna.

### 4.6 Pengolahan array dengan `v-for`

**Zero-based index** dipakai saat nomor urut dibutuhkan:

```html
<tr v-for="(item, index) in daftarTampil" :key="item.kodeBarang">
  <td>{{ index + 1 }}</td>
```

Pemakaian serupa ada pada daftar bahan ajar di form pemesanan (`{{ index + 1 }}. {{ item.kodeBarang }}`), daftar fitur login, contoh nomor DO, timeline (`Langkah {{ index + 1 }}`), dan riwayat transaksi.

**Name-based index** dipakai saat data berbentuk objek:

```html
<!-- key = nomor DO, value = data DO -->
<tr v-for="(item, nomorDO) in daftarTracking" :key="nomorDO">

<!-- key = jenis barang -->
<tr v-for="(nilai, jenis) in rekapJenis" :key="jenis">

<!-- key = status transaksi -->
<div v-for="(jumlah, status) in ringkasanStatus" :key="status">
```

Dengan begitu, `v-for` tidak hanya menampilkan array, tetapi juga mengolah objek dengan nama kunci sebagai identitas.

### 4.7 Filter formatting teks

Filter didefinisikan sekali di `js/filters.js` lalu dipakai di banyak template:

| Filter | Contoh keluaran |
|---|---|
| `rupiah` | `{{ 325000 \| rupiah }}` → `Rp 325.000` |
| `angka` | `{{ 1587 \| angka }}` → `1.587` |
| `tanggal` | `{{ "2025-08-25" \| tanggal }}` → `25 Agustus 2025` |
| `kapital` | `{{ "mikrobiologi dasar" \| kapital }}` → `Mikrobiologi Dasar` |
| `labelStok` | `{{ 165 \| labelStok }}` → `Menipis` |
| `inisial` | `{{ "Nadia Prameswari" \| inisial }}` → `NP` |

Filter membuat template tetap ringkas: aturan format tidak ditulis berulang di setiap sel tabel atau kartu ringkasan.

### 4.8 Custom element, komponen, dan property template

`BaseModal` adalah contoh paling jelas dari **custom element** berbasis Vue:

```html
<base-modal :judul="judulModal" lebar="740px" @tutup="tutupModal">
  <div>Isi dialog...</div>
  <template v-slot:footer>
    <button class="btn btn-outline" @click="tutupModal">Tutup</button>
  </template>
</base-modal>
```

- `judul` dan `lebar` adalah **props**;
- isi dialog dikirim melalui **default slot**;
- tombol bawah dikirim melalui **named slot** `footer`;
- event `tutup` menghubungkan komponen dengan root.

`AppHeader` menerima props `pengguna` dan `halaman`, lalu menampilkan inisial nama, peran, dan menu aktif. `app-footer` tidak menerima props karena isinya statis.

---

## 5. Formulir, Validasi, dan Event Handler

### 5.1 Formulir dan aturan validasi

| Formulir | Validasi |
|---|---|
| Login | Email dan password wajib terisi; kecocokan dicek ke `dataPengguna`; pesan gagal berbunyi “email/password yang anda masukkan salah” |
| Lupa password | Email wajib diisi dan harus terdaftar |
| Registrasi | Semua field wajib; format email diperiksa; password minimal 6 karakter; email tidak boleh duplikat |
| Tambah stok | Kode lokasi, kode barang, nama, dan edisi wajib; stok tidak negatif; harga lebih dari 0; kode barang tidak duplikat |
| Pemesanan | Nama pemesan wajib; bahan ajar wajib dipilih; jumlah bilangan bulat minimal 1 dan tidak melebihi stok |

Validasi dijalankan di methods sebelum data dikirim ke root. Pesan kesalahan ditampilkan memakai `v-if` pada elemen `.custom-alert`, sehingga tidak bergantung pada `alert()` bawaan browser.

### 5.2 Event handler mouse dan keyboard

| Jenis | Contoh |
|---|---|
| Mouse | `@click` pada menu, tombol detail, tombol hapus, kartu pintasan, tombol contoh DO, tombol lihat password |
| Form | `@submit.prevent` pada login, registrasi, tambah stok, pemesanan, dan pencarian tracking |
| Keyboard | `@keyup.enter` pada input email (pindah fokus ke password), input DO, dan form pencarian |
| Keyboard | `@keyup.esc` pada pencarian stok untuk menghapus kata kunci |
| Keyboard | Tombol `Escape` ditangani `BaseModal` untuk menutup dialog aktif |

Interaksi mouse dan keyboard sama-sama tersedia pada elemen utama, termasuk modal yang bisa ditutup lewat tombol close, klik latar, atau tombol Escape.

---

## 6. Pengalaman Pengguna

Beberapa detail yang membuat antarmuka terasa nyaman:

- **Greeting dinamis** mengikuti jam lokal (pagi, siang, sore, malam) dan diperbarui setiap detik bersama jam digital.
- **Toast notification** muncul di kanan bawah setelah data ditambah, dihapus, atau pesanan dicatat.
- **Modal detail** menampilkan cover, kode, jenis, edisi, harga, dan stok dalam satu tempat.
- **Badge stok** membedakan kondisi Tersedia, Cukup, dan Menipis lewat warna.
- **Progress bar** dan **timeline** membuat status pengiriman mudah dibaca.
- **Ringkasan pesanan** menghitung total dan sisa stok segera setelah jumlah diubah.
- **Layout responsif** menyesuaikan grid formulir, tabel, dan navigasi pada layar kecil.
- **Atribut ARIA** (`role="dialog"`, `aria-modal`, `aria-label`, `aria-live`) menjaga aksesibilitas dialog dan hasil pencarian.

---

## 7. Data Uji Coba

### 7.1 Akun login

| Nama | Email | Password |
|---|---|---|
| Nadia Prameswari | `nadia@ut.ac.id` | `nadia123` |
| Rahmat Hidayat | `rahmat@ut.ac.id` | `rahmat123` |
| Lestari Anggraini | `lestari@ut.ac.id` | `lestari123` |
| Fajar Ramadhan | `fajar@ut.ac.id` | `fajar123` |
| Operator SITTA | `operator@ut.ac.id` | `operator123` |

Dua akun pertama juga tersedia sebagai tombol isi otomatis di halaman login.

### 7.2 Nomor Delivery Order

- `2023001234` — Rina Wulandari, JNE Reguler, Dalam Perjalanan (55%)
- `2023005678` — Agus Pranoto, Pos Indonesia, Diterima (100%)
- `2023007890` — Bayu Nugroho, SiCepat HALU, Diproses di Puslaba (30%)
- `2023004321` — Maya Kartika, J&T Express, Sedang Dikirim (85%)

---

## 8. Menjalankan Aplikasi

Aplikasi berjalan langsung di browser dengan membuka `index.html`. Tidak diperlukan server, build tool, atau instalasi paket karena Vue dan seluruh komponen dimuat sebagai berkas biasa.

Sesi login disimpan di `sessionStorage`, sehingga halaman aktif tetap terbuka saat browser dimuat ulang. Data stok dan transaksi kembali ke data awal setiap kali halaman dimuat ulang; ini disengaja agar demo selalu dimulai dari kondisi yang sama.

---

## 9. Ringkasan Alasan Desain

- **SPA dengan root state** dipilih agar perpindahan halaman tidak memuat ulang dokumen dan data pesanan tetap konsisten antarhalaman.
- **Halaman Histori dipisahkan dari formulir Pemesanan** agar tabel transaksi memiliki ruang penuh, pencarian sendiri, dan filter status yang tidak bercampur dengan alur input pesanan.
- **Props dan emit** dipilih dibandingkan variabel global agar aliran data satu arah dan mudah dilacak.
- **Computed** dipakai untuk nilai turunan seperti total pembayaran dan daftar hasil filter karena hasilnya di-cache dan otomatis diperbarui.
- **Watcher** dipakai hanya untuk reaksi terhadap perubahan data, seperti normalisasi input dan validasi langsung.
- **Filter** memisahkan aturan format dari template sehingga tampilan angka, tanggal, dan status tetap konsisten.
- **BaseModal** menghindari pengulangan markup dialog di lima tempat berbeda.
- **Vue 2.7** dipilih karena materi filter pipe masih menjadi bagian dari indikator penilaian, sementara Vue 3 sudah menghapus fitur tersebut.
