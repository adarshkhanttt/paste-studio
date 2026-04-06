// ─────────────────────────────────────────────
// LAZYLOAD — IntersectionObserver for reveal
//            animations and footer credits
// ─────────────────────────────────────────────

export function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '-30px' });

    els.forEach(el => observer.observe(el));
}

export function initFooterCredits() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const credits = footer.querySelectorAll('.footer-credit');
    const labels  = footer.querySelectorAll('.footer-col-label');
    let fired     = false;

    const observer = new IntersectionObserver((entries) => {
        if (fired || !entries[0].isIntersecting) return;
        fired = true;

        credits.forEach(el => {
            const delay = parseInt(el.dataset.delay || 0, 10);
            setTimeout(() => el.classList.add('credits-visible'), delay);
        });

        labels.forEach((label, i) => {
            setTimeout(() => label.classList.add('label-revealed'), 250 + i * 250);
        });

        observer.disconnect();
    }, { threshold: 0.15 });

    observer.observe(footer);
}
