import {
  getValue,
  onClick,
} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js";
import { validatePhoneNumber } from "https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js";

// Fungsi validasi isPhone (dipakai sebelum submit)
function isPhone(value, message) {
  const phoneRegex = /^62[0-9]{8,15}$/;
  if (!phoneRegex.test(value)) {
    return message;
  }
  return true;
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
    const phoneValidation = isPhone(
      identifierInput,
      "Nomor WhatsApp tidak valid (harus format 62xxxxxxxxxx)"
    );

    if (phoneValidation !== true) {
      Swal.fire("Nomor Tidak Valid", phoneValidation, "error");
      return;
    }

    loginData.Identifier = identifierInput;
  } else {
    loginData.Identifier = identifierInput;
  }

  try {
    const response = await fetch(
      "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );

    const result = await response.json();

    if (response.status === 200 && result.Status === "OK") {
      Swal.fire("Berhasil", "Login berhasil!", "success").then(() => {
        window.location.href = "/dashboard"; // Ganti sesuai kebutuhan
      });
    } else {
      Swal.fire(
        "Login Gagal",
        result.Response || "Email atau nomor tidak ditemukan",
        "error"
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    Swal.fire("Error", "Terjadi kesalahan saat login.", "error");
  }
}

// Event listener saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  onClick("login-button", loginUser);

  // Auto-format nomor WhatsApp saat user mengetik (seperti di register)
  const phoneInput = document.querySelector(".validate-phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      // Auto-format mirip validatePhoneNumber internal
      let cleaned = phoneInput.value.replace(/\D/g, ""); // hapus semua non-digit

      if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.slice(1);
      } else if (cleaned.startsWith("8")) {
        cleaned = "62" + cleaned;
      } else if (cleaned.startsWith("620")) {
        cleaned = "62" + cleaned.slice(3);
      }
      phoneInput.value = cleaned;

      // Jalankan validasi visual juga (sama dengan register)
      validatePhoneNumber(phoneInput);
    });
  }
});