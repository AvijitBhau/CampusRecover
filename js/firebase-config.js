// =====================================================
// CampusRecover — Firebase Config
// Replace placeholders with your actual Firebase project config
// =====================================================

// NOTE: In demo mode, Firebase is disabled and localStorage is used.
// To enable Firebase, set DEMO_MODE = false and fill in your config below.

window.DEMO_MODE = true; // Set to false when using real Firebase

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_AUTH_DOMAIN",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// Initialize Firebase only if not in demo mode
if (!window.DEMO_MODE) {
  // Dynamically load Firebase SDK
  const loadFirebase = async () => {
    const { initializeApp }   = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore }    = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const { getStorage }      = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');
    const { getAuth }         = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

    const app  = initializeApp(firebaseConfig);
    window.db  = getFirestore(app);
    window.storage = getStorage(app);
    window.auth    = getAuth(app);

    console.log('🔥 Firebase initialized');
    document.dispatchEvent(new Event('firebase:ready'));
  };
  loadFirebase().catch(err => {
    console.warn('Firebase init failed, falling back to demo mode:', err);
    window.DEMO_MODE = true;
    document.dispatchEvent(new Event('firebase:ready'));
  });
} else {
  // Demo mode – signal ready immediately
  document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('firebase:ready'));
  });
}
