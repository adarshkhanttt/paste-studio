// ─────────────────────────────────────────────
// MODAL — contact modal open/close
// Shared across all pages. Titles/subs/sources
// differ per modal type but logic is identical.
// ─────────────────────────────────────────────

const TITLES = {
    membership:   'REQUEST PRIVATE ACCESS',
    partnerships: 'DISCUSS PARTNERSHIP',
    investors:    'REQUEST DECK',
};

const SUBS = {
    membership:   "FILL IN YOUR DETAILS AND WE'LL REVIEW YOUR APPLICATION PERSONALLY.",
    partnerships: "TELL US ABOUT YOURSELF AND WE'LL BE IN TOUCH TO EXPLORE THE RIGHT FIT.",
    investors:    "FILL IN YOUR DETAILS AND WE'LL SEND OVER THE DECK.",
};

const SOURCES = {
    membership:   'Library',
    partnerships: 'Partnership',
    investors:    'Investors',
};

export function initContactModal() {
    const cm      = document.getElementById('contact-modal');
    if (!cm) return;

    const cmClose = document.getElementById('contact-modal-close');
    const cmTitle = document.getElementById('contact-modal-title');
    const cmSub   = document.getElementById('contact-modal-sub');
    const cmForm  = document.getElementById('contact-form');

    let lastFocused = null;

    // Focus trap: cycle Tab/Shift+Tab within the modal
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusable = Array.from(
            cm.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
        ).filter(el => !el.closest('[hidden]'));
        if (!focusable.length) { e.preventDefault(); return; }
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
    }

    function openCM(type) {
        if (cm.classList.contains('active')) return;
        if (cmTitle) { cmTitle.textContent = TITLES[type] || 'GET IN TOUCH'; cmTitle.hidden = false; }
        if (cmSub)   { cmSub.textContent   = SUBS[type]   || 'FILL IN YOUR DETAILS AND WE\'LL BE IN TOUCH SHORTLY.'; cmSub.hidden = false; }
        const sourceInput = document.getElementById('cf-source');
        if (sourceInput) sourceInput.value = SOURCES[type] || 'Unknown';
        lastFocused = document.activeElement;
        cm.classList.add('active');
        cm.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', trapFocus);
        // Focus first input after transition
        setTimeout(() => {
            const firstInput = cm.querySelector('input:not([type="hidden"]),select,button');
            if (firstInput) firstInput.focus();
        }, 50);
    }

    function closeCM() {
        cm.classList.remove('active');
        cm.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', trapFocus);
        if (cmForm) {
            cmForm.reset();
            cmForm.hidden = false;
            cmForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        }
        if (cmTitle) cmTitle.hidden = false;
        if (cmSub)   cmSub.hidden   = false;
        const successEl = document.getElementById('cf-success');
        if (successEl) successEl.hidden = true;
        const errorMsg = document.getElementById('cf-error-msg');
        if (errorMsg) errorMsg.hidden = true;
        const submitBtn = document.getElementById('cf-submit');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'SUBMIT'; }
        // Return focus to the element that opened the modal
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Wire all [data-modal] triggers on the page
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        const type = trigger.dataset.modal;
        if (!TITLES[type] && !SUBS[type]) return; // unknown type — skip
        trigger.addEventListener('click', e => {
            e.preventDefault();
            openCM(type);
        });
    });

    if (cmClose) cmClose.addEventListener('click', closeCM);
    cm.addEventListener('click', e => { if (e.target === cm) closeCM(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && cm.classList.contains('active')) closeCM();
    });

    // Clear validation errors on input
    if (cmForm) {
        cmForm.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', () => inp.classList.remove('error'));
        });
        cmForm.querySelectorAll('select').forEach(sel => {
            sel.addEventListener('change', () => sel.classList.toggle('has-value', sel.value !== ''));
        });
    }

    // Expose openCM globally so unlock.js can trigger it for locked cards
    window._openContactModal = openCM;
}
