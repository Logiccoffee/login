import {qrController, deleteCookie} from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.2.1/whatsauth.js";
import {wauthparam} from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.2.1/config.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

if (getCookie("login") === "") {
    // Tetap di halaman login
    setInner("content", "Silakan login untuk melanjutkan."); // Menampilkan pesan untuk login
} else {
    // Ambil data user
    getJSON("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/user", "login", getCookie("login"), validateRole);
}

function validateRole(result) {
    if (result.status === 404) {
        setInner("content", "Silahkan lakukan pendaftaran terlebih dahulu " + result.data.name);
        redirect("/register");
    } else {
        // Cek role untuk mengarahkan halaman
        const userRole = result.data.role;

        // Role yang diizinkan untuk mengakses halaman home
        const allowedRolesForHome = ["user", "dosen"];

        if (allowedRolesForHome.includes(userRole)) {
            redirect("/menu"); // Arahkan user atau dosen ke halaman home
        } else if (userRole === "admin") {
            redirect("/admin/dashboard"); // Arahkan admin ke dashboard admin
        } else if (userRole === "cashier") {
            redirect("/cashier/dashboard"); // Arahkan cashier ke dashboard cashier
        } else {
            setInner("content", "Role tidak dikenali.");
            redirect("/");
        }
    }
    console.log(result);
}

wauthparam.auth_ws = "d3NzOi8vYXBpLndhLm15LmlkL3dzL3doYXRzYXV0aC9wdWJsaWM=";
wauthparam.keyword = "aHR0cHM6Ly93YS5tZS82MjgzODUyODQxMDMxP3RleHQ9d2g0dDVhdXRoMA==";
wauthparam.tokencookiehourslifetime = 18;
wauthparam.redirect = "/menu";
deleteCookie(wauthparam.tokencookiename);
qrController(wauthparam);