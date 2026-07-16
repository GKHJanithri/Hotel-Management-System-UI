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

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('hotelSysUser'));
  } catch (error) {
    return null;
  }
}

function isValidCredentials(username, password) {
  const storedUser = getStoredUser();
  if (!storedUser) {
    return false;
  }

  const normalizedUsername = username.toLowerCase();
  const storedUsername = (storedUser.username || storedUser.name || '').toLowerCase();
  const storedEmail = (storedUser.email || '').toLowerCase();

  return (normalizedUsername === storedUsername || normalizedUsername === storedEmail) && password === storedUser.password;
}

// ── Live clear on input ──
document.getElementById('username').addEventListener('input', () => {
  clearError('grp-username');
});

document.getElementById('password').addEventListener('input', () => {
  clearError('grp-password');
});

// ── Form submit ──
document.getElementById('signinForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  let valid = true;

  // Validate username
  if (username.length === 0) {
    setError('grp-username', 'Please enter your username.');
    valid = false;
  } else {
    clearError('grp-username');
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

  if (!getStoredUser()) {
    setError('grp-username', 'No account found. Please sign up first.');
    return;
  }

  if (!isValidCredentials(username, password)) {
    setError('grp-password', 'Invalid username or password.');
    return;
  }

  clearError('grp-username');
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