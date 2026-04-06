// ─────────────────────────────────────────────
// CAROUSEL — shared drag/swipe/arrow logic
// Used by shorts carousel (all pages) and
// archive carousel (shorts.html).
// ─────────────────────────────────────────────

const EASE = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
const DRAG_THRESHOLD = 8;

/**
 * initCarousel(trackId, prevId, nextId)
 * Wires a horizontally-draggable card track.
 */
export function initCarousel(trackId, prevId, nextId) {
    const track   = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track) return;

    let offset       = 0;
    let dragging     = false;
    let didDrag      = false;
    let dragStartX   = 0;
    let dragStartOff = 0;

    function cardStep() {
        const card = track.querySelector('.short-card');
        if (!card) return 260;
        return card.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 16);
    }

    function maxOffset() {
        return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
    }

    function applyOffset(val, animate) {
        offset = Math.max(0, Math.min(val, maxOffset()));
        track.style.transition = animate ? EASE : 'none';
        track.style.transform  = `translateX(${-offset}px)`;
        if (prevBtn) prevBtn.classList.toggle('disabled', offset <= 0);
        if (nextBtn) nextBtn.classList.toggle('disabled', offset >= maxOffset());
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (!prevBtn.classList.contains('disabled')) applyOffset(offset - cardStep(), true);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (!nextBtn.classList.contains('disabled')) applyOffset(offset + cardStep(), true);
    });

    // Mouse drag
    track.addEventListener('mousedown', e => {
        dragging = true; didDrag = false;
        dragStartX = e.clientX; dragStartOff = offset;
    });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        const dx = dragStartX - e.clientX;
        if (!didDrag && Math.abs(dx) < DRAG_THRESHOLD) return;
        didDrag = true;
        track.classList.add('dragging');
        applyOffset(dragStartOff + dx, false);
    });
    window.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        track.classList.remove('dragging');
    });

    // Touch swipe
    let touchStartX = 0;
    let touchOff    = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchOff    = offset;
    }, { passive: true });
    track.addEventListener('touchmove', e => {
        applyOffset(touchOff + (touchStartX - e.touches[0].clientX), false);
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx   = touchStartX - e.changedTouches[0].clientX;
        const step = cardStep();
        applyOffset(Math.round((touchOff + dx) / step) * step, true);
    }, { passive: true });

    applyOffset(0, false);
}
