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
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
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

// ── Shorts overlay (index.html + film.html) ──
export function initShortsPlayer(trackId = 'shortsTrack') {
    const overlay = document.getElementById('shortsPlayerOverlay');
    const player = createOverlayPlayer('shortsPlayerOverlay', 'shortsPlayerInner', 'shortsPlayerClose');
    if (!player) return;

    // When user exits fullscreen via ESC or browser UI, close the overlay
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && overlay.classList.contains('active')) {
            player.close();
        }
    });

    document.querySelectorAll('.short-card[data-media-id]').forEach(card => {
        card.addEventListener('click', () => {
            const track = card.closest(`#${trackId}`);
            if (track && track.classList.contains('dragging')) return;
            player.open(card.dataset.mediaId);
            overlay.requestFullscreen?.().catch?.(() => {});
        });
    });
}

// ── Archive overlay (shorts.html) ────────────
export function initArchivePlayer() {
    const overlay = document.getElementById('archivePlayerOverlay');
    const player = createOverlayPlayer('archivePlayerOverlay', 'archivePlayerInner', 'archivePlayerClose');
    if (!player) return;

    // When user exits fullscreen via ESC or browser UI, close the overlay
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && overlay.classList.contains('active')) {
            player.close();
        }
    });

    document.querySelectorAll('#archiveTrack .short-card[data-media-id]').forEach(card => {
        card.addEventListener('click', () => {
            if (card.closest('#archiveTrack')?.classList.contains('dragging')) return;
            player.open(card.dataset.mediaId);
            overlay.requestFullscreen?.().catch?.(() => {});
        });
    });
}
