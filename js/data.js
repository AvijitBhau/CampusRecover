// =====================================================
// CampusRecover — Data Module
// In-memory demo data + CRUD operations
// Falls back to localStorage for persistence
// =====================================================

// ── Category icons map ──
const CATEGORY_ICONS = {
  'Electronics':   '📱',
  'Wallet':        '👛',
  'ID Card':       '🪪',
  'Documents':     '📄',
  'Keys':          '🔑',
  'Accessories':   '👓',
  'Books':         '📚',
  'Clothing':      '👕',
  'Bag':           '🎒',
  'Sports':        '⚽',
  'Other':         '📦'
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

// ── Seed lost items ──
const SEED_LOST = [
  {
    id:          'lost_001',
    type:        'lost',
    reporterUid: 'user_002',
    reporterName:'Priya Patel',
    itemName:    'OnePlus Nord CE 3 Lite',
    category:    'Electronics',
    description: 'Black colored phone with a transparent back cover. Has a small crack on the bottom-left corner of the screen. Lock screen wallpaper is a mountain landscape.',
    location:    'Library – 2nd Floor Reading Room',
    date:        '2026-07-28',
    status:      'lost',
    imageUrl:    '',
    createdAt:   Date.now() - 3 * 24 * 60 * 60 * 1000
  },
  {
    id:          'lost_002',
    type:        'lost',
    reporterUid: 'user_001',
    reporterName:'Arjun Sharma',
    itemName:    'Brown Leather Wallet',
    category:    'Wallet',
    description: 'Dark brown bi-fold leather wallet. Contains college ID, metro card, and some cash. Has initials "AS" embossed on the inside.',
    location:    'Main Canteen near Exit B',
    date:        '2026-07-29',
    status:      'lost',
    imageUrl:    '',
    createdAt:   Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id:          'lost_003',
    type:        'lost',
    reporterUid: 'user_003',
    reporterName:'Rahul Verma',
    itemName:    'College ID Card',
    category:    'ID Card',
    description: 'Student ID card for Rahul Verma, Roll No. 2025ME010. Mechanical Engineering 2nd year. Lost during PE class.',
    location:    'Sports Ground – Basketball Court',
    date:        '2026-07-30',
    status:      'returned',
    imageUrl:    '',
    createdAt:   Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  {
    id:          'lost_004',
    type:        'lost',
    reporterUid: 'user_002',
    reporterName:'Priya Patel',
    itemName:    'JBL Earphones (Wired)',
    category:    'Accessories',
    description: 'White JBL C50HI earphones. One side of the earbud tip is missing. Cable has a blue rubber band tied near the jack.',
    location:    'Seminar Hall Block C',
    date:        '2026-07-27',
    status:      'lost',
    imageUrl:    '',
    createdAt:   Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    id:          'lost_005',
    type:        'lost',
    reporterUid: 'user_001',
    reporterName:'Arjun Sharma',
    itemName:    'Data Structures Textbook',
    category:    'Books',
    description: 'Cormen CLRS 3rd Edition. Has yellow sticky notes throughout and name written in blue ink on the first page.',
    location:    'CS Department Lab 3',
    date:        '2026-07-31',
    status:      'lost',
    imageUrl:    '',
    createdAt:   Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id:          'lost_006',
    type:        'lost',
    reporterUid: 'user_003',
    reporterName:'Rahul Verma',
    itemName:    'HP Calculator',
    category:    'Electronics',
    description: 'HP 35s Scientific Calculator. Has a "RV" sticker on the back in red color. Lost during mid-semester exam.',
    location:    'Examination Hall – Block A',
    date:        '2026-07-26',
    status:      'found',
    imageUrl:    '',
    createdAt:   Date.now() - 5 * 24 * 60 * 60 * 1000
  }
];

// ── Seed found items ──
const SEED_FOUND = [
  {
    id:              'found_001',
    type:            'found',
    reporterUid:     'user_001',
    reporterName:    'Arjun Sharma',
    finderPhone:     '+91 98765 43210',
    finderMeetLocation: 'CS Department Reception',
    itemName:        'Samsung Galaxy Buds (Case)',
    category:        'Electronics',
    description:     'Found a white Samsung Galaxy Buds charging case in the lecture hall. Both earbuds are inside.',
    foundLocation:   'Lecture Hall 204, Block B',
    date:            '2026-07-30',
    status:          'found',
    imageUrl:        '',
    uniqueIdentifier:'small star sticker on the lid',
    createdAt:       Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  {
    id:              'found_002',
    type:            'found',
    reporterUid:     'user_002',
    reporterName:    'Priya Patel',
    finderPhone:     '+91 87654 32109',
    finderMeetLocation: 'Library Information Desk',
    itemName:        'Set of 3 Keys on Ring',
    category:        'Keys',
    description:     'Found a set of 3 keys on a blue metal ring. One key appears to be for a bike.',
    foundLocation:   'Library Entrance Steps',
    date:            '2026-07-29',
    status:          'found',
    imageUrl:        '',
    uniqueIdentifier:'blue metal ring with a small red rubber band',
    createdAt:       Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id:              'found_003',
    type:            'found',
    reporterUid:     'user_003',
    reporterName:    'Rahul Verma',
    finderPhone:     '+91 76543 21098',
    finderMeetLocation: 'Mechanical Dept – Prof. Desk',
    itemName:        'College ID Card (Priya Patel)',
    category:        'ID Card',
    description:     'Found a student ID card near the basketball court. Card belongs to Rahul Verma, 2nd year.',
    foundLocation:   'Sports Ground – Benches',
    date:            '2026-07-30',
    status:          'returned',
    imageUrl:        '',
    uniqueIdentifier:'small scratch on back left corner of card',
    createdAt:       Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  {
    id:              'found_004',
    type:            'found',
    reporterUid:     'user_001',
    reporterName:    'Arjun Sharma',
    finderPhone:     '+91 98765 43210',
    finderMeetLocation: 'CS Dept – Lab 3 TA Desk',
    itemName:        'HP Scientific Calculator',
    category:        'Electronics',
    description:     'HP 35s calculator found on exam bench after the paper. Seems to belong to a Mechanical student.',
    foundLocation:   'Examination Hall – Block A Bench 12',
    date:            '2026-07-27',
    status:          'found',
    imageUrl:        '',
    uniqueIdentifier:'RV sticker in red color on the back',
    createdAt:       Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    id:              'found_005',
    type:            'found',
    reporterUid:     'user_002',
    reporterName:    'Priya Patel',
    finderPhone:     '+91 87654 32109',
    finderMeetLocation: 'EC Dept – 3rd Floor Corridor',
    itemName:        'Leather Wallet (Brown)',
    category:        'Wallet',
    description:     'Found a brown wallet near the canteen. Contains ID and metro card.',
    foundLocation:   'Main Canteen – Table 7',
    date:            '2026-07-29',
    status:          'found',
    imageUrl:        '',
    uniqueIdentifier:'AS embossed inside the wallet',
    createdAt:       Date.now() - 2 * 24 * 60 * 60 * 1000
  }
];

// ── Local Storage keys ──
const LS_KEYS = {
  LOST:  'cr_lost_items',
  FOUND: 'cr_found_items'
};

// ── Data store (in-memory) ──
let _lostItems  = [];
let _foundItems = [];

/**
 * Initialize data — load from localStorage or use seed data.
 */
function initData() {
  try {
    const storedLost  = localStorage.getItem(LS_KEYS.LOST);
    const storedFound = localStorage.getItem(LS_KEYS.FOUND);
    _lostItems  = storedLost  ? JSON.parse(storedLost)  : [...SEED_LOST];
    _foundItems = storedFound ? JSON.parse(storedFound) : [...SEED_FOUND];
  } catch (_) {
    _lostItems  = [...SEED_LOST];
    _foundItems = [...SEED_FOUND];
  }
}

function saveLost()  { localStorage.setItem(LS_KEYS.LOST,  JSON.stringify(_lostItems)); }
function saveFound() { localStorage.setItem(LS_KEYS.FOUND, JSON.stringify(_foundItems)); }

function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── LOST ITEMS CRUD ──
const LostItems = {
  getAll()       { return [..._lostItems].sort((a,b) => b.createdAt - a.createdAt); },
  getById(id)    { return _lostItems.find(i => i.id === id) || null; },
  getByUser(uid) { return _lostItems.filter(i => i.reporterUid === uid).sort((a,b) => b.createdAt - a.createdAt); },

  add(data) {
    const item = {
      ...data,
      id:        genId('lost'),
      type:      'lost',
      status:    'lost',
      createdAt: Date.now()
    };
    _lostItems.unshift(item);
    saveLost();
    return item;
  },

  update(id, data) {
    const idx = _lostItems.findIndex(i => i.id === id);
    if (idx === -1) return null;
    _lostItems[idx] = { ..._lostItems[idx], ...data };
    saveLost();
    return _lostItems[idx];
  },

  delete(id) {
    const before = _lostItems.length;
    _lostItems = _lostItems.filter(i => i.id !== id);
    saveLost();
    return _lostItems.length < before;
  },

  markReturned(id) { return LostItems.update(id, { status: 'returned' }); }
};

// ── FOUND ITEMS CRUD ──
const FoundItems = {
  /**
   * Return found items WITHOUT the uniqueIdentifier, finderPhone, finderMeetLocation.
   * These are only visible after successful claim verification.
   */
  getAll() {
    return [..._foundItems]
      .sort((a,b) => b.createdAt - a.createdAt)
      .map(FoundItems._sanitize);
  },

  getById(id) {
    return _foundItems.find(i => i.id === id) || null; // raw (full)
  },

  /** Sanitized version for public display */
  getPublicById(id) {
    const item = _foundItems.find(i => i.id === id);
    return item ? FoundItems._sanitize(item) : null;
  },

  getByUser(uid) {
    return _foundItems
      .filter(i => i.reporterUid === uid)
      .sort((a,b) => b.createdAt - a.createdAt)
      .map(FoundItems._sanitize);
  },

  /** Strip sensitive fields for public display */
  _sanitize(item) {
    const { uniqueIdentifier, finderPhone, finderMeetLocation, ...safe } = item;
    return safe;
  },

  add(data) {
    const item = {
      ...data,
      id:        genId('found'),
      type:      'found',
      status:    'found',
      createdAt: Date.now()
    };
    _foundItems.unshift(item);
    saveFound();
    return item;
  },

  update(id, data) {
    const idx = _foundItems.findIndex(i => i.id === id);
    if (idx === -1) return null;
    _foundItems[idx] = { ..._foundItems[idx], ...data };
    saveFound();
    return _foundItems[idx];
  },

  delete(id) {
    const before = _foundItems.length;
    _foundItems = _foundItems.filter(i => i.id !== id);
    saveFound();
    return _foundItems.length < before;
  },

  markReturned(id) { return FoundItems.update(id, { status: 'returned' }); },

  /**
   * Verify ownership claim.
   * @returns {{ success, item }} — item contains sensitive fields only on success
   */
  verifyClaim(id, userAnswer) {
    const item = _foundItems.find(i => i.id === id);
    if (!item) return { success: false, reason: 'Item not found.' };
    if (item.status === 'returned') return { success: false, reason: 'This item has already been returned.' };

    const normalize = str => str.trim().toLowerCase().replace(/\s+/g, ' ');
    const match = normalize(item.uniqueIdentifier) === normalize(userAnswer);

    if (match) {
      return {
        success:          true,
        finderName:       item.reporterName,
        finderPhone:      item.finderPhone,
        meetLocation:     item.finderMeetLocation
      };
    }
    return { success: false, reason: 'Incorrect identifier. Please try again.' };
  }
};

// ── Stats ──
const Stats = {
  get() {
    return {
      totalLost:     _lostItems.length,
      totalFound:    _foundItems.length,
      totalReturned: [..._lostItems, ..._foundItems].filter(i => i.status === 'returned').length,
      activeLost:    _lostItems.filter(i => i.status === 'lost').length,
      activeFound:   _foundItems.filter(i => i.status === 'found').length
    };
  }
};

// ── Helpers ──
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Initialize on load
initData();

// Export globally
window.CATEGORY_ICONS = CATEGORY_ICONS;
window.CATEGORIES     = CATEGORIES;
window.LostItems      = LostItems;
window.FoundItems     = FoundItems;
window.Stats          = Stats;
window.formatDate     = formatDate;
window.timeAgo        = timeAgo;
