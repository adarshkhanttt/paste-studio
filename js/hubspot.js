/* ═══════════════════════════════════════════════════════════════
   PASTED STUDIO — HubSpot Forms API Integration
   Handles submission of the contact / lead-capture form.
═══════════════════════════════════════════════════════════════ */

// ── HubSpot credentials ───────────────────────────────────────────────────────
var HUBSPOT_PORTAL_ID = '148075234';                        // numeric portal ID
var HUBSPOT_FORM_GUID = 'd340404e-783b-4fd6-8063-f982da8150a5'; // form GUID (UUID)

// ── HubSpot field name mapping ────────────────────────────────────────────────
// Values must match HubSpot internal property names exactly (case-sensitive).
var HS_FIELDS = {
    first:     'firstname',         // verify this matches HubSpot internal name
    last:      'lastname',          // verify this matches HubSpot internal name
    email:     'email',             // verify this matches HubSpot internal name
    mobile:    'phone',             // verify this matches HubSpot internal name
    country:   'country',           // verify this matches HubSpot internal name
    role:      'role',              // verify this matches HubSpot internal name
    intent:    'intent',            // verify this matches HubSpot internal name
    instagram: 'instagram_handle',  // verify this matches HubSpot internal name
    source:    'form_source'        // verify this matches HubSpot internal name
};

// ── submitToHubSpot(formData) ─────────────────────────────────────────────────
// Accepts a plain object of { hubspotFieldName: value } pairs (empty values excluded).
// Returns a Promise that resolves on HTTP 200, rejects otherwise.
function submitToHubSpot(formData) {
    var endpoint =
        'https://api.hsforms.com/submissions/v3/integration/submit/' +
        HUBSPOT_PORTAL_ID + '/' +
        HUBSPOT_FORM_GUID;

    // Build the fields array — skip blank optional fields
    var fields = Object.keys(formData)
        .filter(function (name) { return formData[name] !== ''; })
        .map(function (name) {
            return { objectTypeId: '0-1', name: name, value: formData[name] };
        });

    var payload = {
        fields: fields,
        context: {
            pageUri:  window.location.href,
            pageName: document.title
        }
    };

    return fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
    }).then(function (response) {
        if (!response.ok) {
            return response.text().then(function (body) {
                throw new Error('HubSpot API error ' + response.status + ': ' + body);
            });
        }
        return response;
    });
}

// ── Form submission handler ───────────────────────────────────────────────────
(function () {
    var form      = document.getElementById('contact-form');
    var submitBtn = document.getElementById('cf-submit');
    var errorMsg  = document.getElementById('cf-error-msg');
    var successEl = document.getElementById('cf-success');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // ── 1. Collect field values ────────────────────────────────────────
        var first     = document.getElementById('cf-first');
        var last      = document.getElementById('cf-last');
        var email     = document.getElementById('cf-email');
        var mobile    = document.getElementById('cf-mobile');
        var country   = document.getElementById('cf-country');
        var role      = document.getElementById('cf-role');
        var intent    = document.getElementById('cf-intent');
        var instagram = document.getElementById('cf-instagram');
        var source    = document.getElementById('cf-source');

        // ── 2. Validate required fields ───────────────────────────────────
        var valid = true;

        [first, last, email].forEach(function (field) {
            if (!field || !field.value.trim()) {
                if (field) field.classList.add('error');
                valid = false;
            }
        });

        if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            email.classList.add('error');
            valid = false;
        }

        if (!valid) return;

        // ── 3. Hide any previous error message ────────────────────────────
        if (errorMsg) errorMsg.hidden = true;

        // ── 4. Disable submit button to prevent double submissions ─────────
        submitBtn.disabled    = true;
        submitBtn.textContent = 'SENDING…';

        // ── 5. Build the field map ─────────────────────────────────────────
        var formData = {};
        formData[HS_FIELDS.first]     = first.value.trim();
        formData[HS_FIELDS.last]      = last.value.trim();
        formData[HS_FIELDS.email]     = email.value.trim();
        formData[HS_FIELDS.mobile]    = mobile    ? mobile.value.trim()    : '';
        formData[HS_FIELDS.country]   = country   ? country.value          : '';
        formData[HS_FIELDS.role]      = role      ? role.value             : '';
        formData[HS_FIELDS.intent]    = intent    ? intent.value           : '';
        formData[HS_FIELDS.instagram] = instagram ? instagram.value.trim() : '';
        formData[HS_FIELDS.source]    = source    ? (source.value || 'Unknown') : 'Unknown';

        // ── 6. Submit to HubSpot ───────────────────────────────────────────
        submitToHubSpot(formData)
            .then(function () {
                // ── Persist unlock state in localStorage ──────────────────
                try {
                    localStorage.setItem('dps_gated_email',    formData[HS_FIELDS.email]);
                    localStorage.setItem('dps_gated_unlocked', 'true');
                } catch (_) {}

                // ── Unlock all gated videos immediately ───────────────────
                if (typeof window.dpsUnlockAll === 'function') window.dpsUnlockAll();

                // ── Show success state ────────────────────────────────────
                var title = document.getElementById('contact-modal-title');
                var sub   = document.getElementById('contact-modal-sub');
                if (title) title.hidden = true;
                if (sub)   sub.hidden   = true;
                form.hidden = true;
                if (successEl) successEl.hidden = false;

                // ── Close modal after 1.5 s so visitor sees the message ───
                setTimeout(function () {
                    var cm = document.getElementById('contact-modal');
                    if (cm) cm.classList.remove('active');
                }, 1500);
            })
            .catch(function (err) {
                console.error('[Pasted Studio] HubSpot submission failed:', err);
                if (errorMsg) errorMsg.hidden = false;
                submitBtn.disabled    = false;
                submitBtn.textContent = 'SUBMIT';
            });
    });
})();
