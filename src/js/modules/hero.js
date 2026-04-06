/**
 * Hero — Ticker & Custom Cursor
 * Requires GSAP (loaded via CDN in <head>)
 */

window.addEventListener('load', function () {

  /* ─── Ticker ────────────────────────────────────────────────── */
  const ticker = document.getElementById('heroTicker');

  if (ticker) {
    // Duplicate content so the loop point is seamless
    ticker.innerHTML += ticker.innerHTML;

    // Pin start position before measuring
    gsap.set(ticker, { x: 0 });

    const halfWidth    = ticker.scrollWidth / 2;
    const pxPerSecond  = window.innerWidth < 640 ? 35 : 60;

    // fromTo makes the repeat boundary explicit: jumps from -halfWidth → 0
    // Both halves are identical so the jump is invisible
    const tween = gsap.fromTo(ticker,
      { x: 0 },
      {
        x        : -halfWidth,
        duration : halfWidth / pxPerSecond,
        ease     : 'linear',
        repeat   : -1,
      }
    );

    // Slow down on hover — target the tween, not the element
    ticker.parentElement.addEventListener('mouseenter', () =>
      gsap.to(tween, { timeScale: 0.35, duration: 0.8, ease: 'power2.out' })
    );
    ticker.parentElement.addEventListener('mouseleave', () =>
      gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'power2.out' })
    );
  }

  /* ─── Custom cursor ─────────────────────────────────────────── */
  const cursor = document.getElementById('heroCursor');
  const hero   = document.querySelector('.hero');

  if (!cursor || !hero) return;

  // GSAP quickTo for buttery-smooth following
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.55, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.55, ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // Show cursor & hide default pointer when inside hero
  hero.addEventListener('mouseenter', () => {
    hero.style.cursor = 'none';
    gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
  });

  hero.addEventListener('mouseleave', () => {
    hero.style.cursor = '';
    gsap.to(cursor, { opacity: 0, scale: 0.7, duration: 0.35, ease: 'power2.in' });
  });

  // Subtle press feedback
  hero.addEventListener('mousedown', () =>
    gsap.to(cursor, { scale: 0.82, duration: 0.15, ease: 'power2.out' })
  );
  hero.addEventListener('mouseup', () =>
    gsap.to(cursor, { scale: 1, duration: 0.25, ease: 'power2.out' })
  );

});
