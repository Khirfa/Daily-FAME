const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKdqS2LVkMHd5zre6gKfoJ1PMhI8_50anojzrWUonO0lRmWPObZop_DTkMDKBe-YWt2Q/exec";

// =========================================================
// INISIALISASI & EVENT LISTENER
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  // Cek status login saat halaman dimuat
  checkLoginStatus();

  // Listener untuk perubahan Sheet Target atau Tanggal Upload
  const sheetSelect = document.getElementById("sheetTarget");
  const dateInput = document.getElementById("tanggalUpload");

  if (sheetSelect) sheetSelect.addEventListener("change", autoFillForm);
  if (dateInput) dateInput.addEventListener("change", autoFillForm);

  // Listener untuk Form Login (jika ada form)
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      validatePassword();
    });
  }
});

// =========================================================
// SISTEM AUTENTIKASI / LOGIN
// =========================================================
function checkLoginStatus() {
  const isAuthorized = localStorage.getItem("app_authorized");
  const overlay = document.getElementById("loginOverlay");
  const mainApp = document.getElementById("mainAppContainer");

  if (isAuthorized === "true") {
    if (overlay) overlay.style.display = "none";
    if (mainApp) mainApp.style.display = "block";
  } else {
    if (overlay) overlay.style.display = "flex";
    if (mainApp) mainApp.style.display = "none";
  }
}

function validatePassword() {
  const passInput = document.getElementById("appPassword") || document.getElementById("inputPassword");
  const errorMsg = document.getElementById("loginError");
  const btnLogin = document.getElementById("btnLogin") || document.querySelector("#loginOverlay button");

  if (!passInput) return;

  const password = passInput.value.trim();
  if (!password) {
    if (errorMsg) errorMsg.innerText = "❌ Masukkan kata sandi terlebih dahulu!";
    return;
  }

  // Indikator Loading
  if (btnLogin) {
    btnLogin.disabled = true;
    btnLogin.innerText = "Memeriksa...";
  }
  if (errorMsg) errorMsg.innerText = "";

  // Verifikasi Password ke Google Apps Script (Keamanan Server-Side)
  const verifyUrl = `${SCRIPT_URL}?action=verifyPassword&password=${encodeURIComponent(password)}`;

  fetch(verifyUrl)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        localStorage.setItem("app_authorized", "true");
        checkLoginStatus();
        passInput.value = "";
      } else {
        if (errorMsg) errorMsg.innerText = "❌ Kata sandi salah! Coba lagi.";
        passInput.value = "";
        passInput.focus();
      }
    })
    .catch(err => {
      console.error("Login Error:", err);
      if (errorMsg) errorMsg.innerText = "❌ Gagal terhubung ke server!";
    })
    .finally(() => {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.innerText = "Masuk";
      }
    });
}

function checkPasswordKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    validatePassword();
  }
}

function logoutSession() {
  // Hapus semua penanda status login
  localStorage.removeItem("app_authorized");
  sessionStorage.removeItem("app_authorized");

  // Reset isi form
  resetForm();

  // Tampilkan kembali layar login
  checkLoginStatus();

  // Reset input password & pesan error
  const passInput = document.getElementById("appPassword") || document.getElementById("inputPassword");
  const errorMsg = document.getElementById("loginError");
  if (passInput) passInput.value = "";
  if (errorMsg) errorMsg.innerText = "";
}

// =========================================================
// HELPER FORMATTING & INPUT VALUE
// =========================================================
function formatInputRibuan(input) {
  let rawValue = input.value.replace(/[^0-9]/g, '');
  if (rawValue === "") {
    input.value = "";
    return;
  }
  input.value = new Intl.NumberFormat('id-ID').format(rawValue);
}

function getRawValue(id) {
  let el = document.getElementById(id);
  if (!el || !el.value) return "";
  let val = el.value.trim();
  if (val === "-") return "";
  return val.replace(/\./g, '');
}

function getTextValue(id) {
  let el = document.getElementById(id);
  if (!el || !el.value) return "";
  let val = el.value.trim();
  return val === "-" ? "" : val;
}

