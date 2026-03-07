/* ============================================================
   ARENA 24 — AUTH.JS
   Login + Register validation, password strength, security
   ============================================================ */

/* ════════════════════════════════════════
   SHARED: PASSWORD TOGGLE
════════════════════════════════════════ */
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '🙈' : '👁';
  });
});

/* ════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════ */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailEl    = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const authError  = document.getElementById('authError');
    const loginBtn   = document.getElementById('loginBtn');
    const loader     = document.getElementById('loginLoader');

    let valid = true;

    /* Clear errors */
    clearError('fg-email');
    clearError('fg-password');
    if (authError) authError.classList.add('hidden');

    const email    = emailEl?.value.trim()    || '';
    const password = passwordEl?.value.trim() || '';

    /* Validate email */
    if (!email) {
      showFieldError('fg-email', 'err-email', 'Email is required');
      valid = false;
    } else if (!A24.isValidEmail(email)) {
      showFieldError('fg-email', 'err-email', 'Enter a valid email address');
      valid = false;
    }

    /* Validate password */
    if (!password) {
      showFieldError('fg-password', 'err-password', 'Password is required');
      valid = false;
    } else if (password.length < 8) {
      showFieldError('fg-password', 'err-password', 'Password must be at least 8 characters');
      valid = false;
    }

    if (!valid) return;

    /* Rate limit login attempts */
    if (!A24.checkRateLimit('login', 5, 60000)) {
      if (authError) {
        authError.textContent = '⚠️ Too many login attempts. Please wait a minute.';
        authError.classList.remove('hidden');
      }
      return;
    }

    /* Show loader */
    if (loginBtn) loginBtn.disabled = true;
    if (loader)   loader.classList.remove('hidden');
    const btnText = loginBtn?.querySelector('.btn-text');
    if (btnText)  btnText.textContent = 'Logging in...';

    /* Simulate API call — replace with real fetch to backend */
    setTimeout(() => {
      if (loginBtn) loginBtn.disabled = false;
      if (loader)   loader.classList.add('hidden');
      if (btnText)  btnText.textContent = 'Login';

      /* Simulate success — in production check response from server */
      const simulateSuccess = email.includes('@') && password.length >= 8;
      if (simulateSuccess) {
        sessionStorage.setItem('a24_user', JSON.stringify({ email }));
        A24.showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
      } else {
        if (authError) authError.classList.remove('hidden');
      }
    }, 1400);
  });
}

