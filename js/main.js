(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header scroll state ---------- */
  function initHeader(){
    const header = document.getElementById('site-header');
    if(!header) return;
    const onScroll = () => {
      if(window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const hamburger = header.querySelector('.hamburger');
    const mobileNav = header.querySelector('.mobile-nav');
    if(hamburger && mobileNav){
      hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('is-open');
        mobileNav.classList.toggle('is-open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          hamburger.classList.remove('is-open');
          mobileNav.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ---------- scroll reveals (reveal, process-step, step-card, process-rail) ---------- */
  function initReveals(){
    const targets = document.querySelectorAll('.reveal, .process-step, .step-card, .process-rail');
    if(!targets.length) return;
    if(reduceMotion){ targets.forEach(t => t.classList.add('in-view')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .18, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- animated counters ---------- */
  function initCounters(){
    const counters = document.querySelectorAll('[data-count]');
    if(!counters.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      if(reduceMotion){ el.textContent = target + suffix; return; }
      function tick(now){
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: .6 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- lightweight bubble background for hero ---------- */
  function initBubbles(){
    const canvas = document.getElementById('bubble-canvas');
    if(!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    let w, h, bubbles;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function makeBubbles(){
      const count = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 26000);
      bubbles = Array.from({ length: Math.min(count, 46) }, () => ({
        x: Math.random() * w,
        y: h + Math.random() * h,
        r: (6 + Math.random() * 16) * devicePixelRatio,
        speed: (0.25 + Math.random() * 0.6) * devicePixelRatio,
        drift: (Math.random() - 0.5) * 0.4,
        alpha: 0.08 + Math.random() * 0.14
      }));
    }
    function draw(){
      ctx.clearRect(0, 0, w, h);
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(b.y * 0.01) * b.drift;
        if(b.y < -b.r){ b.y = h + b.r; b.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${b.alpha})`;
        ctx.lineWidth = 1.4 * devicePixelRatio;
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    }
    resize();
    makeBubbles();
    draw();
    window.addEventListener('resize', () => { resize(); makeBubbles(); }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if(window.KaberiPartials){
      window.KaberiPartials.mount(document.body.dataset.page || '');
    }
    initHeader();
    initReveals();
    initCounters();
    initBubbles();
    if(window.KaberiForms) window.KaberiForms.init();
    if(window.ProductFrameAnimation) window.ProductFrameAnimation.mountAll();
  });
})();
