/**
 * Premium Smooth Scroll
 * Custom inertia-based scroll interpolation using requestAnimationFrame.
 * Intercepts wheel events and animates toward the target position with
 * an exponential ease-out, giving a weighty, high-end feel.
 */

(function () {
  const LERP_FACTOR = 0.072;   // lower = slower/heavier, higher = snappier
  const WHEEL_SCALE = 1.2;     // multiplier applied to wheel delta

  let currentY = window.scrollY;
  let targetY  = window.scrollY;
  let rafId    = null;
  let isRunning = false;

  /* ─── Easing ──────────────────────────────────────────────────── */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ─── Animation loop ──────────────────────────────────────────── */
  function tick() {
    const distance = targetY - currentY;

    if (Math.abs(distance) < 0.5) {
      currentY = targetY;
      window.scrollTo(0, currentY);
      isRunning = false;
      rafId = null;
      return;
    }

    currentY = lerp(currentY, targetY, LERP_FACTOR);
    window.scrollTo(0, currentY);
    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      rafId = requestAnimationFrame(tick);
    }
  }

  /* ─── Wheel handler ───────────────────────────────────────────── */
  function onWheel(e) {
    // Let the browser handle horizontal scroll naturally
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();

    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    targetY = Math.min(maxY, Math.max(0, targetY + e.deltaY * WHEEL_SCALE));
    startLoop();
  }

  /* ─── Anchor / nav link smooth jump ──────────────────────────── */
  function onAnchorClick(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY;
    targetY = Math.min(
      document.documentElement.scrollHeight - window.innerHeight,
      Math.max(0, offset)
    );
    startLoop();
  }

  /* ─── Sync on native scroll (keyboard, scrollbar drag) ───────── */
  function onNativeScroll() {
    if (!isRunning) {
      currentY = window.scrollY;
      targetY  = window.scrollY;
    }
  }

  /* ─── Init ────────────────────────────────────────────────────── */
  function init() {
    // Remove CSS smooth scroll so we own all scrolling
    document.documentElement.style.scrollBehavior = 'auto';

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    document.addEventListener('click', onAnchorClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
