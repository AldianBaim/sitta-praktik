/**
 * SITTA UT - Data Dummy Praktik 1
 * Sistem Informasi Tiras dan Transaksi Bahan Ajar - Universitas Terbuka
 * File: js/data.js
 */

/* ===========================================================================
   1. DATA PENGGUNA (Akun & Hak Akses)
   Struktur: id, nama, email, password, role, lokasi
   =========================================================================== */
var dataPengguna = [
  {
    id: 1,
    nama: "Nadia Prameswari",
    email: "nadia@ut.ac.id",
    password: "nadia123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Rahmat Hidayat",
    email: "rahmat@ut.ac.id",
    password: "rahmat123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Medan"
  },
  {
    id: 3,
    nama: "Lestari Anggraini",
    email: "lestari@ut.ac.id",
    password: "lestari123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Fajar Ramadhan",
    email: "fajar@ut.ac.id",
    password: "fajar123",
    role: "Fakultas",
    lokasi: "FKIP"
  },
  {
    id: 5,
    nama: "Operator SITTA",
    email: "operator@ut.ac.id",
    password: "operator123",
    role: "Administrator",
    lokasi: "Pusat"
  },
  {
    id: 6,
    nama: "Dimas Prakoso",
    email: "dimas@ut.ac.id",
    password: "dimas123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Semarang"
  },
  {
    id: 7,
    nama: "Anisa Kusuma",
    email: "anisa@ut.ac.id",
    password: "anisa123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Denpasar"
  },
  {
    id: 8,
    nama: "Aldiansyah Ibrahim",
    email: "aldiansyah@ut.ac.id",
    password: "aldiansyah123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ bandungs"
  }
];

/* ===========================================================================
   2. DATA BAHAN AJAR (Katalog BMP / Tiras)
   Struktur: kodeLokasi, kodeBarang, namaBarang, jenisBarang, edisi, stok, cover
   Keterangan badge stok: >=300 "Tersedia" | >=200 "Cukup" | <200 "Menipis"
   =========================================================================== */
var dataBahanAjar = [
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 548,
    cover: "img/pengantar_komunikasi.jpg"
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4216",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 392,
    cover: "img/manajemen_keuangan.jpg"
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "EKMA4310",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 278,
    cover: "img/kepemimpinan.jpg"
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4211",
    namaBarang: "Mikrobiologi Dasar",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 165,
    cover: "img/mikrobiologi.jpg"
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4401",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "4",
    stok: 204,
    cover: "img/paud_perkembangan.jpg"
  }
];

/* ===========================================================================
   3. DATA TRACKING PENGIRIMAN (Delivery Order / DO)
   Struktur: nomorDO, nama, status, ekspedisi, tanggalKirim, paket, total,
             perjalanan[] { waktu, keterangan }
   Nomor DO uji coba  : 2023001234 | 2023005678 | 2023007890 | 2023004321
   Status "Diterima/Selesai" -> 100%, "Dikirim" -> 85%,
   "Perjalanan" -> 55%, status lainnya -> 30%.
   =========================================================================== */
var dataTracking = {
  "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE Reguler",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01 - Paket 4 Modul BMP",
    total: "Rp 180.000",
    perjalanan: [
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },      
      {
        waktu: "2025-08-25 18:40:15",
        keterangan: "Diteruskan ke Kantor Jakarta Selatan"
      },
      {
        waktu: "2025-08-26 07:22:41",
        keterangan: "Tiba di Hub: JAKARTA SELATAN"
      },
      {
        waktu: "2025-08-26 09:05:10",
        keterangan: "Paket dalam proses antar ke alamat penerima"
      }
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Diterima",
    ekspedisi: "Pos Indonesia (Pos Reguler)",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG - Paket 3 Modul BMP",
    total: "Rp 220.000",
    perjalanan: [
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },      
      {
        waktu: "2025-08-25 16:30:10",
        keterangan: "Diteruskan ke Kantor Kota Bandung"
      },
      {
        waktu: "2025-08-26 12:15:33",
        keterangan: "Tiba di Hub: Kota BANDUNG"
      },
      {
        waktu: "2025-08-26 15:06:12",
        keterangan: "Proses antar ke Cimahi"
      },
      {
        waktu: "2025-08-26 20:00:00",
        keterangan: "Selesai Antar. Penerima: Agus Pranoto"
      },
      {
        waktu: "2025-08-26 20:05:44",
        keterangan: "Paket diterima lengkap (3 eksemplar) dan ditandatangani penerima"
      }
    ]
  },
  "2023007890": {
    nomorDO: "2023007890",
    nama: "Bayu Nugroho",
    status: "Diproses di Puslaba",
    ekspedisi: "SiCepat HALU (Menunggu Pickup)",
    tanggalKirim: "2025-08-28",
    paket: "0SBY02 - Paket 2 Modul BMP",
    total: "Rp 135.000",
    perjalanan: [
      {
        waktu: "2025-08-28 08:05:33",
        keterangan: "Pesanan Delivery Order diterima oleh sistem SITTA UT"
      },
      {
        waktu: "2025-08-28 09:40:12",
        keterangan: "Verifikasi pembayaran & validasi data mahasiswa: BERHASIL"
      },
      {
        waktu: "2025-08-28 11:15:47",
        keterangan: "Pengemasan paket sedang dilakukan di Gudang Puslaba Pusat"
      }
    ]
  },
  "2023004321": {
    nomorDO: "2023004321",
    nama: "Maya Kartika",
    status: "Sedang Dikirim",
    ekspedisi: "J&T Express",
    tanggalKirim: "2025-08-26",
    paket: "0MLG01 - Paket 5 Modul BMP",
    total: "Rp 264.000",
    perjalanan: [
      {
        waktu: "2025-08-26 08:30:11",
        keterangan: "Penerimaan di Loket: KOTA MALANG. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-26 12:45:09",
        keterangan: "Tiba di Hub: KOTA MALANG"
      },
      {
        waktu: "2025-08-26 19:12:44",
        keterangan: "Diteruskan ke Kantor Kota Yogyakarta"
      },
      {
        waktu: "2025-08-27 07:58:20",
        keterangan: "Tiba di Hub: YOGYAKARTA"
      },
      {
        waktu: "2025-08-27 10:24:05",
        keterangan: "Paket dalam proses antar ke alamat penerima"
      }
    ]
  }
};
