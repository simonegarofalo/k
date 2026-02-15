import { validateAuthInput } from "./validateAuthInput.js";
import { showFormError } from "./authFormError.js";
import { showFormSuccess } from "./authFormSucces.js";

// Registration form
const registerForm = document.getElementById("register-form");

if (registerForm) {
 registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document
      .getElementById("register-email")
      .value
      .trim();

    const password = document.getElementById("register-password").value;

    const { valid, errors } = validateAuthInput(
      { email, password },
      "register"
    );

    if (!valid) {
      showFormError(registerForm, Object.values(errors)[0]);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showFormError(registerForm, data.error || "Registration failed");
        return;
      }

      showFormSuccess(registerForm, "Registration successful..");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
 
    } catch (err) {
      showFormError(registerForm, "Server error, try again later");
    }
  });
}


// Login form
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { valid, errors } = validateAuthInput(
      { email, password },
      "login"
    );

    if (!valid) {
      showFormError(loginForm, Object.values(errors)[0]);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showFormError(loginForm, data.error || "Invalid credentials");
        return;
      }

      window.location.href = "/app.html";

    } catch (err) {
      showFormError(loginForm, "Server error, try again later");
    }
  });
}


// Redirect user already logged
window.addEventListener("DOMContentLoaded", async () => {
  if (!loginForm && !registerForm) return;

  try {
    const res = await fetch("/api/auth/me", {
      credentials: "same-origin",
    });
    
    const data = await res.json();

    if (data.authenticated) window.location.href = "/app.html";
  } catch (err) {
    console.error(err);
  }
});

