// ─────────────────────────────────────────────
// MAIN — orchestrates all modules
// Guard clauses inside each init() handle pages
// that don't have the relevant elements.
// ─────────────────────────────────────────────

import { initPreloader }       from './modules/preloader.js';
import { initNav }             from './modules/nav.js';
import { initSmoothScroll }    from './modules/smooth-scroll.js';
import { initReveal, initFooterCredits } from './modules/lazyload.js';
import { initContactModal }    from './modules/modal.js';
import { initUnlock }          from './modules/unlock.js';
import { initHubSpot }         from './modules/hubspot.js';
import { initFilmCardOembed, initShortCardOembed, initFilmHeroTitle } from './modules/oembed.js';
import { initCarousel }        from './modules/carousel.js';
import { initStudio }          from './modules/studio.js';
import {
    initHeroTicker,
    initHeroCursor,
    initScrollTicker,
    initShortsColumns,
    initCounters,
    initSlotMachine,
} from './modules/animations.js';
import {
    initHeroPlayer,
    initFilmsPlayer,
    initTrailerPlayer,
    initShortsPlayer,
    initArchivePlayer,
} from './modules/player.js';

// Run preloader immediately (doesn't need DOMContentLoaded)
initPreloader();

document.addEventListener('DOMContentLoaded', () => {
    // ── Shared across all pages ──────────────
    initNav();
    initSmoothScroll();
    initReveal();
    initFooterCredits();
    initContactModal();
    initUnlock();
    initHubSpot();

    // ── Short-card oEmbed (all pages with short cards) ──
    initShortCardOembed('.short-card');

    // ── Short carousels (all pages) ──────────
    initCarousel('shortsTrack',  'shortsPrev',  'shortsNext');
    initCarousel('archiveTrack', 'archivePrev', 'archiveNext');

    // ── Player overlays ──────────────────────
    initHeroPlayer();
    initFilmsPlayer();
    initTrailerPlayer();
    initShortsPlayer('shortsTrack');
    initArchivePlayer();

    // ── index.html specific ──────────────────
    initStudio();
    initCounters();
    initSlotMachine();
    initFilmCardOembed();

    // ── film.html specific ───────────────────
    initFilmHeroTitle('o6oncnfzlu', 'filmHeroTitle');

    // ── GSAP (runs after load event) ─────────
    window.addEventListener('load', () => {
        initHeroTicker();
        initHeroCursor();
        initScrollTicker();
        initShortsColumns();
    }, { once: true });
});
