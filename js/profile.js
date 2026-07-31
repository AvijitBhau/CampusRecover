// =====================================================
// CampusRecover — Profile Page
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireAuth();
  if (!user) return;

  Theme.init();
  Sidebar.init();
  updateUserUI(user);
  setActiveNav('profile');

  // ── Populate profile display ──
  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  };

  setField('profile-avatar',    user.avatar || Auth.getInitials(user.name));
  // Hero
  setField('profile-name',     user.name);
  setField('profile-enroll',   user.enrollment);
  setField('profile-dept',     user.department);
  // Info grid
  setField('profile-name-info', user.name);
  setField('profile-enroll-2', user.enrollment);
  setField('profile-dept-2',   user.department);
  setField('profile-year',     user.year || '—');
  setField('profile-phone',    user.phone);
  setField('profile-email',    user.email);

  // ── Stats ──
  const lostCount   = LostItems.getByUser(user.uid).length;
  const foundCount  = FoundItems.getByUser(user.uid).length;
  const returnCount = [
    ...LostItems.getByUser(user.uid),
    ...FoundItems.getByUser(user.uid)
  ].filter(i => i.status === 'returned').length;

  animateCounter(document.getElementById('stat-lost-count'),   lostCount,   900);
  animateCounter(document.getElementById('stat-found-count'),  foundCount,  900);
  animateCounter(document.getElementById('stat-return-count'), returnCount, 900);

  // ── Edit Profile ──
  const editBtn   = document.getElementById('edit-profile-btn');
  const saveBtn   = document.getElementById('save-profile-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');

  const editableFields = ['profile-name', 'profile-phone', 'profile-dept', 'profile-year'];
  let originalValues = {};

  editBtn?.addEventListener('click', () => {
    editableFields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      originalValues[id] = el.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = el.textContent;
      input.className = 'form-input';
      input.id = `input-${id}`;
      input.style.cssText = 'margin:0;font-size:inherit;padding:6px 10px;';
      el.parentNode.replaceChild(input, el);
    });

    editBtn.style.display  = 'none';
    saveBtn.style.display  = 'inline-flex';
    cancelBtn.style.display = 'inline-flex';
  });

  cancelBtn?.addEventListener('click', () => {
    editableFields.forEach(id => {
      const input = document.getElementById(`input-${id}`);
      if (!input) return;
      const span = document.createElement('span');
      span.id = id;
      span.textContent = originalValues[id];
      input.parentNode.replaceChild(span, input);
    });
    editBtn.style.display   = 'inline-flex';
    saveBtn.style.display   = 'none';
    cancelBtn.style.display = 'none';
  });

  saveBtn?.addEventListener('click', () => {
    const updates = {};
    editableFields.forEach(id => {
      const input = document.getElementById(`input-${id}`);
      if (!input) return;
      const val = input.value.trim();
      const span = document.createElement('span');
      span.id = id;
      span.textContent = val || originalValues[id];
      input.parentNode.replaceChild(span, input);
      updates[id.replace('profile-', '')] = val;
    });

    // Update auth session
    const updated = Auth.updateProfile({
      name:       updates['name'],
      phone:      updates['phone'],
      department: updates['dept'],
      year:       updates['year'],
      avatar:     Auth.getInitials(updates['name'] || user.name)
    });

    updateUserUI(updated || user);

    editBtn.style.display   = 'inline-flex';
    saveBtn.style.display   = 'none';
    cancelBtn.style.display = 'none';

    Toast.success('Profile Updated!', 'Your profile information has been saved.');
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm({ title:'Log Out', message:'Log out?', icon:'👋', confirmText:'Log Out', dangerConfirm:false })
      .then(ok => { if (ok) Auth.logout(); });
  });

  Loader.hide();
});
