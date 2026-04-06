// ─────────────────────────────────────────────
// OEMBED — Wistia oEmbed fetches for dynamic
//          titles, durations, and thumbnails
// ─────────────────────────────────────────────

const BASE = 'https://fast.wistia.com/oembed.json?url=https%3A%2F%2Fgetpasted.wistia.com%2Fmedias%2F';

function fetchOembed(mediaId) {
    return fetch(BASE + mediaId).then(r => r.json()).catch(() => ({}));
}

/** Fetch title, duration, and thumbnail for film-card elements. */
export function initFilmCardOembed() {
    document.querySelectorAll('.film-card[data-media-id]').forEach(card => {
        const mediaId    = card.dataset.mediaId;
        const titleEl    = card.querySelector('.film-card-title');
        const durationEl = card.querySelector('.film-card-duration');
        const thumbEl    = card.querySelector('.film-card-img[src=""]');
        if (!mediaId) return;

        fetchOembed(mediaId).then(data => {
            if (data.title && titleEl && !titleEl.textContent.trim()) {
                titleEl.textContent = data.title;
            }
            if (data.duration && durationEl) {
                const mins = Math.round(data.duration / 60);
                durationEl.textContent = `Documentary · ${mins} min`;
            }
            if (data.thumbnail_url && thumbEl) {
                thumbEl.src = data.thumbnail_url;
            }
        });
    });
}

/** Fetch titles for short-card elements from their wistia-player media-id. */
export function initShortCardOembed(selector = '.short-card') {
    document.querySelectorAll(selector).forEach(card => {
        const player  = card.querySelector('wistia-player');
        const titleEl = card.querySelector('.short-card-title');
        if (!player || !titleEl) return;
        const mediaId = player.getAttribute('media-id');
        if (!mediaId) return;

        fetchOembed(mediaId).then(data => {
            if (data.title) titleEl.textContent = data.title;
        });
    });
}

/** Fetch hero film title for film.html. */
export function initFilmHeroTitle(mediaId, elementId) {
    if (!mediaId || !elementId) return;
    fetchOembed(mediaId).then(data => {
        const el = document.getElementById(elementId);
        if (el && data.title) el.textContent = data.title;
    });
}
