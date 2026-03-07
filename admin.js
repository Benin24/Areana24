/* ============================================================
   ARENA 24 — ADMIN.JS
   Dashboard, tables, modals, approve/reject, confirm actions
   ============================================================ */

(function AdminPanel() {

  /* ── DATE DISPLAY ── */
  const adminDate = document.getElementById('adminDate');
  if (adminDate) {
    const now = new Date();
    adminDate.textContent = now.toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ── SIDEBAR ACTIVE ── */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sn-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href === currentPage) item.classList.add('active');
  });

  /* ── PAYMENT APPROVE / REJECT ── */
  document.querySelectorAll('.tbl-btn-success').forEach(btn => {
    btn.addEventListener('click', function () {
      if (!confirmAction('Approve this payment and register player?')) return;
      const row = this.closest('tr');
      if (!row) return;

      this.textContent = '⏳';
      this.disabled = true;

      setTimeout(() => {
        /* Simulate — replace with PATCH /api/payments/:id/approve */
        row.style.opacity = '0.5';
        row.style.transition = 'opacity .3s';
        const statusCell = row.cells[row.cells.length - 1];
        if (statusCell) statusCell.innerHTML = '<span class="verified-badge">✅ Approved</span>';
        A24.showToast('Payment approved! Player registered successfully.', 'success');

        /* Update pending count */
        updatePendingCount();
      }, 900);
    });
  });

  document.querySelectorAll('.tbl-btn-danger').forEach(btn => {
    /* Only reject buttons in payment context */
    if (btn.textContent.trim() === '❌ Reject') {
      btn.addEventListener('click', function () {
        if (!confirmAction('Reject this payment? The player will be notified.')) return;
        const row = this.closest('tr');
        if (!row) return;

        setTimeout(() => {
          /* Simulate — replace with PATCH /api/payments/:id/reject */
          row.style.opacity = '0.4';
          const statusCell = row.cells[row.cells.length - 1];
          if (statusCell) statusCell.innerHTML = '<span class="unverified-badge">❌ Rejected</span>';
          A24.showToast('Payment rejected. Player has been notified.', 'error');
          updatePendingCount();
        }, 600);
      });
    }
  });

  /* ── END / CANCEL TOURNAMENT CONFIRM ── */
  document.querySelectorAll('.tbl-btn-danger').forEach(btn => {
    if (btn.textContent.trim() === 'End' || btn.textContent.trim() === 'Cancel') {
      btn.addEventListener('click', function () {
        const name = this.closest('tr')?.querySelector('.at-name')?.textContent;
        const action = this.textContent.trim().toLowerCase();
        if (!confirmAction(`Are you sure you want to ${action} "${name}"? This cannot be undone.`)) return;
        this.textContent = '⏳';
        this.disabled = true;
        setTimeout(() => {
          A24.showToast(`Tournament "${name}" has been ${action}ed.`, 'success');
          const row = this.closest('tr');
          if (row) row.style.opacity = '0.5';
        }, 800);
      });
    }
  });

  /* ── EDIT MODAL (admin-tournaments.html) ── */
  const editTModal    = document.getElementById('editTModal');
  const closeEditTBtn = document.getElementById('closeEditTModal');
  const cancelEditT   = document.getElementById('cancelEditT');

  function closeEditModal() {
    if (editTModal) editTModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeEditTBtn) closeEditTBtn.addEventListener('click', closeEditModal);
  if (cancelEditT)   cancelEditT.addEventListener('click',   closeEditModal);
  if (editTModal) {
    editTModal.addEventListener('click', e => {
      if (e.target === editTModal) closeEditModal();
    });
  }

  /* ── PAYOUT MODAL (admin-payments.html) ── */
  const payoutModal   = document.getElementById('payoutModal');
  const newPayoutBtn  = document.getElementById('newPayoutBtn');
  const closePayoutBtn = document.getElementById('closePayoutModal');

  if (newPayoutBtn && payoutModal) {
    newPayoutBtn.addEventListener('click', () => {
      payoutModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closePayoutBtn) {
    closePayoutBtn.addEventListener('click', () => {
      payoutModal?.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }
  if (payoutModal) {
    payoutModal.addEventListener('click', e => {
      if (e.target === payoutModal) {
        payoutModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  /* Mark prize as paid */
  document.querySelectorAll('.tbl-btn-success').forEach(btn => {
    if (btn.textContent.trim() === 'Mark Paid') {
      btn.addEventListener('click', function () {
        const row = this.closest('tr');
        if (!row) return;
        const winner = row.cells[2]?.textContent.trim();
        const amount = row.cells[4]?.textContent.trim();
        if (!confirmAction(`Confirm payout of ${amount} to ${winner}?`)) return;

        this.textContent = '⏳';
        this.disabled = true;
        setTimeout(() => {
          row.cells[6].innerHTML = '<span class="received-badge">✅ Paid</span>';
          row.cells[7].innerHTML = '—';
          A24.showToast(`${amount} paid to ${winner} via UPI!`, 'success');
        }, 1000);
      });
    }
  });

  /* ── TABS (admin-payments.html) ── */
  const tTabs     = document.querySelectorAll('.t-tab');
  const tContents = document.querySelectorAll('.t-tab-content');
  tTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tTabs.forEach(t => t.classList.remove('active'));
      tContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const content = document.getElementById('tab-' + tab.dataset.tab);
      if (content) content.classList.add('active');
    });
  });

  /* ── ADMIN SEARCH TABLES ── */
  const adminTSearch = document.getElementById('adminTSearch');
  if (adminTSearch) {
    adminTSearch.addEventListener('input', A24.debounce(() => {
      const q = adminTSearch.value.toLowerCase().trim();
      document.querySelectorAll('#adminTBody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    }, 200));
  }

  const userSearch = document.getElementById('userSearch');
  if (userSearch) {
    userSearch.addEventListener('input', A24.debounce(() => {
      const q = userSearch.value.toLowerCase().trim();
      document.querySelectorAll('.admin-table tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    }, 200));
  }

  /* ── STAT CARD COUNTERS ── */
  const ascVals = document.querySelectorAll('.asc-val');
  const ascObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      ascObs.disconnect();
      ascVals.forEach(el => {
        const raw = el.textContent.replace(/[₹,]/g, '').trim();
        const num = parseInt(raw);
        if (isNaN(num) || num > 10000000) return;
        const isRupee = el.textContent.includes('₹');
        let cur = 0;
        const step = Math.ceil(num / 50);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, num);
          el.textContent = (isRupee ? '₹' : '') + cur.toLocaleString('en-IN');
          if (cur >= num) {
            el.textContent = el.dataset.original || el.textContent;
            clearInterval(timer);
          }
        }, 20);
        el.dataset.original = el.textContent;
      });
    });
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.admin-stats-row');
  if (statsRow) ascObs.observe(statsRow);

  /* ── HELPER FUNCTIONS ── */
  function confirmAction(message) {
    return window.confirm(message);
  }

  function updatePendingCount() {
    const pending = document.querySelectorAll('.tbl-btn-success:not(:disabled)').length;
    const badge = document.querySelector('.admin-section-header .notif-count');
    if (badge) badge.textContent = pending + ' pending';
  }

})();

/* ── GLOBAL OPENEDIMODAL for inline onclick ── */
function openEditModal(name) {
  const modal = document.getElementById('editTModal');
  const nameInput = document.getElementById('editTName');
  if (modal)     modal.classList.remove('hidden');
  if (nameInput) nameInput.value = name;
  document.body.style.overflow = 'hidden';
}
function confirmEnd(name) {
  if (window.confirm(`End tournament "${name}"? This action cannot be undone.`)) {
    A24.showToast(`Tournament "${name}" ended.`, 'success');
  }
}
