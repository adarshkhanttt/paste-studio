/**
 * Preloader
 * Shows "PASTED STUDIO PRESENTS" for a cinematic moment,
 * then fades out and triggers the hero entrance animations.
 *
 * Only plays once per browser session — skipped on client-side navigation.
 */

(function () {
  // Always start at the top on any page load
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const SESSION_KEY = 'pasted_preloader_seen';
  const preloader   = document.getElementById('preloader');

  // If already played this session, hide immediately and mark body as loaded
  if (sessionStorage.getItem(SESSION_KEY)) {
    if (preloader) preloader.style.display = 'none';
    document.body.classList.add('loaded');
    return;
  }

  if (!preloader) {
    document.body.classList.add('loaded');
    return;
  }

  // How long the preloader stays visible before fading (ms)
  const HOLD = 2800;
  // CSS transition duration on .leaving (must match CSS)
  const FADE = 900;

  function dismiss() {
    preloader.classList.add('leaving');

    setTimeout(() => {
      preloader.style.display = 'none';
      // Trigger hero entrance animations
      document.body.classList.add('loaded');
      // Mark as seen for the rest of this session
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) {}
    }, FADE);
  }

  // Start the countdown as soon as the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(dismiss, HOLD));
  } else {
    setTimeout(dismiss, HOLD);
  }
})();
