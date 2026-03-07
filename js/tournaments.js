/* ============================================================
   ARENA 24 — TOURNAMENTS.JS
   Live filter, search, grid/list toggle, pagination
   ============================================================ */

(function TournamentsPage() {

  /* ── ELEMENTS ── */
  const grid          = document.getElementById('tournamentsGrid');
  const searchInput   = document.getElementById('searchInput');
  const filterGame    = document.getElementById('filterGame');
  const filterFormat  = document.getElementById('filterFormat');
  const filterType    = document.getElementById('filterType');
  const filterFee     = document.getElementById('filterFee');
  const filterStatus  = document.getElementById('filterStatus');
  const resultsCount  = document.getElementById('resultsCount');
  const gridViewBtn   = document.getElementById('gridView');
  const listViewBtn   = document.getElementById('listView');

  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.t-card'));

  /* ── FILTER ENGINE ── */
  function applyFilters() {
    const query  = (searchInput?.value  || '').toLowerCase().trim();
    const game   = (filterGame?.value   || '').toLowerCase();
    const format = (filterFormat?.value || '').toLowerCase();
    const type   = (filterType?.value   || '').toLowerCase();
    const fee    = (filterFee?.value    || '').toLowerCase();
    const status = (filterStatus?.value || '').toLowerCase();

    let visible = 0;

    cards.forEach(card => {
      const cardGame   = (card.dataset.game   || '').toLowerCase();
      const cardFormat = (card.dataset.format || '').toLowerCase();
      const cardType   = (card.dataset.type   || '').toLowerCase();
      const cardFee    = (card.dataset.fee    || '').toLowerCase();
      const cardStatus = (card.dataset.status || '').toLowerCase();
      const cardText   = card.textContent.toLowerCase();

      const matchSearch = !query  || cardText.includes(query);
      const matchGame   = !game   || cardGame.includes(game);
      const matchFormat = !format || cardFormat.includes(format);
      const matchType   = !type   || cardType.includes(type);
      const matchFee    = !fee    || cardFee === fee;
      const matchStatus = !status || cardStatus.includes(status);

      const show = matchSearch && matchGame && matchFormat && matchType && matchFee && matchStatus;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visible} tournament${visible !== 1 ? 's' : ''}`;
    }

    /* Show empty state */
    let empty = grid.querySelector('.empty-state');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
            <div style="font-size:48px;margin-bottom:16px;">🔍</div>
            <h3 style="font-family:'Orbitron',monospace;font-size:18px;color:#f0f4ff;margin-bottom:8px;">No tournaments found</h3>
            <p style="color:#8899b0;font-size:14px;">Try adjusting your filters or search term.</p>
          </div>`;
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  }

  /* Debounced search */
  if (searchInput) {
    searchInput.addEventListener('input', A24.debounce(applyFilters, 250));
  }

  /* Instant filter dropdowns */
  [filterGame, filterFormat, filterType, filterFee, filterStatus].forEach(sel => {
    if (sel) sel.addEventListener('change', applyFilters);
  });

  /* ── VIEW TOGGLE ── */
  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      grid.classList.remove('tournament-list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      localStorage.setItem('a24_view', 'grid');
    });

    listViewBtn.addEventListener('click', () => {
      grid.classList.add('tournament-list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      localStorage.setItem('a24_view', 'list');
    });

    /* Restore preference */
    if (localStorage.getItem('a24_view') === 'list') {
      listViewBtn.click();
    }
  }

  /* ── PAGINATION ── */
  const pageBtns = document.querySelectorAll('.page-btn');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('page-next')) return;
      pageBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      /* Scroll to top of grid */
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── CARD HOVER SOUND (subtle) ── */
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = '';
    });
  });

  /* Initial run */
  applyFilters();

})();
