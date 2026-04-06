// ─────────────────────────────────────────────
// STUDIO — city hover/activation + mobile auto-cycle
// Only runs on pages that have #studioCities
// ─────────────────────────────────────────────

export function initStudio() {
    const cities = document.querySelectorAll('#studioCities .studio-city');
    const slots  = document.querySelectorAll('#studioImgStrip .studio-strip-img');
    if (!cities.length || !slots.length) return;

    function getPlayer(slot) {
        return slot.querySelector('.studio-strip-player');
    }

    function activate(cityKey) {
        cities.forEach(c => c.classList.toggle('active', c.dataset.city === cityKey));
        slots.forEach(s => {
            const isActive = s.dataset.city === cityKey;
            s.classList.toggle('active', isActive);
            const player = getPlayer(s);
            if (!player) return;
            if (isActive) {
                if (typeof player.play === 'function') player.play();
            } else {
                if (typeof player.pause === 'function') player.pause();
            }
        });
    }

    // Start the first (active) video on load
    window.addEventListener('load', () => {
        const firstSlot = document.querySelector('#studioImgStrip .studio-strip-img.active');
        if (firstSlot) {
            const p = getPlayer(firstSlot);
            if (p && typeof p.play === 'function') p.play();
        }

        // Mobile-only: auto-cycle London → New York → LA every 2.5s
        if (window.innerWidth <= 640) {
            const slotList = Array.from(slots);
            let current = 0;

            function playSlot(index) {
                slotList.forEach(s => {
                    const p = getPlayer(s);
                    if (p && typeof p.pause === 'function') p.pause();
                });
                const p = getPlayer(slotList[index]);
                if (p && typeof p.play === 'function') p.play();
            }

            // Wait for Wistia to initialise before starting
            setTimeout(() => {
                playSlot(0);
                setInterval(() => {
                    current = (current + 1) % slotList.length;
                    playSlot(current);
                }, 2500);
            }, 1500);
        }
    }, { once: true });

    // Desktop hover
    cities.forEach(c => {
        c.addEventListener('mouseenter', () => activate(c.dataset.city));
    });

    const citiesWrap = document.getElementById('studioCities');
    if (citiesWrap) {
        citiesWrap.addEventListener('mouseleave', () => {
            slots.forEach(s => {
                const player = getPlayer(s);
                if (player && typeof player.pause === 'function') player.pause();
                s.classList.remove('active');
            });
            cities.forEach(c => c.classList.remove('active'));
        });
    }
}
