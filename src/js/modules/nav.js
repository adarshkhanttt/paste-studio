// ─────────────────────────────────────────────
// NAV — hamburger toggle + mobile overlay
// ─────────────────────────────────────────────

export function initNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileNav = document.getElementById('nav-mobile');
    if (!hamburger || !mobileNav) return;

    const closeBtn    = mobileNav.querySelector('.nav-mobile-close');
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

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) closeMenu();
    });
}
