/**
 * SITTA UT - LOGIKA JAVASCRIPT & DOM MANIPULATION
 * Sistem Informasi Tiras dan Transaksi Bahan Ajar - Universitas Terbuka
 * File: js/script.js
 */

// =============================================================================
// 1. MANAJEMEN PENGGUNA & AUTENTIKASI (SESSION)
// =============================================================================

/**
 * Mengambil data pengguna aktif dari sessionStorage.
 * Jika belum ada, gunakan user default (Rina Wulandari) untuk preview halaman internal.
 */
function getActiveUser() {
  const stored = sessionStorage.getItem("sitta_active_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Gagal membaca session pengguna", e);
    }
  }
  // Default fallback jika membuka dashboard langsung tanpa login
  return typeof dataPengguna !== "undefined" && dataPengguna.length > 0
    ? dataPengguna[0]
    : {
        id: 1,
        nama: "Rina Wulandari",
        email: "rina@ut.ac.id",
        role: "UPBJJ-UT",
        lokasi: "UPBJJ Jakarta"
      };
}

/**
 * Menyimpan data pengguna aktif ke sessionStorage
 */
function setActiveUser(user) {
  sessionStorage.setItem("sitta_active_user", JSON.stringify(user));
}

/**
 * Menghapus session pengguna dan kembali ke halaman login
 */
function logoutUser() {
  if (confirm("Apakah Anda yakin ingin keluar dari sistem SITTA UT?")) {
    sessionStorage.removeItem("sitta_active_user");
    window.location.href = "index.html";
  }
}

/**
 * Memperbarui widget profil pengguna di navbar
 */
function renderNavbarUser() {
  const user = getActiveUser();
  const userNameElem = document.getElementById("navUserName");
  const userRoleElem = document.getElementById("navUserRole");
  const userAvatarElem = document.getElementById("navUserAvatar");

  if (userNameElem) userNameElem.textContent = user.nama;
  if (userRoleElem) userRoleElem.textContent = `${user.role} - ${user.lokasi || "Pusat"}`;
  if (userAvatarElem) {
    // Inisial nama
    const initials = user.nama
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    userAvatarElem.textContent = initials;
  }
}

// =============================================================================
// 2. MODAL BOX & POP-UP HELPER (W3Schools Modal Box Implementation)
// =============================================================================

/**
 * Membuka modal box berdasarkan ID elemen modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    // Fokuskan input pertama jika ada
    const firstInput = modal.querySelector("input, select, textarea, button");
    if (firstInput) firstInput.focus();
  }
}

/**
 * Menutup modal box berdasarkan ID elemen modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

/**
 * Alert Pop-up Kustom (dengan fallback window.alert sesuai soal #1)
 */
function showCustomAlert(message, title = "Peringatan", type = "danger") {
  const alertModal = document.getElementById("customAlertModal");
  if (alertModal) {
    const titleEl = document.getElementById("customAlertTitle");
    const msgEl = document.getElementById("customAlertMessage");
    const iconEl = document.getElementById("customAlertIcon");

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) {
      iconEl.className = type === "danger" ? "alert-icon-danger" : "alert-icon-success";
    }
    openModal("customAlertModal");
  } else {
    // Fallback native alert browser
    alert(`${title}: ${message}`);
  }
}

// Event listener global untuk tombol penutup modal (data-close-modal & klik backdrop)
document.addEventListener("DOMContentLoaded", () => {
  // Tombol close modal
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close-modal");
      closeModal(modalId);
    });
  });

  // Klik di luar container modal (backdrop) untuk menutup
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });

  // Tutup modal via tombol keyboard 'Escape'
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach((modal) => {
        modal.classList.remove("active");
      });
    }
  });

  // Render info pengguna pada navbar jika ada
  renderNavbarUser();
});

// =============================================================================
// 3. LOGIKA HALAMAN LOGIN (index.html / login.html - Soal #1)
// =============================================================================

