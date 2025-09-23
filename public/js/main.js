import { loadHomePage } from './pages/home.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHomePage();
});

// Add this code to handle the Home button in the header
document.addEventListener('click', (e) => {
  const homeBtn = e.target.closest('#nav-home');
  if (homeBtn) {
    e.preventDefault();
    loadHomePage();
    // Optionally, set the active class
    document.querySelectorAll('.header-nav a').forEach(a => a.classList.remove('active'));
    homeBtn.classList.add('active');
  }
});

// Delegated click handler for header Admin button
document.addEventListener('click', async (e) => {
  const adminBtn = e.target.closest('#headerAdminBtn');
  if (!adminBtn) return;

  // Always open Admin Login as requested
  const { loadAdminLogin } = await import('./pages/admin.js');
  loadAdminLogin();
});