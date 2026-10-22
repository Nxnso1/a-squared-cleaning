'use strict';

(() => {
  const hero = document.querySelector('.hero-motion');
  const imageFrame = hero?.querySelector('.hero-image');
  const picture = hero?.querySelector('.hero-image > img');
  if (!hero || !imageFrame || !picture) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let inView = true;

  const render = () => {
    frame = 0;
    if (reducedMotion.matches) {
      hero.style.removeProperty('--hero-progress');
      picture.style.removeProperty('will-change');
      return;
    }
    if (!inView || document.hidden) return;

    const bounds = imageFrame.getBoundingClientRect();
    // The image gently pans and zooms while this section scrolls off screen.
    // Native scrolling is never intercepted and motion reverses when scrolling up.
    const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height)));
    hero.style.setProperty('--hero-progress', progress.toFixed(4));
    picture.style.willChange = 'transform';
  };

  const schedule = () => {
    if (!frame && inView && !document.hidden && !reducedMotion.matches) {
      frame = window.requestAnimationFrame(render);
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else picture.style.removeProperty('will-change');
    }, { rootMargin: '60px 0px' });
    observer.observe(imageFrame);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches) render();
    else schedule();
  });

  render();
})();
