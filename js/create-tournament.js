/* ============================================================
   ARENA 24 — CREATE-TOURNAMENT.JS
   Live card preview, dynamic prize tiers, form validation
   ============================================================ */

(function CreateTournament() {

  /* ── LIVE PREVIEW ELEMENTS ── */
  const previewBanner = document.getElementById('previewBanner');
  const previewGame   = document.getElementById('previewGame');
  const previewTitle  = document.getElementById('previewTitle');
  const previewType   = document.getElementById('previewType');
  const previewFormat = document.getElementById('previewFormat');
  const previewPrize  = document.getElementById('previewPrize');
  const previewFee    = document.getElementById('previewFee');

  /* ── GAME COLOR MAP ── */
  const gameBanners = {
    'BGMI':        'linear-gradient(135deg, #ff6b00, #ff0040)',
    'Free Fire':   'linear-gradient(135deg, #7b2ff7, #ff6b00)',
    'COD Mobile':  'linear-gradient(135deg, #1a1a2e, #16213e)',
    'Valorant':    'linear-gradient(135deg, #00c9a7, #0066ff)',
    'Chess':       'linear-gradient(135deg, #2d6a4f, #52b788)',
    'Ludo King':   'linear-gradient(135deg, #f72585, #7209b7)',
    'FIFA Mobile': 'linear-gradient(135deg, #006400, #00a86b)',
    'Tekken':      'linear-gradient(135deg, #b5179e, #7209b7)',
    'PUBG PC':     'linear-gradient(135deg, #c09000, #7b5800)',
    'default':     'linear-gradient(135deg, #ff6b00, #ff0040)',
  };

  /* ── WIRE PREVIEW UPDATES ── */
  function updatePreview() {
    const name    = document.getElementById('ct-name')?.value   || 'Tournament Name';
    const game    = document.getElementById('ct-game')?.value   || '';
    const type    = document.getElementById('ct-type')?.value   || 'Solo';
    const format  = document.getElementById('ct-format')?.value || 'Leaderboard';
    const prize   = document.getElementById('ct-prize')?.value  || '0';
    const isPaid  = document.getElementById('entryPaid')?.checked;
    const fee     = document.getElementById('ct-fee')?.value    || '0';
    const maxP    = document.getElementById('ct-maxplayers')?.value || '0';

    if (previewTitle)  previewTitle.textContent  = name || 'Tournament Name';
    if (previewGame)   previewGame.textContent   = game || 'Game';
    if (previewType)   previewType.textContent   = '👤 ' + type;
    if (previewFormat) previewFormat.textContent = '🏆 ' + format;
    if (previewPrize)  previewPrize.textContent  = A24.formatINR(parseInt(prize) || 0);
    if (previewFee)    {
      previewFee.textContent  = isPaid ? A24.formatINR(parseInt(fee) || 0) : 'FREE';
      previewFee.className    = 'entry-amount ' + (isPaid ? 'entry-paid' : 'entry-free');
    }
    if (previewBanner && game) {
      previewBanner.style.background = gameBanners[game] || gameBanners['default'];
    }
    /* Update progress */
    const spotsEl = document.querySelector('.preview-card .t-spots');
    if (spotsEl) spotsEl.textContent = `0/${maxP || 0} Players`;
  }

  /* Bind to all form inputs */
  document.querySelectorAll('#createTForm input, #createTForm select, #createTForm textarea').forEach(el => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });

  updatePreview(); /* Initial render */

  /* ── TEAM SIZE ROW TOGGLE ── */
  const typeSelect    = document.getElementById('ct-type');
  const teamSizeRow   = document.getElementById('teamSizeRow');
  if (typeSelect && teamSizeRow) {
    typeSelect.addEventListener('change', () => {
      teamSizeRow.style.display = typeSelect.value === 'Team' ? 'grid' : 'none';
    });
  }

  /* ── ENTRY FEE ROW TOGGLE ── */
  const feeRow = document.getElementById('feeRow');
  document.querySelectorAll('input[name="entryType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (feeRow) feeRow.style.display = radio.value === 'paid' ? 'grid' : 'none';
      updatePreview();
    });
  });

  /* ── DYNAMIC PRIZE TIERS ── */
  let tierCount = 3;
  const prizeRows   = document.getElementById('prizeDistRows');
  const addPrizeTier = document.getElementById('addPrizeTier');
  const ordinals = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th'];
  const trophies = ['🥇','🥈','🥉','4th','5th','6th','7th','8th'];

  if (addPrizeTier && prizeRows) {
    addPrizeTier.addEventListener('click', () => {
      if (tierCount >= 8) {
        A24.showToast('Maximum 8 prize tiers allowed.', 'error');
        return;
      }
      tierCount++;
      const row = document.createElement('div');
      row.className = 'pd-row';
      const icon = trophies[tierCount - 1] || `${ordinals[tierCount-1]}`;
      row.innerHTML = `
        <span>${icon} ${ordinals[tierCount - 1]} Place</span>
        <div class="input-wrap sm"><input type="number" placeholder="₹" class="upi-input" /></div>
        <div class="input-wrap sm"><input type="number" placeholder="%" class="upi-input" /></div>
        <button type="button" style="background:none;border:none;color:var(--accent-2);cursor:pointer;font-size:16px;padding:0 4px;" onclick="this.closest('.pd-row').remove()">✕</button>
      `;
      prizeRows.appendChild(row);
    });
  }

  /* ── FORM VALIDATION & SUBMIT ── */
  const createTForm = document.getElementById('createTForm');
  if (createTForm) {
    createTForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('ct-name')?.value.trim();
      const game    = document.getElementById('ct-game')?.value;
      const maxP    = parseInt(document.getElementById('ct-maxplayers')?.value);
      const prize   = parseInt(document.getElementById('ct-prize')?.value);
      const regOpen = document.getElementById('ct-reg-open')?.value;
      const start   = document.getElementById('ct-start')?.value;

      let valid = true;

      if (!name || name.length < 5) {
        A24.showToast('Tournament name must be at least 5 characters', 'error');
        document.getElementById('ct-name')?.focus();
        valid = false;
      }
      if (!game) {
        A24.showToast('Please select a game', 'error');
        valid = false;
      }
      if (!maxP || maxP < 2) {
        A24.showToast('Max players must be at least 2', 'error');
        valid = false;
      }
      if (!prize || prize < 0) {
        A24.showToast('Please enter a valid prize pool', 'error');
        valid = false;
      }
      if (!regOpen) {
        A24.showToast('Please set registration open time', 'error');
        valid = false;
      }
      if (!start) {
        A24.showToast('Please set tournament start time', 'error');
        valid = false;
      }
      if (regOpen && start && new Date(start) <= new Date(regOpen)) {
        A24.showToast('Tournament start must be after registration opens', 'error');
        valid = false;
      }

      if (!valid) return;

      /* Check entry fee if paid */
      if (document.getElementById('entryPaid')?.checked) {
        const fee = parseInt(document.getElementById('ct-fee')?.value);
        if (!fee || fee < 1) {
          A24.showToast('Please enter a valid entry fee', 'error');
          return;
        }
        const upiId = document.getElementById('ct-upi')?.value.trim();
        if (!upiId || !upiId.includes('@')) {
          A24.showToast('Please enter a valid UPI ID', 'error');
          return;
        }
      }

      const publishBtn = document.getElementById('publishTBtn');
      if (publishBtn) {
        publishBtn.textContent = '⏳ Publishing...';
        publishBtn.disabled = true;
      }

      /* Simulate API — replace with POST /api/tournaments */
      setTimeout(() => {
        A24.showToast('Tournament published successfully! 🚀', 'success');
        setTimeout(() => {
          window.location.href = 'admin-tournaments.html';
        }, 1200);
      }, 1500);
    });
  }

  /* ── SAVE DRAFT ── */
  const saveDraftBtn = document.getElementById('saveDraft');
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      const name = document.getElementById('ct-name')?.value.trim();
      if (!name) { A24.showToast('Add a tournament name before saving draft', 'error'); return; }
      /* In production: POST /api/tournaments/draft */
      A24.showToast('Draft saved successfully! 💾', 'success');
    });
  }

})();

/* For inline onclick in the HTML */
function toggleTeamSize() {
  const v = document.getElementById('ct-type')?.value;
  const row = document.getElementById('teamSizeRow');
  if (row) row.style.display = v === 'Team' ? 'grid' : 'none';
}
function toggleFeeField() {
  const isPaid = document.getElementById('entryPaid')?.checked;
  const row = document.getElementById('feeRow');
  if (row) row.style.display = isPaid ? 'grid' : 'none';
}
