/* ============================================================
   ARENA 24 — PROFILE.JS
   Edit form toggle, achievement tooltips, game stat bars
   ============================================================ */

(function ProfilePage() {

  /* ── EDIT PROFILE TOGGLE ── */
  const editProfileBtn = document.getElementById('editProfileBtn');
  const cancelEditBtn  = document.getElementById('cancelEditBtn');
  const editForm       = document.getElementById('editForm');
  const aboutCard      = document.getElementById('aboutCard');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      if (editForm)   editForm.style.display   = 'block';
      if (aboutCard)  aboutCard.style.display  = 'none';
      editProfileBtn.textContent = 'Editing...';
      editProfileBtn.disabled = true;
      editForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      if (editForm)  editForm.style.display   = 'none';
      if (aboutCard) aboutCard.style.display  = '';
      if (editProfileBtn) {
        editProfileBtn.textContent = 'Edit Profile';
        editProfileBtn.disabled = false;
      }
    });
  }

  /* ── PROFILE EDIT FORM SAVE ── */
  const profileEditForm = document.getElementById('profileEditForm');
  if (profileEditForm) {
    profileEditForm.addEventListener('submit', e => {
      e.preventDefault();
      const saveBtn = profileEditForm.querySelector('button[type="submit"]');
      if (saveBtn) {
        saveBtn.textContent = '⏳ Saving...';
        saveBtn.disabled = true;
      }
      /* Simulate save — replace with PUT /api/user/profile */
      setTimeout(() => {
        if (saveBtn) { saveBtn.textContent = '✅ Saved!'; }
        A24.showToast('Profile updated successfully!', 'success');
        setTimeout(() => {
          if (editForm)   editForm.style.display  = 'none';
          if (aboutCard)  aboutCard.style.display = '';
          if (editProfileBtn) {
            editProfileBtn.textContent = 'Edit Profile';
            editProfileBtn.disabled = false;
          }
          if (saveBtn) { saveBtn.textContent = 'Save Changes'; saveBtn.disabled = false; }
        }, 1200);
      }, 1200);
    });
  }

  /* ── GAME STAT BARS ANIMATE ── */
  const gsBarObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.gs-fill').forEach(fill => {
        const target = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.transition = 'width 1s ease';
          fill.style.width = target;
        }, 100);
      });
      gsBarObs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.gs-item').forEach(item => gsBarObs.observe(item));

  /* ── ACHIEVEMENT TOOLTIPS ── */
  const achievements = {
    'First Blood':    'Win your first tournament',
    'On Fire':        'Win 5 tournaments',
    'King of Arena':  'Reach Rank #1 on global leaderboard',
    'Prize Hunter':   'Earn over ₹10,000 in prizes',
    'Unstoppable':    'Win 10 tournaments',
    'Big Earner':     'Earn over ₹50,000 in prizes',
  };

  document.querySelectorAll('.ach-item').forEach(item => {
    const name = item.querySelector('.ach-name')?.textContent;
    if (!name) return;

    item.style.position = 'relative';
    item.addEventListener('mouseenter', () => {
      const existing = item.querySelector('.ach-tooltip');
      if (existing) return;
      const tooltip = document.createElement('div');
      tooltip.className = 'ach-tooltip';
      tooltip.textContent = achievements[name] || name;
      tooltip.style.cssText = `
        position:absolute; bottom:calc(100% + 8px); left:50%;
        transform:translateX(-50%);
        background:#1a2235; border:1px solid #2a3a52;
        border-radius:6px; padding:6px 10px;
        font-size:11px; color:#f0f4ff;
        white-space:nowrap; pointer-events:none;
        z-index:100; box-shadow:0 4px 16px rgba(0,0,0,0.4);
        font-family:'Rajdhani',sans-serif; font-weight:500;
      `;
      item.appendChild(tooltip);
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.ach-tooltip')?.remove();
    });
  });

  /* ── PASSWORD CHANGE FORM ── */
  const pwChangeForm = document.getElementById('pwChangeForm');
  if (pwChangeForm) {
    pwChangeForm.addEventListener('submit', e => {
      e.preventDefault();
      const inputs  = pwChangeForm.querySelectorAll('input[type="password"]');
      const current = inputs[0]?.value || '';
      const newPw   = inputs[1]?.value || '';
      const confirm = inputs[2]?.value || '';

      if (!current) { A24.showToast('Enter your current password', 'error'); return; }
      if (newPw.length < 8) { A24.showToast('New password must be at least 8 characters', 'error'); return; }
      if (newPw !== confirm) { A24.showToast('Passwords do not match', 'error'); return; }

      const btn = pwChangeForm.querySelector('button');
      if (btn) { btn.textContent = '⏳ Updating...'; btn.disabled = true; }

      /* Simulate — replace with PUT /api/user/password */
      setTimeout(() => {
        A24.showToast('Password updated successfully!', 'success');
        pwChangeForm.reset();
        if (btn) { btn.textContent = 'Update Password'; btn.disabled = false; }
      }, 1200);
    });
  }

  /* ── AVATAR EDIT ── */
  const editAvatarBtn = document.getElementById('editAvatarBtn');
  if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', () => {
      A24.showToast('Avatar upload coming soon! 📸', 'info');
    });
  }

})();