function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const btnLupaPassword = document.getElementById("btnLupaPassword");
  const btnDaftar = document.getElementById("btnDaftar");

  // A. Tombol Buka Modal Lupa Password & Daftar (Soal #1)
  if (btnLupaPassword) {
    btnLupaPassword.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("modalLupaPassword");
    });
  }

  if (btnDaftar) {
    btnDaftar.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("modalDaftar");
    });
  }

  // B. Validasi & Submit Form Login (Soal #1)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      // Validasi form kosong
      if (!email || !password) {
        showCustomAlert(
          "email/password yang anda masukkan salah",
          "Validasi Login",
          "danger"
        );
        return;
      }

      // Validasi terhadap dataPengguna di data.js
      const foundUser = dataPengguna.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        // Simpan sesi dan redirect ke dashboard
        setActiveUser(foundUser);
        
        // Tampilkan pesan sukses sebentar atau langsung redirect
        const alertBox = document.getElementById("loginAlertBox");
        if (alertBox) {
          alertBox.className = "custom-alert alert-success";
          alertBox.style.display = "flex";
          alertBox.innerHTML = `<span><strong>Login Berhasil!</strong> Mengalihkan ke Dashboard SITTA...</span>`;
        }

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 600);
      } else {
        // Sesuai syarat Soal #1:
        // "Jika salah atau tidak sesuai, munculkan pop-up/alert yang berisi bahwa 'email/password yang anda masukkan salah'"
        showCustomAlert(
          "email/password yang anda masukkan salah",
          "Autentikasi Gagal",
          "danger"
        );

        // Beri efek highlight merah pada input form
        if (emailInput) emailInput.classList.add("input-error");
        if (passwordInput) passwordInput.classList.add("input-error");
      }
    });
  }

  // C. Form Lupa Password Submit Handler
  const formLupaPassword = document.getElementById("formLupaPassword");
  if (formLupaPassword) {
    formLupaPassword.addEventListener("submit", (e) => {
      e.preventDefault();
      const resetEmail = document.getElementById("resetEmail").value.trim();
      const user = dataPengguna.find(
        (u) => u.email.toLowerCase() === resetEmail.toLowerCase()
      );

      if (user) {
        alert(
          `Instruksi reset password telah dikirimkan ke email ${resetEmail}.\n(Password akun Anda saat ini: ${user.password})`
        );
        closeModal("modalLupaPassword");
        formLupaPassword.reset();
      } else {
        alert(`Email "${resetEmail}" tidak terdaftar dalam sistem SITTA UT.`);
      }
    });
  }

  // D. Form Registrasi/Daftar Baru Submit Handler
  const formDaftar = document.getElementById("formDaftar");
  if (formDaftar) {
    formDaftar.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = document.getElementById("daftarNama").value.trim();
      const email = document.getElementById("daftarEmail").value.trim();
      const password = document.getElementById("daftarPassword").value;
      const role = document.getElementById("daftarRole").value;
      const lokasi = document.getElementById("daftarLokasi").value.trim();

      if (!nama || !email || !password || !lokasi) {
        alert("Semua field pendaftaran wajib diisi!");
        return;
      }

      // Cek apakah email sudah terdaftar
      const exists = dataPengguna.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        alert("Email tersebut sudah terdaftar! Gunakan email lain.");
        return;
      }

      // Tambahkan pengguna baru ke dataPengguna
      const newUser = {
        id: dataPengguna.length + 1,
        nama: nama,
        email: email,
        password: password,
        role: role,
        lokasi: lokasi
      };
      dataPengguna.push(newUser);

      alert(`Pendaftaran akun "${nama}" berhasil! Anda sekarang dapat login.`);
      closeModal("modalDaftar");
      formDaftar.reset();

      // Isi otomatis ke field login untuk kenyamanan
      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = password;
    });
  }

}

// =============================================================================
// 4. LOGIKA DASHBOARD & GREETING DINAMIS (dashboard.html - Soal #2 & #3)
// =============================================================================

