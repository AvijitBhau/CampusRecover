// =====================================================
// CampusRecover — Auth Module
// Mock authentication + session management
// =====================================================

const DEMO_USERS = [
  {
    uid:        'user_001',
    name:       'Arjun Sharma',
    enrollment: '2024CS001',
    password:   'campus123',
    department: 'Computer Science',
    phone:      '+91 98765 43210',
    email:      'arjun.sharma@campus.edu',
    year:       '3rd Year',
    avatar:     'AS'
  },
  {
    uid:        'user_002',
    name:       'Priya Patel',
    enrollment: '2023EC042',
    password:   'campus123',
    department: 'Electronics & Communication',
    phone:      '+91 87654 32109',
    email:      'priya.patel@campus.edu',
    year:       '4th Year',
    avatar:     'PP'
  }
];

const Auth = {
  SESSION_KEY: 'cr_session',
  USER_KEY:    'cr_user',

  /**
   * Attempt login with enrollment number + password.
   * @returns {{ success, user, error }}
   */
  login(enrollment, password) {
    const clean_enroll = enrollment.trim().toUpperCase();
    const clean_pass   = password.trim();

    if (!clean_enroll || !clean_pass) {
      return { success: false, error: 'Please fill in all fields.' };
    }

    const user = DEMO_USERS.find(
      u => u.enrollment.toUpperCase() === clean_enroll && u.password === clean_pass
    );

    if (!user) {
      return { success: false, error: 'Invalid enrollment number or password.' };
    }

    // Store session
    const session = {
      uid:       user.uid,
      loggedIn:  true,
      loginTime: Date.now()
    };

    // Don't store password in session
    const safeUser = { ...user };
    delete safeUser.password;

    localStorage.setItem(Auth.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(Auth.USER_KEY, JSON.stringify(safeUser));

    return { success: true, user: safeUser };
  },

  /**
   * Log out the current user.
   */
  logout() {
    localStorage.removeItem(Auth.SESSION_KEY);
    localStorage.removeItem(Auth.USER_KEY);
    window.location.href = 'index.html';
  },

  /**
   * Get the currently logged-in user object or null.
   */
  getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(Auth.SESSION_KEY));
      const user    = JSON.parse(localStorage.getItem(Auth.USER_KEY));
      if (session?.loggedIn && user) return user;
    } catch (_) {}
    return null;
  },

  /**
   * Check if user is authenticated. Redirect to login if not.
   */
  requireAuth() {
    const user = Auth.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },

  /**
   * If already logged in, redirect to dashboard (for login page).
   */
  redirectIfLoggedIn() {
    if (Auth.getCurrentUser()) {
      window.location.href = 'dashboard.html';
    }
  },

  /**
   * Update profile fields for the current user (demo only).
   */
  updateProfile(fields) {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    const updated = { ...user, ...fields };
    localStorage.setItem(Auth.USER_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Get user initials for avatar.
   */
  getInitials(name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }
};

// Make globally available
window.Auth = Auth;
