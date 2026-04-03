(function () {
    var STORAGE_KEY = 'dps_gated_unlocked';

    var modal      = document.getElementById('modal');
    var emailInput = modal ? modal.querySelector('input[type="email"]') : null;
    var submitBtn  = modal ? modal.querySelector('button[type="submit"]') : null;

    // ── Modal helpers ─────────────────────────────────────────────────────────

    function openModal() {
        if (modal && !modal.classList.contains('active')) {
            modal.classList.add('active');
            if (emailInput) emailInput.focus();
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        if (emailInput) {
            emailInput.value = '';
            emailInput.classList.remove('error');
        }
    }

    // ── Lock: disable Wistia pointer events inside blurred cards ─────────────

    function lockAll() {
        document.querySelectorAll('.short-card.locked .short-card-player').forEach(function (p) {
            p.style.pointerEvents = 'none';
        });
    }

    // ── Wire locked cards: store handler ref so we can remove it on unlock ────

    document.querySelectorAll('.film-card.locked, .short-card.locked').forEach(function (card) {
        function gateHandler(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            openModal();
        }
        card._gateHandler = gateHandler;
        card.addEventListener('click', gateHandler, true /* capture */);
    });

    // ── Unlock: remove gate listener THEN remove .locked ─────────────────────

    function unlockAll() {
        document.querySelectorAll('.film-card.locked, .short-card.locked').forEach(function (card) {
            if (card._gateHandler) {
                card.removeEventListener('click', card._gateHandler, true);
                delete card._gateHandler;
            }
            card.classList.remove('locked');
        });
    }

    // ── Email submission ──────────────────────────────────────────────────────

    function handleSubmit() {
        if (!emailInput) return;
        var email = emailInput.value.trim();
        var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!valid) {
            emailInput.classList.add('error');
            return;
        }
        emailInput.classList.remove('error');

        // TODO: Replace with your CRM / API call (e.g. HubSpot form submission)
        console.log('[Pasted Studio] Unlock email submitted:', email);

        try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (_) {}

        unlockAll();
        closeModal();
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handleSubmit();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
        });
        emailInput.addEventListener('input', function () {
            emailInput.classList.remove('error');
        });
    }

    // ── Init: check localStorage on every page load ───────────────────────────

    var alreadyUnlocked = false;
    try { alreadyUnlocked = localStorage.getItem(STORAGE_KEY) === 'true'; } catch (_) {}

    if (alreadyUnlocked) {
        unlockAll();
    } else {
        lockAll();
    }

})();
