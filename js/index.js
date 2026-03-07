/* ============================================================
   ARENA 24 — INDEX.JS
   Hero particles, stat counters, ticker, game pill filter
   ============================================================ */

/* ── HERO PARTICLES ── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 28;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    const size  = Math.random() * 3 + 1;
    const x     = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur   = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.25 + 0.05;

    p.style.cssText = `
      position:absolute;
      left:${x}%;
      bottom:-10px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:rgba(255,107,0,${opacity});
      animation: particleRise ${dur}s ${delay}s linear infinite;
      pointer-events:none;
    `;
    container.appendChild(p);
  }

  if (!document.getElementById('particleStyle')) {
    const s = document.createElement('style');
    s.id = 'particleStyle';
    s.textContent = `
      @keyframes particleRise {
        0%   { transform: translateY(0) scale(1);   opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 0.6; }
        100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* ── ANIMATED STAT COUNTERS ── */
(function animateCounters() {
  const targets = [
    { selector: '.stat-num', values: ['12,400+', '₹8.5L+', '340+'] }
  ];

  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const numericValues = [12400, 850000, 340];
  const formats = [
    n => n.toLocaleString('en-IN') + '+',
    n => '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + 'L+' : n.toLocaleString('en-IN')),
    n => n + '+'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      statNums.forEach((el, i) => {
        if (!numericValues[i]) return;
        const target = numericValues[i];
        const format = formats[i];
        let current  = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = format(current);
          if (current >= target) clearInterval(timer);
        }, 25);
      });
    });
  }, { threshold: 0.3 });

  if (statNums[0]) observer.observe(statNums[0]);
})();

/* ── LIVE TICKER PAUSE ON HOVER ── */
(function tickerHover() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;
  const track = inner.parentElement;
  if (!track) return;
  track.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
})();

/* ── GAME PILLS FILTER ── */
(function gamePills() {
  const pills = document.querySelectorAll('.game-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
})();

/* ── HERO CTA SCROLL ARROW ── */
(function heroArrow() {
  const btn = document.querySelector('.btn-primary.btn-xl');
  if (!btn) return;
  btn.addEventListener('mouseenter', () => {
    const arrow = btn.querySelector('.btn-arrow');
    if (arrow) arrow.style.transform = 'translateX(5px)';
  });
  btn.addEventListener('mouseleave', () => {
    const arrow = btn.querySelector('.btn-arrow');
    if (arrow) arrow.style.transform = '';
  });
})();

/* ── SCROLL REVEAL ANIMATION ── */
(function scrollReveal() {
  const revealEls = document.querySelectorAll(
    '.t-card, .step-card, .lb-row:not(.lb-header), .stat-item'
  );
  if (!revealEls.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity .5s ease, transform .5s ease; }
    .reveal-visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  revealEls.forEach(el => el.classList.add('reveal-hidden'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.remove('reveal-hidden');
          entry.target.classList.add('reveal-visible');
        }, i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => obs.observe(el));
})();
