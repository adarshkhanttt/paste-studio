/**
 * Preloader
 * Shows "PASTED STUDIO PRESENTS" for a cinematic moment,
 * then fades out and triggers the hero entrance animations.
 */

(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // How long the preloader stays visible before fading (ms)
  const HOLD    = 2800;
  // CSS transition duration on .leaving (must match CSS)
  const FADE    = 900;

  function dismiss() {
    preloader.classList.add('leaving');

    setTimeout(() => {
      preloader.style.display = 'none';
      // Trigger hero entrance animations
      document.body.classList.add('loaded');
    }, FADE);
  }

  // Start the countdown as soon as the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(dismiss, HOLD));
  } else {
    setTimeout(dismiss, HOLD);
  }
})();