/**
 * Menghitung waktu local time dan mengembalikan salam yang sesuai
 * Syarat Soal #2: "Tampilkan 'greeting' berdasarkan waktu local time (pagi/siang/sore)."
 */
function getGreetingTime(hours) {
  if (hours >= 4 && hours < 11) {
    return "Selamat Pagi";
  } else if (hours >= 11 && hours < 15) {
    return "Selamat Siang";
  } else if (hours >= 15 && hours < 18) {
    return "Selamat Sore";
  } else {
    return "Selamat Malam";
  }
}

function initDashboardPage() {
  const greetingElem = document.getElementById("dashboardGreeting");
  const greetingTagElem = document.getElementById("greetingTimeTag");
  const clockElem = document.getElementById("liveClockTime");
  const dateElem = document.getElementById("liveClockDate");
  const user = getActiveUser();

  // Fungsi update jam dan greeting real-time
  function updateTimeAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const greeting = getGreetingTime(hours);

    // Update greeting dengan nama user
    if (greetingElem) {
      greetingElem.innerHTML = `${greeting}, <span style="color: var(--ut-gold);">${user.nama}</span> 👋`;
    }
    if (greetingTagElem) {
      greetingTagElem.innerHTML = `☀️ ${greeting} • Waktu Lokal`;
    }

    // Format jam 24:00:00
    if (clockElem) {
      clockElem.textContent = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    // Format tanggal Indonesia
    if (dateElem) {
      dateElem.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  }

  // Jalankan segera dan set interval tiap detik
  updateTimeAndGreeting();
  setInterval(updateTimeAndGreeting, 1000);

  // Update ringkasan metrics di dashboard
  const metricBahanAjar = document.getElementById("totalBahanAjarMetric");
  const metricStokTersedia = document.getElementById("totalStokMetric");
  const metricDOTerkirim = document.getElementById("totalDOMetric");

  if (typeof dataBahanAjar !== "undefined") {
    if (metricBahanAjar) metricBahanAjar.textContent = dataBahanAjar.length;
    if (metricStokTersedia) {
      const sum = dataBahanAjar.reduce((acc, curr) => acc + (curr.stok || 0), 0);
      metricStokTersedia.textContent = sum.toLocaleString("id-ID");
    }
  }

  if (typeof dataTracking !== "undefined" && metricDOTerkirim) {
    metricDOTerkirim.textContent = Object.keys(dataTracking).length;
  }

  // Form Pencarian Cepat DO di Dashboard (Soal #3)
  const dashboardSearchForm = document.getElementById("dashboardDOSearchForm");
  const dashboardDOInput = document.getElementById("dashboardDOInput");

  if (dashboardSearchForm && dashboardDOInput) {
    dashboardSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const noDO = dashboardDOInput.value.trim();
      if (!noDO) {
        showCustomAlert(
          "Silakan masukkan nomor Delivery Order terlebih dahulu!",
          "Peringatan",
          "danger"
        );
        return;
      }
      // Redirect ke tracking.html dengan parameter DO
      window.location.href = `tracking.html?do=${encodeURIComponent(noDO)}`;
    });
  }
}

// =============================================================================
// 5. LOGIKA TRACKING PENGIRIMAN (tracking.html - Soal #3)
// =============================================================================

function initTrackingPage() {
  const trackingForm = document.getElementById("trackingForm");
  const doInput = document.getElementById("inputNomorDO");
  const resultContainer = document.getElementById("trackingResultContainer");

  // Handler Cari Pengiriman
  function executeTrackingSearch(noDO) {
    if (!noDO) {
      showCustomAlert(
        "Silakan masukkan Nomor Delivery Order!",
        "Peringatan",
        "danger"
      );
      return;
    }

    if (!dataTracking || !dataTracking[noDO]) {
      showCustomAlert(
        `Nomor Delivery Order "${noDO}" tidak ditemukan dalam sistem SITTA.\nContoh nomor DO yang tersedia: 2023001234 atau 2023005678`,
        "Pencarian Gagal",
        "danger"
      );
      if (resultContainer) {
        resultContainer.style.display = "none";
      }
      return;
    }

    const item = dataTracking[noDO];
    renderTrackingResult(item);
  }

  if (trackingForm) {
    trackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const noDO = doInput ? doInput.value.trim() : "";
      executeTrackingSearch(noDO);
    });
  }

  // Cek apakah ada query string ?do=... dari dashboard
  const urlParams = new URLSearchParams(window.location.search);
  const doFromUrl = urlParams.get("do");
  if (doFromUrl) {
    if (doInput) doInput.value = doFromUrl;
    executeTrackingSearch(doFromUrl);
  }

  // Helper klik sample DO
  window.searchSampleDO = function (noDO) {
    if (doInput) {
      doInput.value = noDO;
      executeTrackingSearch(noDO);
    }
  };
}

