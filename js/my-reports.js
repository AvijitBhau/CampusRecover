// =====================================================
// CampusRecover — My Reports Page
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireAuth();
  if (!user) return;

  Theme.init();
  Sidebar.init();
  updateUserUI(user);
  setActiveNav('my-reports');

  const lostBody  = document.getElementById('lost-table-body');
  const foundBody = document.getElementById('found-table-body');
  const lostTab   = document.getElementById('tab-lost');
  const foundTab  = document.getElementById('tab-found');
  const lostPanel  = document.getElementById('panel-lost');
  const foundPanel = document.getElementById('panel-found');
  const lostCount  = document.getElementById('lost-tab-count');
  const foundCount = document.getElementById('found-tab-count');

  function renderLostReports() {
    if (!lostBody) return;
    const items = LostItems.getByUser(user.uid);

    if (lostCount) lostCount.textContent = items.length;

    if (items.length === 0) {
      lostBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:var(--space-12);">
            <div class="empty-state" style="padding:0;">
              <span class="empty-state-icon">📋</span>
              <div class="empty-state-title">No lost reports yet</div>
              <div class="empty-state-desc">Report an item you've lost and let the community help.</div>
              <a href="report-lost.html" class="btn btn-primary" style="margin-top:var(--space-4);">📝 Report Lost Item</a>
            </div>
          </td>
        </tr>`;
      return;
    }

    lostBody.innerHTML = items.map(item => `
      <tr data-id="${item.id}">
        <td>
          <div class="report-table-name">${item.itemName}</div>
          <div class="report-table-date">${formatDate(item.date)}</div>
        </td>
        <td><span class="category-pill">${CATEGORY_ICONS[item.category] || ''} ${item.category}</span></td>
        <td style="color:var(--text-secondary);font-size:var(--text-sm);">${item.location}</td>
        <td><span class="badge badge-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></td>
        <td style="color:var(--text-muted);font-size:var(--text-xs);">${timeAgo(item.createdAt)}</td>
        <td>
          <div class="report-actions">
            <button class="btn btn-ghost btn-sm" onclick="viewLostItem('${item.id}')">View</button>
            ${item.status !== 'returned' ? `
              <button class="btn btn-outline btn-sm" onclick="markLostReturned('${item.id}')">Returned</button>
              <button class="btn btn-outline btn-sm" onclick="editLostItem('${item.id}')">Edit</button>
            ` : ''}
            <button class="btn btn-outline-danger btn-sm" onclick="deleteLostItem('${item.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderFoundReports() {
    if (!foundBody) return;
    const items = FoundItems.getByUser(user.uid);

    if (foundCount) foundCount.textContent = items.length;

    if (items.length === 0) {
      foundBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:var(--space-12);">
            <div class="empty-state" style="padding:0;">
              <span class="empty-state-icon">🎁</span>
              <div class="empty-state-title">No found reports yet</div>
              <div class="empty-state-desc">Found something? Help it get back to its owner.</div>
              <a href="report-found.html" class="btn btn-accent" style="margin-top:var(--space-4);">📝 Report Found Item</a>
            </div>
          </td>
        </tr>`;
      return;
    }

    foundBody.innerHTML = items.map(item => `
      <tr data-id="${item.id}">
        <td>
          <div class="report-table-name">${item.itemName}</div>
          <div class="report-table-date">${formatDate(item.date)}</div>
        </td>
        <td><span class="category-pill">${CATEGORY_ICONS[item.category] || ''} ${item.category}</span></td>
        <td style="color:var(--text-secondary);font-size:var(--text-sm);">${item.foundLocation || '—'}</td>
        <td><span class="badge badge-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></td>
        <td style="color:var(--text-muted);font-size:var(--text-xs);">${timeAgo(item.createdAt)}</td>
        <td>
          <div class="report-actions">
            <button class="btn btn-ghost btn-sm" onclick="viewFoundItem('${item.id}')">View</button>
            ${item.status !== 'returned' ? `
              <button class="btn btn-outline btn-sm" onclick="markFoundReturned('${item.id}')">Returned</button>
            ` : ''}
            <button class="btn btn-outline-danger btn-sm" onclick="deleteFoundItem('${item.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Tab switching
  function showTab(tab) {
    if (tab === 'lost') {
      lostPanel?.style && (lostPanel.style.display = 'block');
      foundPanel?.style && (foundPanel.style.display = 'none');
      lostTab?.classList.add('active');
      foundTab?.classList.remove('active');
    } else {
      lostPanel?.style && (lostPanel.style.display = 'none');
      foundPanel?.style && (foundPanel.style.display = 'block');
      lostTab?.classList.remove('active');
      foundTab?.classList.add('active');
    }
  }

  lostTab?.addEventListener('click',  () => showTab('lost'));
  foundTab?.addEventListener('click', () => showTab('found'));

  // Initial render
  renderLostReports();
  renderFoundReports();
  showTab('lost');

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm({ title:'Log Out', message:'Log out?', icon:'👋', confirmText:'Log Out', dangerConfirm:false })
      .then(ok => { if (ok) Auth.logout(); });
  });

  Loader.hide();
});

// ── Global action handlers ──
window.viewLostItem = (id) => {
  const item = LostItems.getById(id);
  if (item) openDetailModal(item, 'lost');
};

window.viewFoundItem = (id) => {
  const item = FoundItems.getPublicById(id);
  if (item) openDetailModal(item, 'found');
};

window.markLostReturned = async (id) => {
  const ok = await showConfirm({
    title:       'Mark as Returned',
    message:     'Mark this lost item as returned? This will update its status.',
    confirmText: 'Mark Returned',
    dangerConfirm: false
  });
  if (!ok) return;
  LostItems.markReturned(id);
  Toast.success('Updated!', 'Item marked as returned.');
  location.reload();
};

window.markFoundReturned = async (id) => {
  const ok = await showConfirm({
    title:       'Mark as Returned',
    message:     'Mark this found item as returned to its owner?',
    confirmText: 'Mark Returned',
    dangerConfirm: false
  });
  if (!ok) return;
  FoundItems.markReturned(id);
  Toast.success('Updated!', 'Item marked as returned to owner! 🎉');
  location.reload();
};

window.deleteLostItem = async (id) => {
  const ok = await showConfirm({
    title:       'Delete Report',
    message:     'Are you sure you want to delete this lost item report? This cannot be undone.',
    confirmText: 'Delete',
    dangerConfirm: true
  });
  if (!ok) return;
  LostItems.delete(id);
  Toast.success('Deleted', 'Lost item report removed.');
  location.reload();
};

window.deleteFoundItem = async (id) => {
  const ok = await showConfirm({
    title:       'Delete Report',
    message:     'Delete this found item report? This cannot be undone.',
    confirmText: 'Delete',
    dangerConfirm: true
  });
  if (!ok) return;
  FoundItems.delete(id);
  Toast.success('Deleted', 'Found item report removed.');
  location.reload();
};

window.editLostItem = (id) => {
  window.location.href = `report-lost.html?edit=${id}`;
};
