// hubspot.js - HubSpot Forms API integration
const HUBSPOT_PORTAL_ID = '148075234';
const HUBSPOT_FORM_GUID = 'd340404e-783b-4fd6-8063-f982da8150a5';

const HS_FIELDS = {
    first: 'firstname', last: 'lastname', email: 'email',
    mobile: 'phone', country: 'country', role: 'role',
    intent: 'intent', instagram: 'instagram_handle', source: 'form_source'
};

function submitToHubSpot(formData) {
    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;
    const fields = Object.keys(formData)
        .filter(name => formData[name] !== '')
        .map(name => ({ objectTypeId: '0-1', name, value: formData[name] }));

    return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, context: { pageUri: window.location.href, pageName: document.title } })
    }).then(r => {
        if (!r.ok) return r.text().then(body => { throw new Error(`HubSpot API error ${r.status}: ${body}`); });
        return r;
    });
}

export function initHubSpot() {
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('cf-submit');
    const errorMsg  = document.getElementById('cf-error-msg');
    const successEl = document.getElementById('cf-success');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const first     = document.getElementById('cf-first');
        const last      = document.getElementById('cf-last');
        const email     = document.getElementById('cf-email');
        const mobile    = document.getElementById('cf-mobile');
        const country   = document.getElementById('cf-country');
        const role      = document.getElementById('cf-role');
        const intent    = document.getElementById('cf-intent');
        const instagram = document.getElementById('cf-instagram');
        const source    = document.getElementById('cf-source');

        let valid = true;
        [first, last, email].forEach(field => {
            if (!field || !field.value.trim()) { if (field) field.classList.add('error'); valid = false; }
        });
        if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            email.classList.add('error'); valid = false;
        }
        if (!valid) return;

        if (errorMsg) errorMsg.hidden = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING\u2026';

        const formData = {};
        formData[HS_FIELDS.first]     = first.value.trim();
        formData[HS_FIELDS.last]      = last.value.trim();
        formData[HS_FIELDS.email]     = email.value.trim();
        formData[HS_FIELDS.mobile]    = mobile    ? mobile.value.trim()    : '';
        formData[HS_FIELDS.country]   = country   ? country.value          : '';
        formData[HS_FIELDS.role]      = role      ? role.value             : '';
        formData[HS_FIELDS.intent]    = intent    ? intent.value           : '';
        formData[HS_FIELDS.instagram] = instagram ? instagram.value.trim() : '';
        formData[HS_FIELDS.source]    = source    ? (source.value || 'Unknown') : 'Unknown';

        submitToHubSpot(formData).then(() => {
            try {
                localStorage.setItem('dps_gated_email',    formData[HS_FIELDS.email]);
                localStorage.setItem('dps_gated_unlocked', 'true');
            } catch (_) {}
            if (typeof window.dpsUnlockAll === 'function') window.dpsUnlockAll();

            const title = document.getElementById('contact-modal-title');
            const sub   = document.getElementById('contact-modal-sub');
            if (title) title.hidden = true;
            if (sub)   sub.hidden   = true;
            form.hidden = true;
            if (successEl) successEl.hidden = false;

            setTimeout(() => {
                const cm = document.getElementById('contact-modal');
                if (cm) {
                    cm.classList.remove('active');
                    cm.setAttribute('aria-hidden', 'true');
                }
            }, 1500);
        }).catch(err => {
            console.error('[Pasted Studio] HubSpot submission failed:', err);
            if (errorMsg) errorMsg.hidden = false;
            submitBtn.disabled    = false;
            submitBtn.textContent = 'SUBMIT';
        });
    });
}