/**
 * Render Data Hasil Tracking ke DOM (Soal #3)
 * Menampilkan: Nama Mahasiswa, Status Pengiriman (progress bar, warna), Detail Ekspedisi,
 * Tanggal Kirim, Jenis Paket, Total Pembayaran, dan Timeline Perjalanan Paket
 */
function renderTrackingResult(item) {
  const container = document.getElementById("trackingResultContainer");
  if (!container) return;

  // Hitung persentase progress dan status badge
  let badgeClass = "badge-on-delivery";
  let progressPercent = "65%";
  let statusIcon = "🚚";

  if (item.status.toLowerCase().includes("selesai") || item.status.toLowerCase().includes("diterima")) {
    badgeClass = "badge-delivered";
    progressPercent = "100%";
    statusIcon = "✅";
  } else if (item.status.toLowerCase().includes("dikirim")) {
    badgeClass = "badge-delivered";
    progressPercent = "85%";
    statusIcon = "📦";
  } else if (item.status.toLowerCase().includes("perjalanan")) {
    badgeClass = "badge-on-delivery";
    progressPercent = "55%";
    statusIcon = "🚚";
  } else {
    badgeClass = "badge-process";
    progressPercent = "30%";
    statusIcon = "⏳";
  }

  // Render HTML menggunakan struktur yang estetik & semantik
  let perjalananHtml = "";
  if (item.perjalanan && item.perjalanan.length > 0) {
    perjalananHtml = item.perjalanan
      .map(
        (step) => `
        <li class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-box">
            <div class="timeline-time">
              <span>🕒</span> ${step.waktu}
            </div>
            <div class="timeline-desc">
              ${step.keterangan}
            </div>
          </div>
        </li>
      `
      )
      .join("");
  } else {
    perjalananHtml = `<li class="timeline-item"><div class="timeline-desc">Belum ada riwayat pergerakan paket.</div></li>`;
  }

  container.innerHTML = `
    <div class="tracking-result-box">
      <!-- Banner Header Hasil Tracking -->
      <div class="tracking-header-banner">
        <div>
          <div class="do-number-tag">Nomor Delivery Order: <strong>#${item.nomorDO || item.nomorDO}</strong></div>
          <h2 class="do-recipient-name">${item.nama}</h2>
        </div>
        <div>
          <span class="tracking-status-badge ${badgeClass}">
            <span>${statusIcon}</span> ${item.status}
          </span>
        </div>
      </div>

      <!-- Detail Ekspedisi, Tanggal, Paket & Pembayaran (Sesuai Soal #3) -->
      <div class="tracking-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Ekspedisi</span>
          <span class="meta-value">${item.ekspedisi}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tanggal Kirim</span>
          <span class="meta-value">${item.tanggalKirim}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Jenis Paket</span>
          <span class="meta-value">${item.paket}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Total Pembayaran</span>
          <span class="meta-value" style="color: var(--ut-blue-light);">${item.total}</span>
        </div>
      </div>

      <!-- Simulasi Progress Bar Status Pengiriman (Sesuai Soal #3) -->
      <div class="progress-bar-container">
        <div class="progress-label-row">
          <span>Proses Pengiriman SITTA</span>
          <span>${progressPercent} Selesai</span>
        </div>
        <div class="progress-track">
          <!-- Indikator Penilaian: Manipulasi Style Width via DOM / CSS Inline -->
          <div class="progress-fill" style="width: ${progressPercent};"></div>
        </div>
      </div>

      <!-- Timeline Riwayat Perjalanan Paket (Sesuai Screenshot Halaman 3) -->
      <div class="timeline-section">
        <h3 class="timeline-title">
          <span>📍</span> Riwayat Perjalanan Paket (Tracking Timeline)
        </h3>
        <ol class="timeline-list">
          ${perjalananHtml}
        </ol>
      </div>
    </div>
  `;

  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =============================================================================
// 6. LOGIKA STOK BAHAN AJAR (stok.html - Soal #4)
// =============================================================================

function initStockPage() {
  const stockTableBody = document.getElementById("stockTableBody");
  const formTambahStok = document.getElementById("formTambahStok");
  const searchInput = document.getElementById("searchStokInput");
  const filterJenis = document.getElementById("filterJenisBarang");
  const totalItemsBadge = document.getElementById("totalItemsCount");
  const btnBukaFormTambah = document.getElementById("btnBukaFormTambah");

  if (btnBukaFormTambah) {
    btnBukaFormTambah.addEventListener("click", () => {
      openModal("modalTambahStok");
    });
  }

  /**
   * Helper warna status ketersediaan stok
   */
  function getStockBadge(qty) {
    if (qty >= 300) {
      return `<span class="stock-badge stock-high">Tersedia (${qty})</span>`;
    } else if (qty >= 200) {
      return `<span class="stock-badge stock-medium">Cukup (${qty})</span>`;
    } else {
      return `<span class="stock-badge stock-low">Menipis (${qty})</span>`;
    }
  }

  /**
   * Menampilkan Data Dummy dataBahanAjar ke Tabel Menggunakan DOM
   * Sesuai Syarat Soal #4
   */
  function renderStockTable(itemsToRender) {
    if (!stockTableBody) return;
    stockTableBody.innerHTML = "";

    if (itemsToRender.length === 0) {
      stockTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Tidak ada data bahan ajar yang sesuai dengan pencarian.
          </td>
        </tr>
      `;
      if (totalItemsBadge) totalItemsBadge.textContent = "0 Bahan Ajar";
      return;
    }

    itemsToRender.forEach((item, index) => {
      // DOM: document.createElement('tr')
      const tr = document.createElement("tr");
      tr.id = `row-stok-${item.kodeBarang}`;

      tr.innerHTML = `
        <td><strong>${index + 1}</strong></td>
        <td>
          <img src="${item.cover}" alt="${item.namaBarang}" class="table-cover-thumb" 
               onerror="this.src='https://placehold.co/80x110/003366/ffffff?text=BMP'">
        </td>
        <td><code>${item.kodeLokasi}</code></td>
        <td><strong style="color: var(--ut-blue);">${item.kodeBarang}</strong></td>
        <td>${item.namaBarang}</td>
        <td><span class="sample-badge">${item.jenisBarang}</span></td>
        <td>Edisi ${item.edisi}</td>
        <td>${getStockBadge(item.stok)}</td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-outline btn-sm" onclick="showDetailBahanAjar('${item.kodeBarang}')" title="Lihat Peragaan Data">
              👁️ Detail
            </button>
            <button class="btn btn-danger-outline btn-sm" onclick="deleteStockRow('${item.kodeBarang}')" title="Hapus Baris">
              🗑️
            </button>
          </div>
        </td>
      `;

      stockTableBody.appendChild(tr);
    });

    if (totalItemsBadge) {
      totalItemsBadge.textContent = `${itemsToRender.length} Bahan Ajar`;
    }
  }

  // Render awal data dari dataBahanAjar
  renderStockTable(dataBahanAjar);

  /**
   * Fitur Menambahkan Baris Stok Baru Menggunakan Javascript DOM
   * Sesuai Syarat Soal #4
   */
  if (formTambahStok) {
    formTambahStok.addEventListener("submit", (e) => {
      e.preventDefault();

      const kodeLokasi = document.getElementById("addKodeLokasi").value.trim();
      const kodeBarang = document.getElementById("addKodeBarang").value.trim().toUpperCase();
      const namaBarang = document.getElementById("addNamaBarang").value.trim();
      const jenisBarang = document.getElementById("addJenisBarang").value;
      const edisi = document.getElementById("addEdisi").value.trim();
      const stok = parseInt(document.getElementById("addStok").value, 10);
      const coverUrl =
        document.getElementById("addCoverUrl").value.trim() ||
        "img/pengantar_komunikasi.jpg";

      // Validasi form
      if (!kodeLokasi || !kodeBarang || !namaBarang || !edisi || isNaN(stok)) {
        alert("Harap lengkapi semua isian formulir dengan benar!");
        return;
      }

      if (stok < 0) {
        alert("Jumlah stok tidak boleh bernilai negatif!");
        return;
      }

      // Cek duplikasi kode barang
      const duplicate = dataBahanAjar.some((b) => b.kodeBarang === kodeBarang);
      if (duplicate) {
        alert(`Kode Barang "${kodeBarang}" sudah terdaftar dalam data!`);
        return;
      }

      const newItem = {
        kodeLokasi: kodeLokasi,
        kodeBarang: kodeBarang,
        namaBarang: namaBarang,
        jenisBarang: jenisBarang,
        edisi: edisi,
        stok: stok,
        cover: coverUrl
      };

      // 1. Tambahkan ke data array
      dataBahanAjar.unshift(newItem);

      // 2. Manipulasi DOM langsung (Penambahan baris baru secara dinamis)
      renderStockTable(dataBahanAjar);

      // 3. Beri animasi sorot pada baris baru
      const newTr = document.getElementById(`row-stok-${kodeBarang}`);
      if (newTr) {
        newTr.style.backgroundColor = "#fef9c3";
        setTimeout(() => {
          newTr.style.transition = "background-color 1s ease";
          newTr.style.backgroundColor = "";
        }, 1200);
      }

      // Tutup modal dan reset form
      closeModal("modalTambahStok");
      formTambahStok.reset();
      alert(`Bahan ajar "${namaBarang}" berhasil ditambahkan ke daftar stok!`);
    });
  }

  // Filter & Pencarian
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applyFilters();
    });
  }

  if (filterJenis) {
    filterJenis.addEventListener("change", () => {
      applyFilters();
    });
  }

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const jenis = filterJenis ? filterJenis.value : "";

    const filtered = dataBahanAjar.filter((item) => {
      const matchText =
        item.namaBarang.toLowerCase().includes(query) ||
        item.kodeBarang.toLowerCase().includes(query) ||
        item.kodeLokasi.toLowerCase().includes(query);
      const matchJenis = !jenis || item.jenisBarang === jenis;
      return matchText && matchJenis;
    });

    renderStockTable(filtered);
  }

  // Global handler untuk Hapus Baris Stok via DOM
  window.deleteStockRow = function (kodeBarang) {
    const item = dataBahanAjar.find((b) => b.kodeBarang === kodeBarang);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data "${item.namaBarang}" (${kodeBarang})?`)) {
      // Hapus dari array
      const idx = dataBahanAjar.findIndex((b) => b.kodeBarang === kodeBarang);
      if (idx > -1) {
        dataBahanAjar.splice(idx, 1);
      }

      // Hapus elemen DOM
      const rowElem = document.getElementById(`row-stok-${kodeBarang}`);
      if (rowElem) {
        rowElem.remove();
      }

      // Perbarui counter
      if (totalItemsBadge) {
        totalItemsBadge.textContent = `${dataBahanAjar.length} Bahan Ajar`;
      }
    }
  };

  /**
   * Menampilkan Modal Detail Peragaan Data Bahan Ajar (Sesuai Screenshot Halaman 4)
   */
  window.showDetailBahanAjar = function (kodeBarang) {
    const item = dataBahanAjar.find((b) => b.kodeBarang === kodeBarang);
    if (!item) return;

    const modalBody = document.getElementById("detailBahanAjarContent");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="detail-card-layout">
          <!-- Cover Gambar Bahan Ajar -->
          <img src="${item.cover}" alt="${item.namaBarang}" class="detail-cover-large"
               onerror="this.src='https://placehold.co/180x240/003366/ffffff?text=BMP+UT'">
          
          <table class="detail-table">
            <tbody>
              <tr>
                <th>Kode Lokasi</th>
                <td><code>${item.kodeLokasi}</code></td>
              </tr>
              <tr>
                <th>Kode Barang</th>
                <td><strong style="color: var(--ut-blue);">${item.kodeBarang}</strong></td>
              </tr>
              <tr>
                <th>Nama Barang</th>
                <td>${item.namaBarang}</td>
              </tr>
              <tr>
                <th>Jenis Barang</th>
                <td><span class="sample-badge">${item.jenisBarang}</span></td>
              </tr>
              <tr>
                <th>Edisi</th>
                <td>Edisi ${item.edisi}</td>
              </tr>
              <tr>
                <th>Stok Tersedia</th>
                <td><span style="font-size: 1.2rem; color: var(--ut-blue-light);">${item.stok} Eksemplar</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    openModal("modalDetailBahanAjar");
  };
}

