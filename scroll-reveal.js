'use strict';

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const groups = [
    { selector: '.values-strip > div', stagger: 70 },
    { selector: '.section-heading .eyebrow', direction: 'left' },
    { selector: '.service-tabs' },
    { selector: '.service-panel' },
    { selector: '.steps > article', stagger: 90 },
    { selector: '.about-art', direction: 'left' },
    { selector: '.about-copy > .eyebrow', direction: 'right' },
    { selector: '.founders > div', stagger: 80 },
    { selector: '.plan-copy > .eyebrow', direction: 'left' },
    { selector: '.launch-note' },
    { selector: '.planner', direction: 'right' },
    { selector: '.faq .eyebrow', direction: 'left' },
    { selector: '.faq-list > details', stagger: 55 },
    { selector: '.footer-top > *', stagger: 70 },
    { selector: '.footer-bottom' }
  ];

  const pending = new Set();
  let observer;

  const reveal = (element, immediate = false) => {
    if (immediate) element.classList.add('reveal-immediate');
    element.classList.remove('reveal-pending');
    pending.delete(element);
    observer?.unobserve(element);
  };

  const revealAll = () => {
    for (const element of pending) reveal(element, true);
    observer?.disconnect();
  };

  try {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });

    for (const group of groups) {
      document.querySelectorAll(group.selector).forEach((element, index) => {
        // Already visible or previously scrolled content must never blink on load.
        const bounds = element.getBoundingClientRect();
        if (bounds.height > 0 && bounds.top < window.innerHeight - 30) return;
        element.dataset.scrollReveal = group.direction || 'up';
        element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * (group.stagger || 0)}ms`);
        pending.add(element);
        element.classList.add('reveal-pending');
        observer.observe(element);
      });
    }
  } catch {
    // If enhancement fails, every section stays available.
    revealAll();
    return;
  }

  document.addEventListener('focusin', event => {
    const element = event.target.closest?.('[data-scroll-reveal]');
    if (element) reveal(element, true);
  });

  reducedMotion.addEventListener('change', event => {
    if (event.matches) revealAll();
  });

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    for (const element of pending) {
      const bounds = element.getBoundingClientRect();
      if (bounds.height > 0 && bounds.top < window.innerHeight) reveal(element, true);
    }
  });
})();
