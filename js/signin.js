// ── Password toggle ──
const togglePass = document.getElementById('togglePass');
const passInput  = document.getElementById('password');
const passIcon   = document.getElementById('passIcon');

togglePass.addEventListener('click', () => {
  if (passInput.type === 'password') {
    passInput.type = 'text';
    passIcon.className = 'fa-regular fa-eye-slash';
  } else {
    passInput.type = 'password';
    passIcon.className = 'fa-regular fa-eye';
  }
});

// ── Validation helpers ──
function setError(groupId, msg) {
  const grp = document.getElementById(groupId);
  grp.classList.add('has-error');
  const err = grp.querySelector('.err-msg');
  if (err && msg) err.textContent = msg;
}

function clearError(groupId) {
  document.getElementById(groupId).classList.remove('has-error');
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidCredentials(email, password) {
  const allowedEmail = 'himayajanithri@gmail.com';
  const allowedPassword = '123456';

  return email.toLowerCase() === allowedEmail && password === allowedPassword;
}

// ── Live clear on input ──
document.getElementById('email').addEventListener('input', () => {
  clearError('grp-email');
});

document.getElementById('password').addEventListener('input', () => {
  clearError('grp-password');
});

// ── Form submit ──
document.getElementById('signinForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  let valid = true;

  // Validate email
  if (!validateEmail(email)) {
    setError('grp-email', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('grp-email');
  }

  // Validate password
  if (password.length === 0) {
    setError('grp-password', 'Please enter your password.');
    valid = false;
  } else if (password.length < 6) {
    setError('grp-password', 'Password must be at least 6 characters.');
    valid = false;
  } else {
    clearError('grp-password');
  }

  if (!valid) return;

  if (!isValidCredentials(email, password)) {
    setError('grp-password', 'Invalid email or password.');
    return;
  }

  clearError('grp-email');
  clearError('grp-password');

  // ── Success: redirect to dashboard ──
  const btn = document.getElementById('signinBtn');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
  btn.disabled  = true;
  btn.style.background = '#1d4ed8';

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
});

// ── Google sign-in placeholder ──
document.querySelector('.btn-google').addEventListener('click', () => {
  alert('Google Sign-In — connect your Google OAuth here.');
});