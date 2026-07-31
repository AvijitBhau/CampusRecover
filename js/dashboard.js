// =====================================================
// CampusRecover — Dashboard Page
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireAuth();
  if (!user) return;

  Theme.init();
  Sidebar.init();
  updateUserUI(user);
  setActiveNav('dashboard');

  // Welcome message
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetEl = document.getElementById('welcome-greeting');
  const nameEl  = document.getElementById('welcome-name');
  if (greetEl) greetEl.textContent = greeting;
  if (nameEl)  nameEl.textContent  = user.name.split(' ')[0] + '!';

  // Load stats
  const stats = Stats.get();
  const statEls = {
    'stat-lost':     stats.activeLost,
    'stat-found':    stats.activeFound,
    'stat-returned': stats.totalReturned,
    'stat-total':    stats.totalLost + stats.totalFound
  };
  Object.entries(statEls).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) animateCounter(el, value, 1200);
  });

  // Recent Lost Items
  const recentLostGrid = document.getElementById('recent-lost-grid');
  if (recentLostGrid) {
    renderSkeletonCards(recentLostGrid, 3);
    setTimeout(() => {
      const items = LostItems.getAll().slice(0, 6);
      if (items.length === 0) {
        recentLostGrid.innerHTML = `<div class="empty-state" style="padding:var(--space-8);grid-column:1/-1;">
          <span class="empty-state-icon" style="font-size:48px;opacity:0.3;display:block;">○</span>
          <div class="empty-state-title">No lost items yet</div>
          <div class="empty-state-desc">Be the first to report a lost item.</div>
        </div>`;
      } else {
        recentLostGrid.innerHTML = items.map(item => renderItemCard(item, 'lost')).join('');
        bindCardEvents(recentLostGrid, 'lost');
        initScrollAnimations();
      }
    }, 600);
  }

  // Recent Found Items
  const recentFoundGrid = document.getElementById('recent-found-grid');
  if (recentFoundGrid) {
    renderSkeletonCards(recentFoundGrid, 3);
    setTimeout(() => {
      const items = FoundItems.getAll().slice(0, 6);
      if (items.length === 0) {
        recentFoundGrid.innerHTML = `<div class="empty-state" style="padding:var(--space-8);grid-column:1/-1;">
          <span class="empty-state-icon" style="font-size:48px;opacity:0.3;display:block;">○</span>
          <div class="empty-state-title">No found items yet</div>
          <div class="empty-state-desc">Found something? Report it here!</div>
        </div>`;
      } else {
        recentFoundGrid.innerHTML = items.map(item => renderItemCard(item, 'found')).join('');
        bindCardEvents(recentFoundGrid, 'found');
        initScrollAnimations();
      }
    }, 800);
  }

  // Dashboard search
  const dashSearch = document.getElementById('dashboard-search');
  if (dashSearch) {
    dashSearch.addEventListener('input', debounce(e => {
      const q = e.target.value.trim();
      if (q.length < 2) return;
      window.location.href = `lost-items.html?search=${encodeURIComponent(q)}`;
    }, 500));
    dashSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter' && dashSearch.value.trim()) {
        window.location.href = `lost-items.html?search=${encodeURIComponent(dashSearch.value.trim())}`;
      }
    });
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm({
      title:       'Log Out',
      message:     'Are you sure you want to log out of CampusRecover?',
      confirmText: 'Log Out',
      dangerConfirm: false
    }).then(ok => { if (ok) Auth.logout(); });
  });

  Loader.hide();
});

// Render item card — clean, no emoji meta icons
function renderItemCard(item, type) {
  const icon = window.CATEGORY_ICONS?.[item.category] || '—';
  const loc  = item.foundLocation || item.location || '—';
  const date = window.formatDate?.(item.date) || item.date || '—';
  const ago  = window.timeAgo?.(item.createdAt) || '';
  const imgHTML = item.imageUrl
    ? `<img src="${item.imageUrl}" alt="${item.itemName}" loading="lazy" />`
    : `<div class="item-card-image-placeholder"><span>${icon}</span><p>${item.category}</p></div>`;

  return `
    <div class="item-card shimmer-on-hover" data-id="${item.id}" data-type="${type}">
      <div class="item-card-image">
        ${imgHTML}
        <div class="item-card-status">
          <span class="badge badge-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
        </div>
      </div>
      <div class="item-card-body">
        <div class="item-card-category">
          <span class="category-pill">${icon} ${item.category}</span>
          <small class="text-muted" style="margin-left:auto;">${ago}</small>
        </div>
        <div class="item-card-name">${item.itemName}</div>
        <div class="item-card-meta">
          <div class="item-card-meta-row"><span style="opacity:0.5;font-size:11px;">Location</span> ${loc}</div>
          <div class="item-card-meta-row"><span style="opacity:0.5;font-size:11px;">Date</span> ${date}</div>
        </div>
        ${item.description ? `<div class="item-card-desc">${item.description}</div>` : ''}
      </div>
      <div class="item-card-actions">
        <button class="btn btn-ghost btn-sm view-btn" data-id="${item.id}" data-type="${type}">View Details</button>
        ${type === 'found' && item.status === 'found'
          ? `<button class="btn btn-primary btn-sm claim-btn" data-id="${item.id}">Claim Item</button>`
          : ''}
      </div>
    </div>
  `;
}

// Bind card button events
function bindCardEvents(container, type) {
  container.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const t  = btn.dataset.type;
      const item = t === 'found' ? FoundItems.getPublicById(id) : LostItems.getById(id);
      if (item) openDetailModal(item, t);
    });
  });

  container.querySelectorAll('.claim-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openClaimModal(btn.dataset.id);
    });
  });

  container.querySelectorAll('.item-card').forEach(card => {
    addRipple(card);
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const t  = card.dataset.type;
      const item = t === 'found' ? FoundItems.getPublicById(id) : LostItems.getById(id);
      if (item) openDetailModal(item, t);
    });
  });
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

window.renderItemCard  = renderItemCard;
window.bindCardEvents  = bindCardEvents;
