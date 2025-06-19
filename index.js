import {
  getValue,
  onClick,
} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js";
import { validatePhoneNumber } from "https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js"; // jika kamu pakai juga saat input

// Validasi nomor WhatsApp (mirip yang di register)
function isPhone(value, message) {
  const phoneRegex = /^62[0-9]{8,15}$/;
  if (!phoneRegex.test(value)) {
    return message;
  }
  return true;
}

// Normalisasi input nomor HP (ubah 08xxx jadi 62xxx)
function normalizePhoneNumber(input) {
  let cleaned = input.replace(/\D/g, ""); // hapus karakter non-digit
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  } else if (cleaned.startsWith("620")) {
    cleaned = "62" + cleaned.slice(3);
  }
  return cleaned;
}

// Fungsi utama login
async function loginUser(event) {
  event.preventDefault();

  const identifierInput = getValue("login-email").trim();
  const password = getValue("login-password").trim();

  if (!identifierInput || !password) {
    Swal.fire("Oops", "Mohon isi semua kolom", "warning");
    return;
  }

  const isPhoneInput = !identifierInput.includes("@");
  let loginData = {
    Password: password,
  };

  if (isPhoneInput) {
    const normalizedPhone = normalizePhoneNumber(identifierInput);
    const phoneValidation = isPhone(
      normalizedPhone,
      "Nomor WhatsApp tidak valid, gunakan format 62xxxxxxxxxx"
    );

    if (phoneValidation !== true) {
      Swal.fire("Nomor Tidak Valid", phoneValidation, "error");
      return;
    }

    loginData = {
      Identifier: normalizedPhone, // backend harus support Identifier
      Password: password,
    };
  } else {
    loginData = {
      Identifier: identifierInput,
      Password: password,
    };
  }

  try {
    const response = await postJSON(
      "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/login",
      loginData
    );

    if (response.Status === "OK") {
      Swal.fire("Berhasil", "Login berhasil!", "success").then(() => {
        window.location.href = "/dashboard"; // Ganti sesuai halaman tujuanmu
      });
    } else {
      Swal.fire(
        "Gagal Login",
        response.Response || "Email atau nomor tidak ditemukan",
        "error"
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    Swal.fire("Error", "Terjadi kesalahan saat login.", "error");
  }
}

// Event listener untuk tombol login
document.addEventListener("DOMContentLoaded", () => {
  onClick("login-button", loginUser);
});