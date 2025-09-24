import { loadHomePage } from './pages/home.js';
import { loadRegisterComplaint } from './pages/register.js';
import { loadCheckStatus } from './pages/status.js';
import { loadContactPage } from './pages/contact.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHomePage();
  document.getElementById('nav-home').classList.add('active');
});

const navLinks = {
  'nav-home': loadHomePage,
  'nav-register': loadRegisterComplaint,
  'nav-status': loadCheckStatus,
  'nav-contact': loadContactPage
};

document.querySelector('.header-nav').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const id = e.target.id;

    if (navLinks[id]) {
      document.querySelectorAll('.header-nav a').forEach(a => a.classList.remove('active'));
      e.target.classList.add('active');
      navLinks[id]();
    }
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