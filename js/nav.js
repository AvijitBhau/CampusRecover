// =====================================================
// CampusRecover — Shared Navigation Component
// Injects sidebar + topbar + mobile nav into any page
// =====================================================

// SVG icon set for nav (no emojis)
const NAV_ICONS = {
  dashboard:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  'lost-items': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  'found-items':`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  'my-reports': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  profile:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  'report-lost':`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  'report-found':`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

// Mobile nav SVG icons
const MOB_ICONS = {
  dashboard:   `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  lost:        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  found:       `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  profile:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  plus:        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
};

function injectNav(activePage) {
  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',   href: 'dashboard.html' },
    { id: 'lost-items',   label: 'Lost Items',  href: 'lost-items.html' },
    { id: 'found-items',  label: 'Found Items', href: 'found-items.html' },
    { id: 'my-reports',   label: 'My Reports',  href: 'my-reports.html' },
    { id: 'profile',      label: 'Profile',     href: 'profile.html' },
  ];

  const reportItems = [
    { id: 'report-lost',  label: 'Report Lost',  href: 'report-lost.html' },
    { id: 'report-found', label: 'Report Found', href: 'report-found.html' },
  ];

  const navItemsHTML = navItems.map(item => `
    <a href="${item.href}" class="nav-item${item.id === activePage ? ' active' : ''}" data-page="${item.id}">
      <span class="nav-icon">${NAV_ICONS[item.id] || ''}</span>
      <span class="nav-label">${item.label}</span>
    </a>
  `).join('');

  const reportItemsHTML = reportItems.map(item => `
    <a href="${item.href}" class="nav-item${item.id === activePage ? ' active' : ''}" data-page="${item.id}">
      <span class="nav-icon">${NAV_ICONS[item.id] || ''}</span>
      <span class="nav-label">${item.label}</span>
    </a>
  `).join('');

  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <!-- Logo -->
      <a href="dashboard.html" class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <div class="sidebar-logo-text">Campus<span>Recover</span></div>
      </a>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-label">Navigation</div>
        ${navItemsHTML}

        <div class="nav-section-label" style="margin-top:var(--space-4);">Reports</div>
        ${reportItemsHTML}
      </nav>

      <!-- CTA -->
      <div class="sidebar-cta">
        <p>Found something? Help someone out!</p>
        <a href="report-found.html" class="btn btn-accent btn-sm">Report Found Item</a>
      </div>

      <!-- User section -->
      <div class="sidebar-toggle">
        <div class="sidebar-user" id="sidebar-user-btn">
          <div class="sidebar-avatar" id="sidebar-avatar">–</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name" id="sidebar-user-name">Loading...</div>
            <div class="sidebar-user-role"  id="sidebar-user-role">Student</div>
          </div>
        </div>
        <button class="btn btn-outline-danger btn-sm w-full" id="logout-btn" style="margin-top:var(--space-3);">
          Log Out
        </button>
      </div>
    </aside>
  `;

  const topbarHTML = `
    <header class="topbar">
      <button class="topbar-hamburger" id="topbar-hamburger" aria-label="Toggle sidebar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="topbar-title" id="topbar-title">CampusRecover</span>

      <div class="topbar-search" id="topbar-search-wrap">
        <span class="topbar-search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input type="search" id="topbar-search" placeholder="Search items…" autocomplete="off" />
      </div>

      <div class="topbar-actions">
        <button class="notif-btn" title="Notifications" onclick="Toast.info('Notifications', 'No new notifications.')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notif-dot"></span>
        </button>
        <button class="theme-toggle" title="Toggle theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="theme-icon-sun">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
        <a href="profile.html" class="sidebar-avatar" id="topbar-avatar" style="text-decoration:none;width:36px;height:36px;font-size:var(--text-sm);">–</a>
      </div>
    </header>
  `;

  const mobileNavHTML = `
    <nav class="mobile-nav" role="navigation" aria-label="Mobile navigation">
      <div class="mobile-nav-items">
        <a href="dashboard.html" class="mobile-nav-item${activePage === 'dashboard' ? ' active' : ''}" data-page="dashboard">
          <span class="mob-icon">${MOB_ICONS.dashboard}</span>
          <span>Home</span>
        </a>
        <a href="lost-items.html" class="mobile-nav-item${activePage === 'lost-items' ? ' active' : ''}" data-page="lost-items">
          <span class="mob-icon">${MOB_ICONS.lost}</span>
          <span>Lost</span>
        </a>
        <a href="report-lost.html" class="mobile-nav-item report-btn${['report-lost','report-found'].includes(activePage) ? ' active' : ''}" data-page="report-lost">
          <span class="mob-icon">${MOB_ICONS.plus}</span>
        </a>
        <a href="found-items.html" class="mobile-nav-item${activePage === 'found-items' ? ' active' : ''}" data-page="found-items">
          <span class="mob-icon">${MOB_ICONS.found}</span>
          <span>Found</span>
        </a>
        <a href="profile.html" class="mobile-nav-item${activePage === 'profile' ? ' active' : ''}" data-page="profile">
          <span class="mob-icon">${MOB_ICONS.profile}</span>
          <span>Profile</span>
        </a>
      </div>
    </nav>
  `;

  const overlayHTML = `<div class="overlay" id="sidebar-overlay"></div>`;

  // Inject into app-layout
  const appLayout = document.getElementById('app-layout');
  if (!appLayout) return;
  appLayout.insertAdjacentHTML('afterbegin', sidebarHTML);
  document.getElementById('app-topbar').innerHTML = topbarHTML;
  document.body.insertAdjacentHTML('beforeend', mobileNavHTML + overlayHTML);

  // Topbar search redirect
  const topbarSearch = document.getElementById('topbar-search');
  topbarSearch?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && topbarSearch.value.trim()) {
      window.location.href = `lost-items.html?search=${encodeURIComponent(topbarSearch.value.trim())}`;
    }
  });
}

window.injectNav = injectNav;