// =============================================================================
// 7. MODAL LAPORAN NAVIGASI (Monitoring Progress DO & Rekap Bahan Ajar)
// =============================================================================

function showModalLaporanMonitoring() {
  const container = document.getElementById("modalLaporanMonitoringBody");
  if (container && typeof dataTracking !== "undefined") {
    let html = `
      <p style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.88rem;">
        Berikut adalah ringkasan monitoring progres seluruh Delivery Order Bahan Ajar di UT-Daerah:
      </p>
      <table class="custom-table" style="font-size: 0.85rem;">
        <thead>
          <tr>
            <th>Nomor DO</th>
            <th>Penerima</th>
            <th>Ekspedisi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
    `;

    Object.keys(dataTracking).forEach((key) => {
      const doData = dataTracking[key];
      html += `
        <tr>
          <td><strong>#${doData.nomorDO || key}</strong></td>
          <td>${doData.nama}</td>
          <td>${doData.ekspedisi}</td>
          <td><span class="sample-badge">${doData.status}</span></td>
          <td>
            <a href="tracking.html?do=${key}" class="btn btn-ut btn-sm" style="text-decoration:none;">
              Lihat Detail
            </a>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }
  openModal("modalLaporanMonitoring");
}

function showModalLaporanRekap() {
  const container = document.getElementById("modalLaporanRekapBody");
  if (container && typeof dataBahanAjar !== "undefined") {
    const totalJudul = dataBahanAjar.length;
    const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);

    let html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: var(--ut-blue-subtle); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--ut-blue);">${totalJudul}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Total Judul Modul</div>
        </div>
        <div style="background: var(--ut-gold-light); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 800; color: #b45309;">${totalStok.toLocaleString("id-ID")}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Total Eksemplar Stok</div>
        </div>
      </div>
      <p style="font-size: 0.88rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--ut-blue-dark);">Distribusi Stok per Bahan Ajar:</p>
      <ul style="list-style: none; padding: 0;">
    `;

    dataBahanAjar.forEach((b) => {
      const pct = Math.round((b.stok / totalStok) * 100);
      html += `
        <li style="margin-bottom: 0.75rem; background: #f8fafc; padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem;">
            <span>${b.namaBarang} (${b.kodeBarang})</span>
            <span>${b.stok} exp (${pct}%)</span>
          </div>
          <div style="background: #e2e8f0; height: 6px; border-radius: 99px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: var(--ut-blue-light);"></div>
          </div>
        </li>
      `;
    });

    html += `</ul>`;
    container.innerHTML = html;
  }
  openModal("modalLaporanRekap");
}
