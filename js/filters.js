/**
 * SITTA UT - Kumpulan Filter Formatting Data Teks
 * File: js/filters.js
 *
 * Filter pada Vue.js dipakai untuk memformat nilai sebelum ditampilkan,
 * misalnya mengubah angka menjadi rupiah atau status stok menjadi label.
 * Pemakaiannya di template: {{ item.harga | rupiah }}
 */

function keAngka(nilai) {
  var angka = Number(nilai);
  return isNaN(angka) ? 0 : angka;
}

// Filter: dipakai di template dengan pipe, misalnya {{ item.total | rupiah }}.
Vue.filter("rupiah", function (nilai) {
  return "Rp " + keAngka(nilai).toLocaleString("id-ID");
});

Vue.filter("angka", function (nilai) {
  return keAngka(nilai).toLocaleString("id-ID");
});

// Filter: mengubah format tanggal tanpa mengubah data aslinya.
Vue.filter("tanggal", function (nilai) {
  if (!nilai) return "-";
  var tanggal = new Date(nilai);
  if (isNaN(tanggal.getTime())) return nilai;
  return tanggal.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
});

Vue.filter("kapital", function (teks) {
  if (!teks) return "";
  return String(teks)
    .toLowerCase()
    .replace(/\b\w/g, function (huruf) {
      return huruf.toUpperCase();
    });
});

// Filter: mengubah angka stok menjadi label teks Tersedia/Cukup/Menipis.
Vue.filter("labelStok", function (stok) {
  var jumlah = keAngka(stok);
  if (jumlah >= 300) return "Tersedia";
  if (jumlah >= 200) return "Cukup";
  return "Menipis";
});

// Filter: mengambil inisial nama untuk avatar pada header.
Vue.filter("inisial", function (nama) {
  if (!nama) return "UT";
  return String(nama)
    .trim()
    .split(/\s+/)
    .map(function (kata) {
      return kata.charAt(0);
    })
    .slice(0, 2)
    .join("")
    .toUpperCase();
});
