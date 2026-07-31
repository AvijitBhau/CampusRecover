// =====================================================
// CampusRecover — Found Items Page
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireAuth();
  if (!user) return;

  Theme.init();
  Sidebar.init();
  updateUserUI(user);
  setActiveNav('found-items');

  const grid        = document.getElementById('found-items-grid');
  const searchInput = document.getElementById('search-input');
  const categorySel = document.getElementById('category-filter');
  const statusSel   = document.getElementById('status-filter');
  const sortSel     = document.getElementById('sort-filter');
  const countEl     = document.getElementById('items-count');
  const chips       = document.querySelectorAll('.filter-chip[data-category]');

  // Populate categories
  if (categorySel) {
    CATEGORIES.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = `${CATEGORY_ICONS[cat]} ${cat}`;
      categorySel.appendChild(opt);
    });
  }

  // URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('search') && searchInput) searchInput.value = params.get('search');

  let currentFilters = {
    search:   searchInput?.value || '',
    category: categorySel?.value || '',
    status:   statusSel?.value   || ''
  };

  function renderGrid() {
    if (!grid) return;
    renderSkeletonCards(grid, 6);

    setTimeout(() => {
      let items = FoundItems.getAll(); // Already sanitized (no uniqueIdentifier)

      // Sort
      if (sortSel?.value === 'oldest') items.sort((a,b) => a.createdAt - b.createdAt);
      else items.sort((a,b) => b.createdAt - a.createdAt);

      const filtered = filterItems(items, currentFilters);

      if (countEl) countEl.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;">
            <span class="empty-state-icon">📦</span>
            <div class="empty-state-title">No found items</div>
            <div class="empty-state-desc">Did you find something? Help someone get it back!</div>
            <a href="report-found.html" class="btn btn-accent">📝 Report Found Item</a>
          </div>`;
        return;
      }

      grid.innerHTML = filtered.map(item => renderItemCard(item, 'found')).join('');
      bindCardEvents(grid, 'found');
      initScrollAnimations();
    }, 400);
  }

  const onChange = () => {
    currentFilters = {
      search:   searchInput?.value  || '',
      category: categorySel?.value  || '',
      status:   statusSel?.value    || ''
    };
    renderGrid();
  };

  searchInput?.addEventListener('input', debounce(onChange, 300));
  categorySel?.addEventListener('change', onChange);
  statusSel?.addEventListener('change', onChange);
  sortSel?.addEventListener('change', onChange);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.category;
      if (categorySel) categorySel.value = cat === 'all' ? '' : cat;
      onChange();
    });
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm({ title:'Log Out', message:'Log out?', icon:'👋', confirmText:'Log Out', dangerConfirm:false })
      .then(ok => { if (ok) Auth.logout(); });
  });

  renderGrid();
  Loader.hide();
});

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
