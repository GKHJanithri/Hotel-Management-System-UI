/* ==========================================================================
   Sign Up Page Logic
   Handles password show/hide toggles and client-side form validation.
   Wire up the actual account-creation API call where noted below.
   ========================================================================== */

/* ---------------- Password show/hide ---------------- */
function setupPasswordToggles() {
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
      } else {
        input.type = "password";
        btn.textContent = "👁";
      }
    });
  });
}

/* ---------------- Sign up form ---------------- */
function setupSignupForm() {
  const form = document.getElementById("signupForm");
  const errorEl = document.getElementById("signupError");
  const accountStorageKey = "hotelSysUser";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const agreed = document.getElementById("agreeTerms").checked;

    if (!name || !email || !phone || !password || !confirmPassword) {
      errorEl.textContent = "Please fill in all fields.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorEl.textContent = "Please enter a valid email address.";
      return;
    }

    if (password.length < 8) {
      errorEl.textContent = "Password must be at least 8 characters.";
      return;
    }

    if (password !== confirmPassword) {
      errorEl.textContent = "Passwords do not match.";
      return;
    }

    if (!agreed) {
      errorEl.textContent = "You must agree to the Terms of Service and Privacy Policy.";
      return;
    }

    const account = {
      username: name,
      name,
      email,
      phone,
      password,
    };

    localStorage.setItem(accountStorageKey, JSON.stringify(account));

    window.location.href = "signin.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();
  setupSignupForm();
});
