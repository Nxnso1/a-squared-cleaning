'use strict';

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const selectors = [
    'main h2', '.section-heading > p', '.service-description h3',
    '.service-description > p:not(.service-label)', '.steps h3', '.steps p',
    '.about-copy > p:not(.eyebrow)', '.plan-copy > p:not(.eyebrow)',
    '#cleaning-form h3'
  ];
  const records = new Map();
  const active = new Set();
  let observer;
  let frame = 0;
  let stopped = false;
  const clamp = value => Math.max(0, Math.min(1, value));

  const finish = record => {
    record.words.forEach(word => {
      word.style.removeProperty('--word-opacity');
      word.style.removeProperty('--word-rise');
    });
    record.progress = 1;
    active.delete(record);
    records.delete(record.element);
    observer?.unobserve(record.element);
  };

  const stop = () => {
    stopped = true;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    for (const record of records.values()) finish(record);
    observer?.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };

  const render = () => {
    frame = 0;
    if (stopped || document.hidden) return;
    for (const record of active) {
      const bounds = record.element.getBoundingClientRect();
      if (bounds.height === 0) continue;
      const start = window.innerHeight * .92;
      const end = window.innerHeight * .58 - Math.min(bounds.height, 180) * .25;
      const progress = Math.max(record.progress, clamp((start - bounds.top) / Math.max(1, start - end)));
      if (progress >= 1) { finish(record); continue; }
      if (Math.abs(progress - record.progress) < .003) continue;
      record.progress = progress;
      record.words.forEach((word, index) => {
        const value = clamp((progress * (record.words.length + 2) - index) / 3);
        word.style.setProperty('--word-opacity', (.2 + .8 * value).toFixed(3));
        word.style.setProperty('--word-rise', `${((1 - value) * 5).toFixed(2)}px`);
      });
    }
    if (!records.size) stop();
  };

  function schedule() {
    if (!frame && !stopped && active.size && !document.hidden) {
      frame = window.requestAnimationFrame(render);
    }
  }

  try {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const record = records.get(entry.target);
        if (!record) continue;
        if (entry.isIntersecting) active.add(record);
        else active.delete(record);
      }
      schedule();
    }, { rootMargin: '120px 0px', threshold: 0 });

    document.querySelectorAll(selectors.join(',')).forEach(element => {
      const bounds = element.getBoundingClientRect();
      // Keep anything already in the reading area fully visible at page load.
      if (bounds.height > 0 && bounds.top < window.innerHeight * .85) return;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      const words = [];
      const record = { element, words, progress: -1 };
      records.set(element, record);
      for (const node of textNodes) {
        const fragment = document.createDocumentFragment();
        for (const token of node.textContent.split(/(\s+)/)) {
          if (!token) continue;
          if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
          else {
            const word = document.createElement('span');
            word.className = 'scroll-word';
            word.textContent = token;
            word.style.setProperty('--word-opacity', '.2');
            word.style.setProperty('--word-rise', '5px');
            words.push(word);
            fragment.append(word);
          }
        }
        node.replaceWith(fragment);
      }
      if (!words.length) { records.delete(element); return; }
      observer.observe(element);
    });
  } catch {
    stop();
    return;
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('focusin', event => {
    const planner = event.target.closest?.('.planner');
    if (planner) {
      for (const record of records.values()) {
        if (planner.contains(record.element)) finish(record);
      }
    }
  });
  reducedMotion.addEventListener('change', event => { if (event.matches) stop(); });
})();
