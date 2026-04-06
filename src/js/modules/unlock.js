// unlock.js - gate locked cards behind contact modal
const UNLOCK_KEY = 'dps_gated_unlocked';

function openContactModal(source) {
    if (typeof window._openContactModal === 'function') {
        window._openContactModal('membership');
        const si = document.getElementById('cf-source');
        if (si) si.value = source || 'Unknown';
        return;
    }
    const cm = document.getElementById('contact-modal');
    if (!cm || cm.classList.contains('active')) return;
    const cmTitle = document.getElementById('contact-modal-title');
    const cmSub   = document.getElementById('contact-modal-sub');
    if (cmTitle) { cmTitle.textContent = 'UNLOCK FULL ACCESS'; cmTitle.hidden = false; }
    if (cmSub)   { cmSub.textContent   = 'FILL IN YOUR DETAILS TO UNLOCK THE FULL LIBRARY.'; cmSub.hidden = false; }
    const si = document.getElementById('cf-source');
    if (si) si.value = source || 'Unknown';
    cm.classList.add('active');
    cm.setAttribute('aria-hidden', 'false');
}

function lockAll() {
    document.querySelectorAll('.short-card.locked .short-card-player').forEach(p => {
        p.style.pointerEvents = 'none';
    });
}

function wireGates() {
    document.querySelectorAll('.film-card.locked, .short-card.locked').forEach(card => {
        const source = card.classList.contains('film-card') ? 'Films' : 'Shorts';
        function gateHandler(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            openContactModal(source);
        }
        card._gateHandler = gateHandler;
        card.addEventListener('click', gateHandler, true);
    });
}

export function unlockAll() {
    document.querySelectorAll('.film-card.locked, .short-card.locked').forEach(card => {
        if (card._gateHandler) {
            card.removeEventListener('click', card._gateHandler, true);
            delete card._gateHandler;
        }
        card.classList.remove('locked');
    });
}

export function initUnlock() {
    window.dpsUnlockAll = unlockAll;
    let alreadyUnlocked = false;
    try { alreadyUnlocked = localStorage.getItem(UNLOCK_KEY) === 'true'; } catch (_) {}
    if (alreadyUnlocked) {
        unlockAll();
    } else {
        lockAll();
        wireGates();
    }
}
