// ─────────────────────────────────────────────
// SMOOTH SCROLL — custom inertia-based scroll
// ─────────────────────────────────────────────

const LERP_FACTOR = 0.072;
const WHEEL_SCALE = 1.2;

export function initSmoothScroll() {
    let currentY  = window.scrollY;
    let targetY   = window.scrollY;
    let rafId     = null;
    let isRunning = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        const distance = targetY - currentY;
        if (Math.abs(distance) < 0.5) {
            currentY = targetY;
            window.scrollTo(0, currentY);
            isRunning = false;
            rafId = null;
            return;
        }
        currentY = lerp(currentY, targetY, LERP_FACTOR);
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
        if (!isRunning) { isRunning = true; rafId = requestAnimationFrame(tick); }
    }

    function onWheel(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        targetY = Math.min(maxY, Math.max(0, targetY + e.deltaY * WHEEL_SCALE));
        startLoop();
    }

    function onAnchorClick(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const id = anchor.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY;
        targetY = Math.min(
            document.documentElement.scrollHeight - window.innerHeight,
            Math.max(0, offset)
        );
        startLoop();
    }

    function onNativeScroll() {
        if (!isRunning) { currentY = window.scrollY; targetY = window.scrollY; }
    }

    document.documentElement.style.scrollBehavior = 'auto';
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    document.addEventListener('click', onAnchorClick);
}
