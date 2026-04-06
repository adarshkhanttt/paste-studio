/**
 * Reveal on scroll — shared across all pages.
 * Adds `.visible` to any `.reveal` element when it enters the viewport.
 */
(function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '-30px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });
})();
