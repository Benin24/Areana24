/* ============================================================
   ARENA 24 — LIVE.JS
   Live countdown timers, viewer count simulation, auto-refresh
   ============================================================ */

(function LivePage() {

  /* ── COUNTDOWN TIMERS ── */
  const countdowns = [
    { id: 'cd1', hours: 2, mins: 45, secs: 0 },
    { id: 'cd2', hours: 5, mins: 10, secs: 0 },
    { id: 'cd3', hours: 8, mins: 0,  secs: 0 },
  ];

  countdowns.forEach(({ id, hours, mins, secs }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const totalSecs = hours * 3600 + mins * 60 + secs;
    A24.startCountdown(el, totalSecs, () => {
      el.textContent = 'STARTING NOW';
      el.style.color = 'var(--live)';
      A24.showToast('A tournament is starting now! 🔥', 'info');
    });
  });

  /* ── LIVE VIEWER COUNT SIMULATION ── */
  const viewerEls = document.querySelectorAll('.lc-viewers');
  viewerEls.forEach(el => {
    const baseMatch = el.textContent.match(/[\d,]+/);
    if (!baseMatch) return;
    let base = parseInt(baseMatch[0].replace(',', ''));

    setInterval(() => {
      const delta = Math.floor(Math.random() * 20) - 8; /* ±8 viewers */
      base = Math.max(10, base + delta);
      el.textContent = `👁 ${base.toLocaleString('en-IN')} watching`;
    }, 4000);
  });

  /* ── LIVE LEADERBOARD PULSE ── */
  /* Simulate a score update every 15 seconds for UX effect */
  const miniLbRows = document.querySelectorAll('.mlb-pts');
  if (miniLbRows.length) {
    setInterval(() => {
      const randomRow = miniLbRows[Math.floor(Math.random() * miniLbRows.length)];
      if (!randomRow) return;
      randomRow.style.color = 'var(--live)';
      randomRow.style.transition = 'color .3s';
      setTimeout(() => {
        randomRow.style.color = '';
      }, 1200);
    }, 15000);
  }

  /* ── UPCOMING MATCHES — EXPAND ON CLICK ── */
  const upcomingItems = document.querySelectorAll('.upcoming-item');
  upcomingItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const detailLink = item.querySelector('a');
      if (detailLink) window.location.href = detailLink.href;
    });
  });

  /* ── COMPLETED CARDS HOVER ── */
  const completedCards = document.querySelectorAll('.completed-card');
  completedCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--border-bright)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });

  /* ── AUTO REFRESH INDICATOR ── */
  const liveHeader = document.querySelector('.live-header-content');
  if (liveHeader) {
    const refreshNote = document.createElement('p');
    refreshNote.style.cssText = 'font-size:12px;color:var(--text-muted);margin-top:6px;';
    refreshNote.textContent = '🔄 Live scores update every 30 seconds';
    liveHeader.appendChild(refreshNote);

    let secs = 30;
    setInterval(() => {
      secs--;
      if (secs <= 0) {
        refreshNote.textContent = '🔄 Refreshing...';
        setTimeout(() => {
          secs = 30;
          refreshNote.textContent = '🔄 Live scores update every 30 seconds';
        }, 800);
      } else {
        refreshNote.textContent = `🔄 Next update in ${secs}s`;
      }
    }, 1000);
  }

})();
