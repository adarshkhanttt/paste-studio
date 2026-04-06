// ─────────────────────────────────────────────
// ANIMATIONS — all GSAP-driven animations
// Wrapped in gsap.matchMedia() to respect
// prefers-reduced-motion: reduce
// ─────────────────────────────────────────────

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Hero ticker (index.html) ─────────────────
export function initHeroTicker() {
    const ticker = document.getElementById('heroTicker');
    if (!ticker) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        ticker.innerHTML += ticker.innerHTML;
        gsap.set(ticker, { x: 0 });

        const halfWidth   = ticker.scrollWidth / 2;
        const pxPerSecond = window.innerWidth < 640 ? 35 : 60;

        const tween = gsap.fromTo(ticker,
            { x: 0 },
            { x: -halfWidth, duration: halfWidth / pxPerSecond, ease: 'linear', repeat: -1 }
        );

        ticker.parentElement?.addEventListener('mouseenter', () =>
            gsap.to(tween, { timeScale: 0.35, duration: 0.8, ease: 'power2.out' })
        );
        ticker.parentElement?.addEventListener('mouseleave', () =>
            gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'power2.out' })
        );
    });
}

// ── Custom cursor (index.html) ───────────────
export function initHeroCursor() {
    const cursor = document.getElementById('heroCursor');
    const hero   = document.querySelector('.hero');
    if (!cursor || !hero) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        const xTo = gsap.quickTo(cursor, 'x', { duration: 0.55, ease: 'power3' });
        const yTo = gsap.quickTo(cursor, 'y', { duration: 0.55, ease: 'power3' });

        window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });

        hero.addEventListener('mouseenter', () => {
            hero.style.cursor = 'none';
            gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
        });
        hero.addEventListener('mouseleave', () => {
            hero.style.cursor = '';
            gsap.to(cursor, { opacity: 0, scale: 0.7, duration: 0.35, ease: 'power2.in' });
        });
        hero.addEventListener('mousedown', () =>
            gsap.to(cursor, { scale: 0.82, duration: 0.15, ease: 'power2.out' })
        );
        hero.addEventListener('mouseup', () =>
            gsap.to(cursor, { scale: 1, duration: 0.25, ease: 'power2.out' })
        );
    });
}

// ── Scroll ticker (index.html) ───────────────
export function initScrollTicker() {
    const section = document.getElementById('scroll-ticker');
    const track   = section?.querySelector('.scroll-ticker-track');
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        const totalWidth = track.scrollWidth;
        gsap.fromTo(track,
            { x: -totalWidth * 0.08 },
            {
                x: totalWidth * 0.17,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            }
        );
    });
}

// ── Shorts.html vertical column tickers ──────
export function initShortsColumns() {
    const cols = [
        { el: document.getElementById('shortsCol1'), speed: 30, reverse: false },
        { el: document.getElementById('shortsCol2'), speed: 22, reverse: true  },
        { el: document.getElementById('shortsCol3'), speed: 26, reverse: false },
    ];
    if (!cols[0].el) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        cols.forEach(col => {
            if (!col.el) return;
            col.el.innerHTML += col.el.innerHTML; // duplicate for seamless loop
            if (col.reverse) gsap.set(col.el, { y: '-50%' });

            requestAnimationFrame(() => {
                const halfHeight = col.el.scrollHeight / 2;
                if (!halfHeight) return;
                const duration = halfHeight / col.speed;
                if (col.reverse) {
                    gsap.fromTo(col.el,
                        { y: -halfHeight },
                        { y: 0, duration, ease: 'none', repeat: -1 }
                    );
                } else {
                    gsap.to(col.el, { y: -halfHeight, duration, ease: 'none', repeat: -1 });
                }
            });
        });
    });
}

// ── Stat number counters (index.html intro) ──
export function initCounters() {
    const statEls = document.querySelectorAll('.stat-number');
    if (!statEls.length) return;

    function runCounter(el) {
        const raw    = el.dataset.target;
        const suffix = raw.replace(/[0-9]/g, '');
        const target = parseInt(raw, 10);
        const start  = performance.now();
        const dur    = 2800;
        (function tick(now) {
            const p      = Math.min((now - start) / dur, 1);
            const eased  = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        })(start);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statEls.forEach(el => {
        el.dataset.target = el.textContent.trim();
        el.textContent = '0';
        observer.observe(el);
    });
}

// ── Investor slot-machine stats ───────────────
export function initSlotMachine() {
    const rows = document.querySelectorAll('.investor-stat[data-stat]');
    if (!rows.length) return;

    rows.forEach(row => {
        const statStr = row.getAttribute('data-stat');
        const label   = row.getAttribute('data-label');

        const valueEl = document.createElement('div');
        valueEl.className = 'investor-stat-value';

        for (let i = 0; i < statStr.length; i++) {
            const ch       = statStr[i];
            const charWrap = document.createElement('span');
            charWrap.className    = 'slot-char';
            charWrap.dataset.delay = String(i * 120);

            const inner  = document.createElement('span');
            inner.className = 'slot-char-inner';

            const filler = document.createElement('span');
            filler.textContent = ch;
            filler.setAttribute('aria-hidden', 'true');

            const final  = document.createElement('span');
            final.textContent = ch;

            inner.appendChild(filler);
            inner.appendChild(final);
            charWrap.appendChild(inner);
            valueEl.appendChild(charWrap);
        }

        const labelEl = document.createElement('div');
        labelEl.className   = 'investor-stat-label';
        labelEl.textContent = label;

        row.appendChild(valueEl);
        row.appendChild(labelEl);
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.slot-char').forEach(ch => {
                const delay = parseInt(ch.dataset.delay, 10);
                setTimeout(() => ch.classList.add('landed'), delay);
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    rows.forEach(row => observer.observe(row));
}
