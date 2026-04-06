// ─────────────────────────────────────────────
// PLAYER — shared Wistia iframe overlay logic
// Creates an open/close player for a given overlay.
// ─────────────────────────────────────────────

function buildPlayer(mediaId) {
    const wp = document.createElement('wistia-player');
    wp.setAttribute('media-id', mediaId);
    wp.setAttribute('autoplay', 'true');
    wp.setAttribute('muted', 'false');
    wp.setAttribute('controls-visible-on-load', 'true');
    wp.setAttribute('fullscreen-button', 'true');
    wp.setAttribute('playbar', 'true');
    wp.setAttribute('volume-control', 'true');
    wp.setAttribute('settings-control', 'true');
    wp.setAttribute('video-foam', 'true');
    wp.setAttribute('plugin-logo-bug-on', 'false');
    wp.setAttribute('plugin-custom-logo-on', 'false');
    wp.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
    return wp;
}

/**
 * createOverlayPlayer(overlayId, innerId, closeBtnId)
 * Returns { open(mediaId), close() }
 */
export function createOverlayPlayer(overlayId, innerId, closeBtnId) {
    const overlay  = document.getElementById(overlayId);
    const inner    = document.getElementById(innerId);
    const closeBtn = document.getElementById(closeBtnId);
    if (!overlay || !inner) return null;

    function open(mediaId, onClose) {
        overlay._onClose = onClose || null;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        inner.appendChild(buildPlayer(mediaId));
    }

    function close() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        const media = inner.querySelector('wistia-player, iframe');
        if (media) media.remove();
        if (typeof overlay._onClose === 'function') overlay._onClose();
        overlay._onClose = null;
    }

    if (closeBtn) closeBtn.addEventListener('click', e => { e.stopPropagation(); close(); });
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });

    return { open, close };
}

// ── Hero / index.html watch film overlay ─────
export function initHeroPlayer() {
    const player = createOverlayPlayer('heroPlayerOverlay', 'heroPlayerInner', 'heroPlayerClose');
    if (!player) return;

    const hero = document.querySelector('[data-hero-play]') || document.querySelector('.hero');
    if (hero) hero.addEventListener('click', () => player.open('8kirf86p7j'));
}

// ── Index.html films section overlay ─────────
export function initFilmsPlayer() {
    const player = createOverlayPlayer('filmsPlayerOverlay', 'filmsPlayerInner', 'filmsPlayerClose');
    if (!player) return;

    document.querySelectorAll('.film-card[data-media-id]').forEach(card => {
        const cardPlayer = card.querySelector('.film-card-player');
        card.addEventListener('click', () => {
            if (cardPlayer && typeof cardPlayer.pause === 'function') cardPlayer.pause();
            player.open(card.dataset.mediaId, () => {
                if (cardPlayer && typeof cardPlayer.pause === 'function') cardPlayer.pause();
            });
        });
    });
}

// ── Film.html trailer overlay ─────────────────
export function initTrailerPlayer() {
    const player = createOverlayPlayer('filmTrailerOverlay', 'filmTrailerInner', 'filmTrailerClose');
    if (!player) return;

    const openBtn = document.getElementById('filmTrailerBtn');
    if (openBtn) openBtn.addEventListener('click', () => player.open('66o4d2abaa'));
}

// ── iOS detection ─────────────────────────────
// Covers iPhone/iPod, iPad (pre-iOS13), and iPad (iOS13+ reports MacIntel)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

// ── iOS CSS fake fullscreen ────────────────────────────────────────────
// iOS WebKit silently ignores requestFullscreen() on custom elements.
// Instead we apply a CSS class that forces the overlay to cover 100% of
// the screen with safe-area insets. Android and desktop are NOT affected.
function applyIOSFullscreen(overlay) {
    // Save scroll position — setting position:fixed resets it to 0
    overlay._savedScrollY = window.scrollY;
    overlay.classList.add('ios-fake-fullscreen');
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${overlay._savedScrollY}px`;
    document.body.style.width    = '100%';
    window.addEventListener('orientationchange', () => {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, { once: false });
}

function removeIOSFullscreen(overlay) {
    const scrollY = overlay._savedScrollY || 0;
    overlay.classList.remove('ios-fake-fullscreen');
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    // Restore scroll position so the page returns to where the user was
    window.scrollTo(0, scrollY);
}

// ── Android + desktop: click Wistia's own fullscreen button ───────────
// Targets innerEl directly to avoid matching decorative card thumbnail
// players that share the same media-id but have fullscreen-button="false".
function wistiaFullscreen(innerEl) {
    function getShadow(el) { return el.__shadow || el.shadowRoot || null; }

    function findInRoot(root, selector) {
        const found = root.querySelector(selector);
        if (found) return found;
        for (const el of root.querySelectorAll('*')) {
            const sr = getShadow(el);
            if (sr) { const f = findInRoot(sr, selector); if (f) return f; }
        }
        return null;
    }

    const BTN_SEL = 'button[aria-label="Fullscreen"], [data-handle="fullscreenControl"] button';

    let ticks = 0;
    function poll() {
        ticks++;
        if (ticks > 300) return;
        const wp     = innerEl.querySelector('wistia-player');
        const shadow = wp && getShadow(wp);
        if (!shadow) { requestAnimationFrame(poll); return; }
        const btn = findInRoot(shadow, BTN_SEL);
        if (btn) {
            btn.click();
            try {
                btn.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
                btn.dispatchEvent(new TouchEvent('touchend',   { bubbles: true, cancelable: true }));
            } catch (_) {}
            return;
        }
        requestAnimationFrame(poll);
    }
    requestAnimationFrame(poll);
}

// ── Shorts overlay (index.html + film.html) ──
export function initShortsPlayer(trackId = 'shortsTrack') {
    const inner   = document.getElementById('shortsPlayerInner');
    const overlay = document.getElementById('shortsPlayerOverlay');
    const player  = createOverlayPlayer('shortsPlayerOverlay', 'shortsPlayerInner', 'shortsPlayerClose');
    if (!player || !inner) return;

    document.querySelectorAll('.short-card[data-media-id]').forEach(card => {
        card.addEventListener('click', () => {
            const track = card.closest(`#${trackId}`);
            if (track && track.classList.contains('dragging')) return;
            if (isIOS) {
                player.open(card.dataset.mediaId, () => removeIOSFullscreen(overlay));
                applyIOSFullscreen(overlay);
            } else {
                player.open(card.dataset.mediaId);
                wistiaFullscreen(inner);
            }
        });
    });
}

// ── Archive overlay (shorts.html) ────────────
export function initArchivePlayer() {
    const inner   = document.getElementById('archivePlayerInner');
    const overlay = document.getElementById('archivePlayerOverlay');
    const player  = createOverlayPlayer('archivePlayerOverlay', 'archivePlayerInner', 'archivePlayerClose');
    if (!player || !inner) return;

    document.querySelectorAll('#archiveTrack .short-card[data-media-id]').forEach(card => {
        card.addEventListener('click', () => {
            if (card.closest('#archiveTrack')?.classList.contains('dragging')) return;
            if (isIOS) {
                player.open(card.dataset.mediaId, () => removeIOSFullscreen(overlay));
                applyIOSFullscreen(overlay);
            } else {
                player.open(card.dataset.mediaId);
                wistiaFullscreen(inner);
            }
        });
    });
}
