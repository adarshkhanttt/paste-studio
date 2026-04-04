(function () {
    var UNLOCK_KEY = 'dps_gated_unlocked';

    // ── Open the contact modal, setting the hidden source field ──────────────
    function openContactModal(source) {
        var cm = document.getElementById('contact-modal');
        if (!cm || cm.classList.contains('active')) return;

        var sourceInput = document.getElementById('cf-source');
        if (sourceInput) sourceInput.value = source || 'Unknown';

        var cmTitle = document.getElementById('contact-modal-title');
        var cmSub   = document.getElementById('contact-modal-sub');
        if (cmTitle) { cmTitle.textContent = 'UNLOCK FULL ACCESS'; cmTitle.hidden = false; }
        if (cmSub)   { cmSub.textContent   = 'FILL IN YOUR DETAILS TO UNLOCK THE FULL LIBRARY.'; cmSub.hidden = false; }

        cm.classList.add('active');
    }

    // ── Lock: disable pointer events on blurred Wistia embeds in locked cards ─
    function lockAll() {
        document.querySelectorAll('.short-card.locked .short-card-player').forEach(function (p) {
            p.style.pointerEvents = 'none';
        });
        // Film card players are gated via the capture-phase click listener below
    }

    // ── Wire locked cards — capture phase so nothing leaks through ────────────
    document.querySelectorAll('.film-card.locked, .short-card.locked').forEach(function (card) {
        var source = card.classList.contains('film-card') ? 'Films' : 'Shorts';
        function gateHandler(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            openContactModal(source);
        }
        card._gateHandler = gateHandler;
        card.addEventListener('click', gateHandler, true /* capture */);
    });

    // ── Unlock: remove gate listeners and .locked class ──────────────────────
    function unlockAll() {
        document.querySelectorAll('.film-card.locked, .short-card.locked').forEach(function (card) {
            if (card._gateHandler) {
                card.removeEventListener('click', card._gateHandler, true);
                delete card._gateHandler;
            }
            card.classList.remove('locked');
        });
    }

    // Expose globally so hubspot.js can trigger unlock after successful submission
    window.dpsUnlockAll = unlockAll;

    // ── Init: check localStorage on every page load ───────────────────────────
    var alreadyUnlocked = false;
    try { alreadyUnlocked = localStorage.getItem(UNLOCK_KEY) === 'true'; } catch (_) {}

    if (alreadyUnlocked) {
        unlockAll();
    } else {
        lockAll();
    }

})();