function resetForm() {
  const inputIds = [
    "intel", "arena", "terorKutubPolar", "terorKutubReaper", "joinTerorKutub",
    "dawnAcademyTas", "dawnAcademySigil", "dawnAcademyBuku",
    "bentengFort", "bentengSH",
    "bearTrap", "frostFire", "fishing", "snowbuster", "allianceMobilization", "mercenaryPrestige", "esSerut", "crazyJoe",
    "svsPrepPoint", "svsPrepRank", "svsBattlePoint", "svsBattleRank",
    "sfcPoint", "sfcRank",
    "canyonClash", "foundryBattle"
  ];
  
  inputIds.forEach(id => {
    let el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// =========================================================
// SUBMIT DATA
// =========================================================
function submitData() {
  let tanggal = document.getElementById("tanggalUpload").value;
  if (!tanggal) {
    alert("⚠️ Harap pilih tanggal upload terlebih dahulu!");
    return;
  }

  let submitBtn = document.querySelector(".btn-submit");
  let originalText = submitBtn ? submitBtn.innerHTML : "Simpan Data";
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Menyimpan...</span>";
  }

  var payload = {
    sheetTarget: document.getElementById("sheetTarget").value,
    tanggalUpload: tanggal,
    
    intel: getRawValue("intel"),
    arena: getRawValue("arena"),
    terorKutubPolar: getRawValue("terorKutubPolar"),
    terorKutubReaper: getRawValue("terorKutubReaper"),
    joinTerorKutub: getRawValue("joinTerorKutub"),
    dawnAcademyTas: getRawValue("dawnAcademyTas"),
    dawnAcademySigil: getRawValue("dawnAcademySigil"),
    dawnAcademyBuku: getRawValue("dawnAcademyBuku"),

    bentengFort: getRawValue("bentengFort"),
    bentengSH: getRawValue("bentengSH"),

    bearTrap: getRawValue("bearTrap"),
    frostFire: getRawValue("frostFire"),
    fishing: getRawValue("fishing"),
    snowbuster: getRawValue("snowbuster"),
    allianceMobilization: getRawValue("allianceMobilization"),
    mercenaryPrestige: getRawValue("mercenaryPrestige"),
    esSerut: getRawValue("esSerut"),
    crazyJoe: getRawValue("crazyJoe"),

    svsPrepPoint: getRawValue("svsPrepPoint"),
    svsPrepRank: getTextValue("svsPrepRank"),
    svsBattlePoint: getRawValue("svsBattlePoint"),
    svsBattleRank: getTextValue("svsBattleRank"),
    sfcPoint: getRawValue("sfcPoint"),
    sfcRank: getTextValue("sfcRank"),
    canyonClash: getRawValue("canyonClash"),
    foundryBattle: getRawValue("foundryBattle")
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert("✅ Data berhasil disimpan ke Spreadsheet!");
    resetForm();
  })
  .catch(err => {
    alert("❌ Gagal mengirim data: Periksa koneksi internet Anda.");
    console.error("Submit Error:", err);
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
    // Sesi berakhir otomatis setelah submit
    logoutSession();
  });
}

// =========================================================
// AUTO-FILL FORM DATA
// =========================================================
const fieldMap = {
  intel: "intel",
  arena: "arena",
  terorKutubPolar: "terorKutubPolar",
  terorKutubReaper: "terorKutubReaper",
  joinTerorKutub: "joinTerorKutub",
  dawnAcademyTas: "dawnAcademyTas",
  dawnAcademySigil: "dawnAcademySigil",
  dawnAcademyBuku: "dawnAcademyBuku",

  bentengFort: "bentengFort",
  bentengSH: "bentengSH",

  bearTrap: "bearTrap",
  frostFire: "frostFire",
  fishing: "fishing",
  snowbuster: "snowbuster",
  allianceMobilization: "allianceMobilization",
  mercenaryPrestige: "mercenaryPrestige",
  esSerut: "esSerut",
  crazyJoe: "crazyJoe",

  canyonClash: "canyonClash",
  foundryBattle: "foundryBattle"
};

// =========================================================
// AUTO-FILL FORM AS PLACEHOLDER
// =========================================================
function autoFillForm() {
  const sheetTarget = document.getElementById("sheetTarget") ? document.getElementById("sheetTarget").value : "";
  const tanggalUpload = document.getElementById("tanggalUpload") ? document.getElementById("tanggalUpload").value : "";

  if (!sheetTarget || !tanggalUpload) return;

  fetch(`${SCRIPT_URL}?sheetTarget=${encodeURIComponent(sheetTarget)}`)
    .then(res => res.json())
    .then(response => {
      if (response.status === "success" && Array.isArray(response.message)) {
        const matchedData = response.message.find(item => item.tanggal === tanggalUpload);

        if (matchedData) {
          // 1. Masukkan ke placeholder untuk field standar
          Object.keys(fieldMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
              const rawVal = matchedData[fieldMap[id]] || "";
              const formattedVal = formatAngkaRibuanText(rawVal);
              
              el.value = ""; // Pastikan input tetap kosong
              el.placeholder = formattedVal || "0"; // Masukkan data lama ke placeholder
            }
          });

          // 2. Parse data SVS & SFC ke placeholder
          parseSvsDataToPlaceholder(matchedData.svsCombined);
          parseSfcDataToPlaceholder(matchedData.sfcCombined);

        } else {
          clearFormPlaceholders();
        }
      }
    })
    .catch(err => console.error("Gagal auto-fill placeholder:", err));
}

