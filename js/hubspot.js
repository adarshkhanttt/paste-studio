/* ═══════════════════════════════════════════════════════════════
   PASTED STUDIO — HubSpot Forms API Integration
   Handles submission of the contact / lead-capture form.
═══════════════════════════════════════════════════════════════ */

// ── HubSpot credentials ───────────────────────────────────────────────────────
var HUBSPOT_PORTAL_ID = '148075234';
var HUBSPOT_FORM_GUID = 'd340404e-783b-4fd6-8063-f982da8150a5';

// ── submitToHubSpot(formData) ─────────────────────────────────────────────────
// Accepts a plain object of { hubspotFieldName: value } pairs.
// Builds the HubSpot payload and POSTs it to the Forms API.
// Returns a Promise that resolves on HTTP 200, rejects otherwise.
function submitToHubSpot(formData) {
    var endpoint =
        'https://api.hsforms.com/submissions/v3/integration/submit/' +
        HUBSPOT_PORTAL_ID + '/' +
        HUBSPOT_FORM_GUID;

    // Build the fields array HubSpot expects
    var fields = Object.keys(formData).map(function (name) {
        return {
            objectTypeId: '0-1',
            name:  name,
            value: formData[name]
        };
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
            // Read the error body for debugging, then reject
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

    // ── Success state ──────────────────────────────────────────────────────
    // To customise the success message, edit the #cf-success block in the HTML.
    var successEl = document.getElementById('cf-success');
    // ──────────────────────────────────────────────────────────────────────

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

        // ── 2. Validate required fields ───────────────────────────────────
        var valid = true;

        [first, email].forEach(function (field) {
            if (!field.value.trim()) {
                field.classList.add('error');
                valid = false;
            }
        });

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            email.classList.add('error');
            valid = false;
        }

        if (!valid) return;

        // ── 3. Hide any previous error message ────────────────────────────
        if (errorMsg) errorMsg.hidden = true;

        // ── 4. Disable submit button to prevent double submissions ─────────
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING…';

        // ── 5. Build the field map (HubSpot internal names) ───────────────
        var formData = {
            firstname:        first.value.trim(),
            lastname:         last.value.trim(),
            email:            email.value.trim(),
            phone:            mobile.value.trim(),
            country:          country.value,
            role:             role.value,
            intent:           intent.value,
            instagram_handle: instagram.value.trim()
        };

        // ── 6. Submit to HubSpot ───────────────────────────────────────────
        submitToHubSpot(formData)
            .then(function () {
                // ── Success: hide title, subheading, and form — show success message ──
                var title = document.getElementById('contact-modal-title');
                var sub   = document.getElementById('contact-modal-sub');
                if (title) title.hidden = true;
                if (sub)   sub.hidden   = true;
                form.hidden = true;
                if (successEl) successEl.hidden = false;
            })
            .catch(function (err) {
                // ── Failure: log full error, show inline message, re-enable button
                console.error('[Pasted Studio] HubSpot submission failed:', err);

                if (errorMsg) errorMsg.hidden = false;

                submitBtn.disabled = false;
                submitBtn.textContent = 'SUBMIT';
            });
    });
})();
