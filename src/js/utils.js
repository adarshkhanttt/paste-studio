// ─────────────────────────────────────────────
// UTILS — shared helpers used across modules
// ─────────────────────────────────────────────

export const isDev = import.meta.env?.DEV === true;

/**
 * Debounce: returns a function that delays invoking fn
 * until ms milliseconds after the last call.
 */
export function debounce(fn, ms = 100) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

/**
 * Throttle: returns a function that only invokes fn
 * at most once per ms milliseconds.
 */
export function throttle(fn, ms = 100) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= ms) {
            last = now;
            fn(...args);
        }
    };
}
