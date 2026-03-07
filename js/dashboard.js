/* ============================================================
   ARENA 24 — DASHBOARD.JS
   Match countdown, notifications, stats animation
   ============================================================ */

(function Dashboard() {

  /* ── MATCH COUNTDOWN ── */
  const matchCountdown = document.getElementById('matchCountdown');
  if (matchCountdown) {
    /* Calculate seconds until 7:00 PM today */
    const now     = new Date();
    const matchAt = new Date();
    matchAt.setHours(19, 0, 0, 0);

    let diffSecs = Math.floor((matchAt - now) / 1000);
    if (diffSecs < 0) diffSecs += 86400; /* next day if already passed */

    A24.startCountdown(matchCountdown, diffSecs, () => {
      matchCountdown.textContent = 'Match starting NOW!';
      matchCountdown.style.color = 'var(--live)';
      A24.showToast('Your match is starting now! Check your email for room details.', 'info');
    });
  }

  /* ── NOTIFICATIONS MARK READ ── */
  const notifItems = document.querySelectorAll('.notif-item');
  notifItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.remove('notif-unread');

      /* Update count badge */
      const count = document.querySelectorAll('.notif-unread').length;
      const badge = document.querySelector('.notif-count');
      if (badge) {
        badge.textContent = count;
        if (count === 0) badge.style.display = 'none';
      }

      /* Also update sidebar badge */
      const snBadge = document.querySelector('.sn-badge');
      if (snBadge) {
        snBadge.textContent = count;
        if (count === 0) snBadge.remove();
      }
    });
  });

  /* ── STAT CARD COUNTER ANIMATION ── */
  const statVals = document.querySelectorAll('.dsc-val');
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statsObs.disconnect();

      statVals.forEach(el => {
        const raw = el.textContent.trim();
        /* Animate numeric values */
        const numMatch = raw.match(/[\d,]+/);
        if (!numMatch) return;
        const target = parseInt(numMatch[0].replace(',', ''));
        if (isNaN(target) || target > 100000) return; /* skip large or non-numeric */

        let current = 0;
        const step  = Math.ceil(target / 40);
        const prefix = raw.includes('₹') ? '₹' : '';
        const suffix = raw.includes('+') ? '+' : raw.includes('#') ? '' : '';

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
          if (current >= target) {
            el.textContent = raw; /* restore original formatted string */
            clearInterval(timer);
          }
        }, 30);
      });
    });
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.dash-stats-row');
  if (statsRow) statsObs.observe(statsRow);

  /* ── SIDEBAR ACTIVE HIGHLIGHT ── */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sn-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href === currentPage) item.classList.add('active');
  });

  /* ── PAYMENT TABLE COLORS ── */
  document.querySelectorAll('.payment-table .pt-row').forEach(row => {
    const cells = row.querySelectorAll('span, td');
    cells.forEach(cell => {
      const text = cell.textContent.trim();
      if (text.startsWith('+₹')) cell.style.color = 'var(--live)';
      if (text.startsWith('-₹')) cell.style.color = 'var(--accent-2)';
    });
  });

  /* ── WELCOME GREETING TIME ── */
  const greeting = document.querySelector('.dash-greeting');
  if (greeting) {
    const h = new Date().getHours();
    const timeOfDay = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    const name = greeting.querySelector('.accent')?.textContent;
    if (name) greeting.innerHTML = `${timeOfDay}, <span class="accent">${name}</span> 🎯`;
  }

  /* ── MOBILE SIDEBAR TOGGLE ── */
  /* Add a hamburger for mobile dashboard if sidebar is hidden */
  if (window.innerWidth <= 768) {
    const dashMain = document.querySelector('.dash-main');
    const sidebar  = document.querySelector('.dash-sidebar');
    if (dashMain && sidebar) {
      const mobileToggle = document.createElement('button');
      mobileToggle.className = 'btn-ghost';
      mobileToggle.textContent = '☰ Menu';
      mobileToggle.style.cssText = 'margin-bottom:16px;border:1px solid var(--border);border-radius:6px;';
      dashMain.insertBefore(mobileToggle, dashMain.firstChild);

      let open = false;
      mobileToggle.addEventListener('click', () => {
        open = !open;
        sidebar.style.display = open ? 'flex' : '';
        mobileToggle.textContent = open ? '✕ Close' : '☰ Menu';
      });
    }
  }

})();