/* ════════════════════════════════════════
   REGISTER PAGE
════════════════════════════════════════ */
const registerForm = document.getElementById('registerForm');
if (registerForm) {

  /* ── PASSWORD STRENGTH ── */
  const pwInput  = document.getElementById('reg-password');
  const pwsFill  = document.getElementById('pwsFill');
  const pwsLabel = document.getElementById('pwsLabel');

  if (pwInput) {
    pwInput.addEventListener('input', () => {
      const pw = pwInput.value;
      const score = getPasswordScore(pw);
      const levels = [
        { pct: 0,   color: '#ff0040', label: 'Too weak' },
        { pct: 25,  color: '#ff6b00', label: 'Weak' },
        { pct: 50,  color: '#ffd700', label: 'Fair' },
        { pct: 75,  color: '#00c9a7', label: 'Good' },
        { pct: 100, color: '#00e87a', label: 'Strong ✓' },
      ];
      const level = levels[score];
      if (pwsFill)  { pwsFill.style.width = level.pct + '%'; pwsFill.style.background = level.color; }
      if (pwsLabel) pwsLabel.textContent = `Strength: ${level.label}`;
    });
  }

  function getPasswordScore(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  }

  /* ── SUBMIT ── */
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Clear all errors */
    ['fg-fname','fg-lname','fg-username','fg-reg-email','fg-phone','fg-reg-password','fg-confirm-password'].forEach(clearError);
    clearError('err-terms');

    const fname    = document.getElementById('fname')?.value.trim()            || '';
    const lname    = document.getElementById('lname')?.value.trim()            || '';
    const username = document.getElementById('username')?.value.trim()         || '';
    const email    = document.getElementById('reg-email')?.value.trim()        || '';
    const phone    = document.getElementById('phone')?.value.trim()            || '';
    const password = document.getElementById('reg-password')?.value.trim()     || '';
    const confirm  = document.getElementById('confirm-password')?.value.trim() || '';
    const agreed   = document.getElementById('agreeTerms')?.checked            || false;

    let valid = true;

    if (!fname) { showFieldError('fg-fname', 'err-fname', 'First name is required'); valid = false; }
    if (!lname) { showFieldError('fg-lname', 'err-lname', 'Last name is required'); valid = false; }

    if (!username || username.length < 3) {
      showFieldError('fg-username', 'err-username', 'Username must be at least 3 characters');
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showFieldError('fg-username', 'err-username', 'Only letters, numbers and underscores allowed');
      valid = false;
    }

    if (!email) {
      showFieldError('fg-reg-email', 'err-reg-email', 'Email is required');
      valid = false;
    } else if (!A24.isValidEmail(email)) {
      showFieldError('fg-reg-email', 'err-reg-email', 'Enter a valid email address');
      valid = false;
    }

    if (!phone) {
      showFieldError('fg-phone', 'err-phone', 'Phone number is required');
      valid = false;
    } else if (!A24.isValidPhone(phone)) {
      showFieldError('fg-phone', 'err-phone', 'Enter a valid 10-digit Indian mobile number');
      valid = false;
    }

    if (!password || password.length < 8) {
      showFieldError('fg-reg-password', 'err-reg-password', 'Password must be at least 8 characters');
      valid = false;
    }

    if (password !== confirm) {
      showFieldError('fg-confirm-password', 'err-confirm-password', 'Passwords do not match');
      valid = false;
    }

    if (!agreed) {
      const termsErr = document.getElementById('err-terms');
      if (termsErr) termsErr.textContent = 'You must agree to the Terms of Service';
      valid = false;
    }

    if (!valid) return;

    /* Rate limit */
    if (!A24.checkRateLimit('register', 3, 300000)) {
      A24.showToast('Too many registration attempts. Please try again later.', 'error');
      return;
    }

    /* Loading state */
    const regBtn = document.getElementById('registerBtn');
    const regLoader = document.getElementById('regLoader');
    if (regBtn) regBtn.disabled = true;
    if (regLoader) regLoader.classList.remove('hidden');
    const btnText = regBtn?.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Creating account...';

    /* Simulate API — replace with fetch POST /api/auth/register */
    setTimeout(() => {
      if (regBtn) regBtn.disabled = false;
      if (regLoader) regLoader.classList.add('hidden');
      if (btnText) btnText.textContent = 'Create Account';

      /* Show email verification screen */
      const registerCard = document.getElementById('registerCard');
      const verifyCard   = document.getElementById('verifyCard');
      const sentDisplay  = document.getElementById('sentEmailDisplay');

      if (sentDisplay) sentDisplay.textContent = email;
      if (registerCard) registerCard.classList.add('hidden');
      if (verifyCard)   verifyCard.classList.remove('hidden');

    }, 1600);
  });

  /* ── RESEND EMAIL ── */
  const resendBtn = document.getElementById('resendBtn');
  if (resendBtn) {
    let resendCooldown = false;
    resendBtn.addEventListener('click', () => {
      if (resendCooldown) {
        A24.showToast('Please wait 60 seconds before resending.', 'error');
        return;
      }
      resendCooldown = true;
      resendBtn.textContent = 'Email Sent!';
      resendBtn.disabled = true;
      A24.showToast('Verification email resent successfully!', 'success');
      setTimeout(() => {
        resendBtn.textContent = 'Resend Verification Email';
        resendBtn.disabled = false;
        resendCooldown = false;
      }, 60000);
    });
  }
}

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function showFieldError(groupId, errId, message) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errId);
  if (group) {
    const input = group.querySelector('input, select, textarea');
    if (input) input.style.borderColor = '#ff0040';
  }
  if (err) err.textContent = message;
}

function clearError(groupIdOrErrId) {
  const el = document.getElementById(groupIdOrErrId);
  if (!el) return;
  const input = el.querySelector('input, select, textarea');
  if (input) input.style.borderColor = '';
  const errEl = el.querySelector('[id^="err-"]');
  if (errEl) errEl.textContent = '';
  /* also clear direct error elements */
  if (el.textContent && el.tagName === 'SPAN') el.textContent = '';
}

/* Auto-clear field error on input */
document.querySelectorAll('.auth-form input').forEach(input => {
  input.addEventListener('input', () => {
    input.style.borderColor = '';
  });
});
