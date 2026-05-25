/*
 * SCROLL REVEAL ANIMATIONS
 * Uses Intersection Observer to add 'visible' class to elements
 * when they enter the viewport, triggering CSS animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
});

// Add this CSS class dynamically (or include in style.css)
const style = document.createElement('style');
style.textContent = `
    .reveal-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal-element.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);