// ─────────────────────────────────────────────
// PRELOADER
// Shows once per session, then fades out and
// marks body.loaded for hero entrance animations.
// ─────────────────────────────────────────────

const SESSION_KEY = 'pasted_preloader_seen';
const HOLD = 2800; // ms visible before fade
const FADE = 900;  // must match CSS transition on .leaving

export function initPreloader() {
    // Always start at the top on page load
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const preloader = document.getElementById('preloader');

    if (sessionStorage.getItem(SESSION_KEY)) {
        if (preloader) preloader.style.display = 'none';
        document.body.classList.add('loaded');
        return;
    }

    if (!preloader) {
        document.body.classList.add('loaded');
        return;
    }

    function dismiss() {
        preloader.classList.add('leaving');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
            try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) {}
        }, FADE);
    }

    setTimeout(dismiss, HOLD);
}
