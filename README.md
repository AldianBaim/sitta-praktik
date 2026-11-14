# SITTA UT - Sistem Informasi Tiras dan Transaksi Bahan Ajar
**Tugas Praktik 1 - Pemrograman Web (Front-End Fundamental)**  
**Universitas Terbuka**

---

## 🌟 Deskripsi Proyek
Proyek ini adalah implementasi antarmuka front-end aplikasi web **SITTA UT** (Sistem Informasi Tiras dan Transaksi Bahan Ajar) yang digunakan oleh Universitas Terbuka dan UT-Daerah (UPBJJ) untuk proses pemesanan, pelacakan ekspedisi, dan monitoring inventaris bahan ajar Buku Materi Pokok (BMP).

Aplikasi dibangun murni menggunakan teknologi fundamental **HTML5**, **CSS3**, dan **JavaScript DOM** tanpa back-end/database, membaca data dummy dari `js/data.js` sesuai instruksi soal.

---

## 📁 Struktur Folder Proyek
Sesuai format baku pada dokumen panduan tugas praktik:

```
sitta-praktik/
│
├── index.html          # Halaman Login Utama & Modal Autentikasi
├── login.html          # Alias / Redirect ke index.html
├── dashboard.html      # Menu Utama Dashboard, Greeting Waktu, & Quick DO Search
├── tracking.html       # Halaman Tracking Ekspedisi Pengiriman DO & Timeline
├── stok.html           # Informasi Stok Bahan Ajar & Form Tambah Baris DOM
│
├── css/
│   └── style.css       # External CSS Design System (Tema Universitas Terbuka)
│
├── js/
│   ├── data.js         # Dummy Data (dataPengguna, dataBahanAjar, dataTracking)
│   └── script.js       # Logika Interaktif DOM, Validasi Form, & Modal Box
│
├── assets/
│   └── pngwing.com (2).png # Logo Universitas Terbuka untuk header, login, dan favicon
│
├── img/                # Gambar Cover Bahan Ajar (BMP)
│   ├── pengantar_komunikasi.jpg
│   ├── manajemen_keuangan.jpg
│   ├── kepemimpinan.jpg
│   ├── mikrobiologi.jpg
│   └── paud_perkembangan.jpg
│
├── README.md           # Dokumentasi Proyek
└── PANDUAN_VIDEO.md    # Panduan & Naskah Presentasi Video (Maksimal 15 Menit)
```

---

## 🎯 Pemenuhan Indikator Penilaian

| No | Indikator Penilaian | Bobot | Implementasi dalam Proyek |
|---|---|---|---|
| **1.1** | **Struktur HTML Semantik & Valid** | 15 Poin | Menggunakan tag HTML5 semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<table>`, `<form>`, `<footer>`) dengan atribut aksesibilitas lengkap (ARIA). |
| **1.2** | **Desain CSS (External, Internal, Inline)** | 15 Poin | - **External**: `css/style.css` (desain sistem modern, palet warna UT Navy Blue `#003366` & Gold `#FFB800`, responsif).<br>- **Internal**: Tag `<style>` di tiap halaman untuk kustomisasi spesifik.<br>- **Inline**: Atribut `style="..."` pada elemen dinamis/status. |
| **1.3** | **JavaScript DOM & Interaktivitas** | 25 Poin | - Manipulasi tabel stok dinamis (`document.createElement`, `appendChild`, `remove`).<br>- Modal box (W3Schools pattern) untuk Lupa Password, Daftar, Tambah Stok, dan Detail Bahan Ajar.<br>- Greeting dinamis waktu lokal (pagi/siang/sore/malam) + jam real-time.<br>- Dropdown navigation menu untuk Laporan (Monitoring & Rekap). |
| **1.4** | **Validasi Form & Alert Feedback** | 15 Poin | - Validasi login dengan pesan pop-up: *"email/password yang anda masukkan salah"* jika tidak sesuai.<br>- Validasi email reset password & registrasi akun baru.<br>- Validasi pencarian DO jika tidak ditemukan.<br>- Validasi isian formulir penambahan stok baru. |
| **1.5** | **Modularitas File & Struktur Proyek** | 5 Poin | Struktur folder rapi, bersih, dan 100% sesuai diagram panduan tugas praktik. |
| **1.6** | **Kreativitas Tambahan** | 10 Poin | - Shortcut demo akun 1-klik untuk penguji.<br>- Visual timeline perjalanan paket dengan status badge warna.<br>- Modal interaktif monitoring progress DO dan grafik persentase rekap stok.<br>- Live search & filter kategori bahan ajar. |
| **1.7** | **Presentasi Video (Maks 15 Menit)** | 15 Poin | Naskah presentasi terstruktur yang mencakup sistematika, alur berpikir, dan argumentasi teknis di file `PANDUAN_VIDEO.md`. |

---

## 🚀 Cara Menjalankan Aplikasi
1. Buka folder `sitta-praktik` di file explorer.
2. Klik ganda pada file `index.html` untuk membuka di browser apa saja (Google Chrome, Microsoft Edge, Mozilla Firefox).
3. Anda dapat langsung menguji login dengan akun demo yang tersedia (misal: `rina@ut.ac.id` / `rina123`).
4. Jelajahi menu navigasi:
   - **Dashboard**: Melihat greeting waktu lokal, jam sistem, dan metrik.
   - **Informasi Bahan Ajar**: Melihat daftar buku, klik *"👁️ Detail"* untuk melihat peragaan data seperti di soal, atau klik *"➕ Tambah Stok Bahan Ajar"* untuk menambah baris via DOM.
   - **Tracking Pengiriman**: Masukkan DO `#2023001234` atau `#2023005678` untuk melihat timeline perjalanan dan progress bar.
   - **Menu Laporan**: Klik dropdown *"Laporan"* di navbar untuk membuka modal Monitoring DO atau Rekap Bahan Ajar.
