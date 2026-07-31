// =====================================================
// CampusRecover — UI Utilities
// Toast, Modal, Loader, Ripple, Theme, Sidebar helpers
// =====================================================

// ══════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════
const Toast = {
  container: null,
  queue: [],
  MAX: 4,

  _init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  },

  show(options = {}) {
    this._init();
    const {
      title   = '',
      message = '',
      type    = 'info',
      duration = 4000
    } = options;

    // SVG icons per type
    const icons = {
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        ${title   ? `<div class="toast-title">${title}</div>` : ''}
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-dismiss" aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    toast.querySelector('.toast-dismiss').addEventListener('click', () => this._remove(toast));

    this.container.appendChild(toast);

    const timer = setTimeout(() => this._remove(toast), duration);
    toast._timer = timer;

    const toasts = this.container.querySelectorAll('.toast');
    if (toasts.length > this.MAX) {
      this._remove(toasts[0]);
    }

    return toast;
  },

  _remove(toast) {
    if (!toast || toast._removing) return;
    toast._removing = true;
    clearTimeout(toast._timer);
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 500);
  },

  success(title, message) { return this.show({ title, message, type: 'success' }); },
  error(title, message)   { return this.show({ title, message, type: 'error',   duration: 6000 }); },
  warning(title, message) { return this.show({ title, message, type: 'warning' }); },
  info(title, message)    { return this.show({ title, message, type: 'info' }); }
};

// ══════════════════════════════════════════════
// MODAL SYSTEM
// ══════════════════════════════════════════════
const Modal = {
  _stack: [],

  open(id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    this._stack.push(id);

    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) this.close(id);
    }, { once: true });

    const escHandler = e => {
      if (e.key === 'Escape') { this.close(id); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
    backdrop._escHandler = escHandler;
  },

  close(id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    backdrop.classList.remove('active');
    this._stack = this._stack.filter(s => s !== id);
    if (this._stack.length === 0) document.body.style.overflow = '';
    if (backdrop._escHandler) document.removeEventListener('keydown', backdrop._escHandler);
  },

  closeAll() {
    this._stack.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    this._stack = [];
    document.body.style.overflow = '';
  }
};

