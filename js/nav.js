/**
 * Mobile Navigation — Hamburger Menu
 * Toggles a full-screen overlay with staggered link animations.
 */

(function () {
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.getElementById('nav-mobile');
  const closeBtn   = mobileNav?.querySelector('.nav-mobile-close');

  if (!hamburger || !mobileNav) return;

  const mobileLinks = mobileNav.querySelectorAll('a');

  function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('active') ? closeMenu() : openMenu();
  });

  // Close button inside the overlay
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when a nav link is tapped
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) closeMenu();
  });
})();
