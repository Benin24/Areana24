/* ============================================================
   ARENA 24 — TOURNAMENT-DETAIL.JS
   Tabs, join modal, UPI form validation, share buttons
   ============================================================ */

(function TournamentDetail() {

  /* ── TABS ── */
  const tabs     = document.querySelectorAll('.t-tab');
  const contents = document.querySelectorAll('.t-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById('tab-' + target);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  /* ── JOIN MODAL ── */
  const joinBtn    = document.getElementById('joinBtn');
  const joinModal  = document.getElementById('joinModal');
  const closeModal = document.getElementById('closeModal');

  function openModal() {
    /* Check if user is logged in (simulated — real check via backend) */
    const isLoggedIn = sessionStorage.getItem('a24_user') || false;
    if (!isLoggedIn) {
      /* In production this would check JWT / session */
      /* For demo — allow opening. Real app redirects to login */
    }
    if (joinModal) {
      joinModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModalFn() {
    if (joinModal) {
      joinModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (joinBtn) joinBtn.addEventListener('click', openModal);
  if (closeModal) closeModal.addEventListener('click', closeModalFn);

  /* Close on backdrop click */
  if (joinModal) {
    joinModal.addEventListener('click', e => {
      if (e.target === joinModal) closeModalFn();
    });
  }

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModalFn();
  });

  /* ── UPI FORM SUBMISSION ── */
  const confirmJoinBtn = document.getElementById('confirmJoin');
  const upiTxnId       = document.getElementById('upiTxnId');
  const ignInput       = document.getElementById('ignInput');

  if (confirmJoinBtn) {
    confirmJoinBtn.addEventListener('click', () => {
      const txn = (upiTxnId?.value || '').trim();
      const ign = (ignInput?.value  || '').trim();
      let valid = true;

      /* Clear previous errors */
      [upiTxnId, ignInput].forEach(el => {
        if (el) el.style.borderColor = '';
      });

      /* Validate Transaction ID */
      if (!txn || txn.length < 8) {
        if (upiTxnId) upiTxnId.style.borderColor = '#ff0040';
        A24.showToast('Please enter a valid UPI Transaction ID (min 8 chars)', 'error');
        valid = false;
      }

      /* Validate IGN */
      if (!ign || ign.length < 3) {
        if (ignInput) ignInput.style.borderColor = '#ff0040';
        A24.showToast('Please enter your in-game name', 'error');
        valid = false;
      }

      if (!valid) return;

      /* Rate limit — max 3 join attempts per minute */
      if (!A24.checkRateLimit('join_attempt', 3, 60000)) {
        A24.showToast('Too many attempts. Please wait a minute.', 'error');
        return;
      }

      /* Simulate loading */
      confirmJoinBtn.textContent = '⏳ Verifying...';
      confirmJoinBtn.disabled = true;

      setTimeout(() => {
        /* In production: POST /api/tournaments/:id/join { txnId, ign } */
        confirmJoinBtn.textContent = '✅ Registration Submitted!';
        confirmJoinBtn.style.background = 'linear-gradient(135deg, #00c9a7, #00e87a)';

        A24.showToast('Registration submitted! Admin will verify your payment within 30 mins.', 'success');

        setTimeout(() => {
          closeModalFn();
          confirmJoinBtn.textContent = 'Confirm Registration';
          confirmJoinBtn.disabled = false;
          confirmJoinBtn.style.background = '';
          if (upiTxnId) upiTxnId.value = '';
          if (ignInput)  ignInput.value  = '';
        }, 2500);
      }, 1500);
    });
  }

  /* ── SHARE BUTTONS ── */
  const shareWhatsApp = document.querySelector('.share-btn:nth-child(1)');
  const shareTelegram = document.querySelector('.share-btn:nth-child(2)');
  const copyLinkBtn   = document.getElementById('copyLink');
  const pageUrl       = encodeURIComponent(window.location.href);
  const shareText     = encodeURIComponent('Join this tournament on Arena 24! 🏆');

  if (shareWhatsApp) {
    shareWhatsApp.addEventListener('click', () => {
      window.open(`https://wa.me/?text=${shareText}%20${pageUrl}`, '_blank', 'noopener');
    });
  }

  if (shareTelegram) {
    shareTelegram.addEventListener('click', () => {
      window.open(`https://t.me/share/url?url=${pageUrl}&text=${shareText}`, '_blank', 'noopener');
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      A24.copyToClipboard(window.location.href);
    });
  }

  /* ── PROGRESS BAR ANIMATION ── */
  const fills = document.querySelectorAll('.t-progress-fill, .slots-fill');
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.style.width;
        el.style.width = '0%';
        requestAnimationFrame(() => {
          el.style.transition = 'width 1s ease';
          el.style.width = target;
        });
        barObs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  fills.forEach(f => barObs.observe(f));

})();