// ══════════════════════════════════════════════
// CONFIRMATION DIALOG
// ══════════════════════════════════════════════
function showConfirm({ title, message, icon = '', confirmText = 'Confirm', dangerConfirm = true }) {
  return new Promise((resolve) => {
    document.getElementById('global-confirm')?.remove();

    const html = `
      <div id="global-confirm" class="modal-backdrop">
        <div class="modal" style="max-width:400px;">
          <div class="modal-body" style="text-align:center;padding:var(--space-8);">
            ${icon ? `<span class="confirm-icon">${icon}</span>` : ''}
            <div class="confirm-title">${title}</div>
            <p class="confirm-message">${message}</p>
            <div style="display:flex;gap:var(--space-3);justify-content:center;">
              <button class="btn btn-ghost" id="confirm-cancel">Cancel</button>
              <button class="btn ${dangerConfirm ? 'btn-danger' : 'btn-primary'}" id="confirm-ok">${confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    const backdrop = document.getElementById('global-confirm');
    requestAnimationFrame(() => backdrop.classList.add('active'));

    const cleanup = (result) => {
      backdrop.classList.remove('active');
      setTimeout(() => backdrop.remove(), 300);
      resolve(result);
    };

    document.getElementById('confirm-ok').addEventListener('click',     () => cleanup(true));
    document.getElementById('confirm-cancel').addEventListener('click', () => cleanup(false));
    backdrop.addEventListener('click', e => { if (e.target === backdrop) cleanup(false); });
  });
}

// ══════════════════════════════════════════════
// PAGE LOADER
// ══════════════════════════════════════════════
const Loader = {
  show() {
    const existing = document.getElementById('page-loader');
    if (existing) { existing.classList.remove('hidden'); return; }
    const el = document.createElement('div');
    el.id = 'page-loader';
    el.className = 'page-loader';
    el.innerHTML = `<div class="loader-ring"></div>`;
    document.body.appendChild(el);
  },

  hide() {
    const el = document.getElementById('page-loader');
    if (el) {
      el.classList.add('hidden');
      setTimeout(() => el.remove(), 500);
    }
  }
};

// ══════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════
const Theme = {
  STORAGE_KEY: 'cr_theme',

  current() {
    return localStorage.getItem(this.STORAGE_KEY) || 'dark';
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  },

  toggle() {
    const next = this.current() === 'dark' ? 'light' : 'dark';
    this.apply(next);
  },

  init() {
    this.apply(this.current());
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};

// ══════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════
const Sidebar = {
  STORAGE_KEY: 'cr_sidebar',

  init() {
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('topbar-hamburger');
    if (!sidebar) return;

    hamburger?.addEventListener('click', () => this.mobileToggle(sidebar, overlay));
    overlay?.addEventListener('click',  () => this.mobileClose(sidebar, overlay));

    document.getElementById('sidebar-collapse-btn')?.addEventListener('click', () => this.desktopToggle(sidebar));

    const collapsed = localStorage.getItem(this.STORAGE_KEY) === 'collapsed';
    if (collapsed) sidebar.classList.add('collapsed');
  },

  mobileToggle(sidebar, overlay) {
    const isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) this.mobileClose(sidebar, overlay);
    else        this.mobileOpen(sidebar, overlay);
  },

  mobileOpen(sidebar, overlay) {
    sidebar.classList.add('mobile-open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  mobileClose(sidebar, overlay) {
    sidebar.classList.remove('mobile-open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  },

  desktopToggle(sidebar) {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    const mainContent = document.querySelector('.main-content');
    mainContent?.classList.toggle('sidebar-collapsed', isCollapsed);
    localStorage.setItem(this.STORAGE_KEY, isCollapsed ? 'collapsed' : 'expanded');
  }
};

// ══════════════════════════════════════════════
// NAV ACTIVE STATE
// ══════════════════════════════════════════════
function setActiveNav(page) {
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.page === page || el.getAttribute('href')?.includes(page)) {
      el.classList.add('active');
    }
  });
}

// ══════════════════════════════════════════════
// RIPPLE EFFECT
// ══════════════════════════════════════════════
function addRipple(element) {
  element.classList.add('ripple-container');
  element.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    this.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  });
}

// ══════════════════════════════════════════════
// SKELETON LOADING
// ══════════════════════════════════════════════
function renderSkeletonCards(container, count = 6) {
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
// ANIMATED COUNTER
// ══════════════════════════════════════════════
function animateCounter(el, target, duration = 1200) {
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ══════════════════════════════════════════════
// INTERSECTION OBSERVER (scroll animations)
// ══════════════════════════════════════════════
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'cardAppear 0.5s cubic-bezier(0.4,0,0.2,1) forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.item-card, .stat-card, .future-scope-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ══════════════════════════════════════════════
// IMAGE UPLOAD PREVIEW
// ══════════════════════════════════════════════
function initImageUpload(inputId, previewId, areaId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const area    = document.getElementById(areaId);
  if (!input || !preview || !area) return;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      Toast.warning('Invalid File', 'Please select an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Toast.warning('File Too Large', 'Image must be smaller than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = preview.querySelector('img') || document.createElement('img');
      img.src = e.target.result;
      if (!preview.contains(img)) preview.appendChild(img);
      preview.style.display = 'block';
      area.style.display = 'none';
      input._previewData = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0]);
  });

  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) { handleFile(file); }
  });

  preview.querySelector('.image-preview-remove')?.addEventListener('click', () => {
    preview.style.display = 'none';
    area.style.display = 'block';
    input.value = '';
    input._previewData = null;
  });
}

// ══════════════════════════════════════════════
// SEARCH FILTER HELPER
// ══════════════════════════════════════════════
function filterItems(items, { search = '', category = '', status = '' }) {
  return items.filter(item => {
    const matchSearch = !search ||
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase()) ||
      item.foundLocation?.toLowerCase().includes(search.toLowerCase());

    const matchCat    = !category || item.category === category;
    const matchStatus = !status   || item.status   === status;

    return matchSearch && matchCat && matchStatus;
  });
}

// ══════════════════════════════════════════════
// USER AVATAR COMPONENT
// ══════════════════════════════════════════════
function updateUserUI(user) {
  if (!user) return;
  const initials = user.avatar || Auth.getInitials(user.name);
  document.querySelectorAll('.sidebar-avatar').forEach(el => {
    el.textContent = initials;
  });
  const topbarAvatar = document.getElementById('topbar-avatar');
  if (topbarAvatar) topbarAvatar.textContent = initials;
  document.querySelectorAll('.sidebar-user-name').forEach(el => {
    el.textContent = user.name;
  });
  document.querySelectorAll('.sidebar-user-role').forEach(el => {
    el.textContent = `${user.enrollment} · ${user.department?.split(' ')[0]}`;
  });
}

// Expose all
window.Toast             = Toast;
window.Modal             = Modal;
window.showConfirm       = showConfirm;
window.Loader            = Loader;
window.Theme             = Theme;
window.Sidebar           = Sidebar;
window.setActiveNav      = setActiveNav;
window.addRipple         = addRipple;
window.renderSkeletonCards = renderSkeletonCards;
window.animateCounter    = animateCounter;
window.initScrollAnimations = initScrollAnimations;
window.initImageUpload   = initImageUpload;
window.filterItems       = filterItems;
window.updateUserUI      = updateUserUI;
