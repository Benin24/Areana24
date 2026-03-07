/* ============================================================
   ARENA 24 — GLOBAL.JS
   Navbar scroll, mobile menu, user dropdown, shared utils
   ============================================================ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── MOBILE NAV TOGGLE ── */
const navToggle  = document.getElementById('navToggle');
const navMobile  = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    /* animate burger */
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  /* close on outside click */
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
      navMobile.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

/* ── USER DROPDOWN ── */
const avatarBtn     = document.getElementById('avatarBtn');
const userDropdown  = document.getElementById('userDropdown');
if (avatarBtn && userDropdown) {
  avatarBtn.addEventListener('click', e => {
    e.stopPropagation();
    userDropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => userDropdown.classList.remove('open'));
}

/* ── SET ACTIVE NAV LINK ── */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === path) link.classList.add('active');
  });
})();

/* ════════════════════════════════════════
   SHARED UTILITY FUNCTIONS
════════════════════════════════════════ */

/**
 * Format number as Indian currency string
 * @param {number} n
 * @returns {string}
 */
function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/**
 * Countdown timer — updates a DOM element every second
 * @param {HTMLElement} el
 * @param {number} totalSeconds
 * @param {Function} [onComplete]
 */
function startCountdown(el, totalSeconds, onComplete) {
  if (!el) return;
  let remaining = totalSeconds;
  function tick() {
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    el.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
    if (remaining <= 0) {
      el.textContent = '00:00:00';
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    remaining--;
    setTimeout(tick, 1000);
  }
  tick();
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.a24-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'a24-toast a24-toast-' + type;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;

  /* inject styles once */
  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      .a24-toast {
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        display: flex; align-items: center; gap: 10px;
        padding: 14px 20px;
        background: #1a2235; border: 1px solid #2a3a52;
        border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 600;
        color: #f0f4ff; max-width: 360px;
        animation: toastIn .3s ease both;
      }
      .a24-toast-success { border-color: rgba(0,232,122,.35); }
      .a24-toast-error   { border-color: rgba(255,0,64,.35); }
      .a24-toast-info    { border-color: rgba(255,107,0,.35); }
      @keyframes toastIn {
        from { opacity:0; transform: translateY(12px); }
        to   { opacity:1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * Sanitize user input — strip HTML tags
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validate Indian phone number (10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Rate limiting helper (per key, in-memory)
 * @param {string} key
 * @param {number} maxAttempts
 * @param {number} windowMs
 * @returns {boolean} true if allowed
 */
const _rateLimitMap = {};
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  if (!_rateLimitMap[key]) _rateLimitMap[key] = [];
  _rateLimitMap[key] = _rateLimitMap[key].filter(t => now - t < windowMs);
  if (_rateLimitMap[key].length >= maxAttempts) return false;
  _rateLimitMap[key].push(now);
  return true;
}

/**
 * Debounce function
 */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  } catch {
    showToast('Could not copy. Please copy manually.', 'error');
  }
}

/* Expose globally */
window.A24 = {
  formatINR, startCountdown, showToast,
  sanitize, isValidEmail, isValidPhone,
  checkRateLimit, debounce, copyToClipboard
};
