import {
    setValue,
    getValue,
    onClick,
  } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js";
  import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js";
  
  async function loginUser(event) {
    event.preventDefault(); // Prevent default form submission
  
    const email = getValue("login-email");
    const password = getValue("login-password");
  
    // Simple validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
  
    const loginData = {
      Email: email,
      Password: password,
    };
  
    try {
      const response = await postJSON(
        "https://asia-southeast2-awangga.cloudfunctions.net/domyid/auth/login",
        loginData
      );
      if (response.Status === "OK") {
        alert("Login Successful");
        // Redirect or perform other actions on successful login
      } else {
        alert("Login Failed: " + response.Response);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login. Please try again later.");
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    onClick("login-button", loginUser);
  });
  