// Helper untuk format teks angka ke format ribuan Indonesia (contoh: 1250000 -> 1.250.000)
function formatAngkaRibuanText(val) {
  if (val === null || val === undefined) return "";
  let strVal = String(val).trim();
  if (!strVal || strVal === "-") return "";
  let cleanNum = strVal.replace(/\./g, '');
  let num = Number(cleanNum);
  return (!isNaN(num) && cleanNum !== "") ? new Intl.NumberFormat('id-ID').format(num) : strVal;
}

function parseSvsDataToPlaceholder(svsText) {
  const fields = ["svsPrepPoint", "svsPrepRank", "svsBattlePoint", "svsBattleRank"];
  
  if (!svsText || String(svsText).trim() === "") {
    fields.forEach(id => setPlaceholderAndClearValue(id, ""));
    return;
  }

  const str = String(svsText);

  // Regex fleksibel: Mencari angka setelah "Prep:" / "Battle:" serta Rank [Rank X] atau (Rank X)
  // Contoh format sheet: "Prep: [Rank 5] 1.250.000\nBattle: [Rank 2] 5.000.000"
  // Atau format: "Prep: 1.250.000"
  
  // 1. Prep Point & Rank
  const prepSectionMatch = str.match(/Prep:[^\n]*/i);
  let prepPt = "";
  let prepRk = "";
  if (prepSectionMatch) {
    const prepText = prepSectionMatch[0];
    const rkMatch = prepText.match(/Rank\s*(\d+)/i);
    if (rkMatch) prepRk = rkMatch[1];
    
    // Ambil angka poin (menghapus bagian Rank terlebih dahulu)
    const textWithoutRank = prepText.replace(/Rank\s*\d+/gi, '').replace(/\[|\]|\(|\)/g, '');
    const ptMatch = textWithoutRank.match(/[\d.]+/);
    if (ptMatch) prepPt = ptMatch[0];
  }

  // 2. Battle Point & Rank
  const battleSectionMatch = str.match(/Battle:[^\n]*/i);
  let btlPt = "";
  let btlRk = "";
  if (battleSectionMatch) {
    const btlText = battleSectionMatch[0];
    const rkMatch = btlText.match(/Rank\s*(\d+)/i);
    if (rkMatch) btlRk = rkMatch[1];

    const textWithoutRank = btlText.replace(/Rank\s*\d+/gi, '').replace(/\[|\]|\(|\)/g, '');
    const ptMatch = textWithoutRank.match(/[\d.]+/);
    if (ptMatch) btlPt = ptMatch[0];
  }

  // Set nilai ke Placeholder
  setPlaceholderAndClearValue("svsPrepPoint", formatAngkaRibuanText(prepPt));
  setPlaceholderAndClearValue("svsPrepRank", prepRk);
  setPlaceholderAndClearValue("svsBattlePoint", formatAngkaRibuanText(btlPt));
  setPlaceholderAndClearValue("svsBattleRank", btlRk);
}

// =========================================================
// HELPER PARSING SFC KE PLACEHOLDER
// =========================================================
function parseSfcDataToPlaceholder(sfcText) {
  const fields = ["sfcPoint", "sfcRank"];

  if (!sfcText || String(sfcText).trim() === "") {
    fields.forEach(id => setPlaceholderAndClearValue(id, ""));
    return;
  }

  const str = String(sfcText);
  const rkMatch = str.match(/Rank\s*(\d+)/i);
  let rk = rkMatch ? rkMatch[1] : "";

  // Ambil angka poin
  const textWithoutRank = str.replace(/Rank\s*\d+/gi, '').replace(/\[|\]|\(|\)/g, '');
  const ptMatch = textWithoutRank.match(/[\d.]+/);
  let pt = ptMatch ? ptMatch[0] : "";

  setPlaceholderAndClearValue("sfcPoint", formatAngkaRibuanText(pt));
  setPlaceholderAndClearValue("sfcRank", rk);
}

// Helper setting nilai placeholder & mengosongkan input value
function setPlaceholderAndClearValue(id, placeholderValue) {
  const el = document.getElementById(id);
  if (el) {
    el.value = "";
    el.placeholder = placeholderValue || "0";
  }
}

// Helper setting nilai placeholder & mengosongkan input value
function setPlaceholderAndClearValue(id, placeholderValue) {
  const el = document.getElementById(id);
  if (el) {
    el.value = "";
    el.placeholder = placeholderValue || "0";
  }
}

// Mengosongkan value & placeholder jika tanggal belum ada datanya
function clearFormPlaceholders() {
  Object.keys(fieldMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = "";
      el.placeholder = "";
    }
  });

  const extraIds = ["svsPrepPoint", "svsPrepRank", "svsBattlePoint", "svsBattleRank", "sfcPoint", "sfcRank"];
  extraIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = "";
      el.placeholder = "";
    }
  });
}