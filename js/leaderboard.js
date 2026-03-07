/* ============================================================
   ARENA 24 — LEADERBOARD.JS
   Game tabs, period filter, live search, row highlighting
   ============================================================ */

(function LeaderboardPage() {

  /* ── GAME TABS ── */
  const gameTabs = document.querySelectorAll('.lb-tab');
  gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gameTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const game = tab.dataset.game;
      filterRows(game, getSearchValue(), getPeriod());
    });
  });

  /* ── PERIOD TABS ── */
  const periodBtns = document.querySelectorAll('.period-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterRows(getActiveGame(), getSearchValue(), btn.textContent.trim());
    });
  });

  /* ── LIVE SEARCH ── */
  const searchInput = document.getElementById('lbSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', A24.debounce(() => {
      filterRows(getActiveGame(), getSearchValue(), getPeriod());
    }, 200));
  }

  /* ── HELPERS ── */
  function getActiveGame() {
    const active = document.querySelector('.lb-tab.active');
    return active ? active.dataset.game : 'all';
  }
  function getSearchValue() {
    return searchInput ? searchInput.value.toLowerCase().trim() : '';
  }
  function getPeriod() {
    const active = document.querySelector('.period-btn.active');
    return active ? active.textContent.trim() : 'This Week';
  }

  /* ── FILTER ROWS ── */
  function filterRows(game, query) {
    const rows = document.querySelectorAll('.lbft-row');
    rows.forEach(row => {
      const rowGame = row.querySelector('.game-tag-sm')?.textContent.toLowerCase() || '';
      const rowText = row.textContent.toLowerCase();
      const matchGame  = game === 'all' || rowGame.includes(game.toLowerCase());
      const matchQuery = !query || rowText.includes(query);
      row.style.display = (matchGame && matchQuery) ? '' : 'none';
    });

    /* Re-number visible ranks */
    const visible = document.querySelectorAll('.lbft-row:not([style*="none"])');
    visible.forEach((row, i) => {
      const rankEl = row.querySelector('.lbft-ranknum');
      if (rankEl) rankEl.textContent = i + 4; /* starts from 4 after podium */
    });
  }

  /* ── ROW HOVER HIGHLIGHT ── */
  const rows = document.querySelectorAll('.lbft-row');
  rows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const name = row.querySelector('.lbft-pname')?.textContent;
      if (name) A24.showToast(`Viewing profile: ${name}`, 'info');
      /* In production: navigate to /profile/:username */
    });
  });

  /* ── LAST UPDATED LIVE TICK ── */
  const updatedEl = document.querySelector('.lb-updated');
  if (updatedEl) {
    let mins = 2;
    setInterval(() => {
      mins++;
      updatedEl.textContent = `Last updated: ${mins} min${mins !== 1 ? 's' : ''} ago`;
    }, 60000);
  }

  /* ── PODIUM ANIMATION ── */
  const podiumSlots = document.querySelectorAll('.podium-slot');
  const podiumObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        podiumSlots.forEach((slot, i) => {
          slot.style.opacity = '0';
          slot.style.transform = 'translateY(30px)';
          slot.style.transition = `opacity .5s ease ${i * 0.15}s, transform .5s ease ${i * 0.15}s`;
          requestAnimationFrame(() => {
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
          });
        });
        podiumObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const podium = document.querySelector('.podium-wrap');
  if (podium) podiumObs.observe(podium);

  /* ── PAGINATION ── */
  const pageBtns = document.querySelectorAll('.page-btn');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('page-next')) return;
      pageBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

})();
