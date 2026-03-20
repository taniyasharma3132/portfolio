'use strict';

// ── 1. Simple Dot Cursor ──────────────────────────────────────────────
(function initCursor() {
  const dot = document.getElementById('dot-cursor');
  if (!dot) return;

  let x = 0, y = 0;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
  });

  // Grow on interactive elements
  const targets = document.querySelectorAll('a, button, .skill-pill, .project-item, input, textarea, .filter-chip');
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovered'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovered'));
  });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
})();


// ── 2. Canvas — subtle drifting lines ───────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Nodes for a gentle constellation effect
  const nodes = [];
  const N = 55;
  const MAX_DIST = 140;

  for (let i = 0; i < N; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Lines between nearby nodes
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.07;
          ctx.strokeStyle = `rgba(232,255,71,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(232,255,71,0.12)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();


// ── 3. Hero heading entrance animation ──────────────────────────────
(function initHeroText() {
  const words = document.querySelectorAll('.line-word');
  words.forEach((w, i) => {
    w.style.opacity = '0';
    w.style.transform = 'translateY(24px)';
    w.style.display = 'block';
    setTimeout(() => {
      w.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      w.style.opacity = '1';
      w.style.transform = 'translateY(0)';
    }, 200 + i * 140);
  });

  // Status badge
  const badge = document.querySelector('.hero-status');
  if (badge) {
    badge.style.opacity = '0';
    setTimeout(() => {
      badge.style.transition = 'opacity 0.5s ease';
      badge.style.opacity = '1';
    }, 100);
  }

  // Bio strip
  const strip = document.querySelector('.hero-bio-strip');
  if (strip) {
    strip.style.opacity = '0';
    strip.style.transform = 'translateY(20px)';
    setTimeout(() => {
      strip.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      strip.style.opacity = '1';
      strip.style.transform = 'translateY(0)';
    }, 700);
  }

  // Actions
  const actions = document.querySelector('.hero-actions');
  if (actions) {
    actions.style.opacity = '0';
    setTimeout(() => {
      actions.style.transition = 'opacity 0.6s ease';
      actions.style.opacity = '1';
    }, 650);
  }

  // Photo card
  const photo = document.querySelector('.hero-photo-card');
  if (photo) {
    photo.style.opacity = '0';
    photo.style.transform = 'translateY(30px)';
    setTimeout(() => {
      photo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      photo.style.opacity = '1';
      photo.style.transform = 'translateY(0)';
    }, 300);
  }
})();


// ── 4. Navbar ────────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-to-top');
  const links = document.querySelectorAll('.nav-link[data-s]');
  const secs = document.querySelectorAll('section[id]');

  function onScroll() {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 40);
    if (backTop) backTop.classList.toggle('visible', sy > 500);

    let current = '';
    secs.forEach(sec => {
      if (sy >= sec.offsetTop - 130) current = sec.id;
    });
    links.forEach(l => l.classList.toggle('active', l.dataset.s === current));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


// ── 5. Hamburger ─────────────────────────────────────────────────────
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


// ── 6. Theme Toggle ──────────────────────────────────────────────────
(function initTheme() {
  const btn = document.getElementById('theme-btn');
  const moon = document.getElementById('moon-icon');
  const sun = document.getElementById('sun-icon');
  if (!btn) return;

  // Load saved theme (default: dark)
  let dark = localStorage.getItem('theme') !== 'light';
  function applyTheme() {
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
    moon.style.display = dark ? 'block' : 'none';
    sun.style.display = dark ? 'none' : 'block';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  applyTheme();

  btn.addEventListener('click', () => {
    dark = !dark;
    applyTheme();
  });
})();


// ── 7. Scroll Reveal ────────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => io.observe(el));
})();


// ── 8. Project Filter ────────────────────────────────────────────────
(function initFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const items = document.querySelectorAll('.project-item');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;

      items.forEach(item => {
        const match = f === 'all' || item.dataset.category === f;
        if (match) {
          item.classList.remove('hidden');
          item.style.animation = 'rowIn 0.35s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// Row animation keyframe
const s1 = document.createElement('style');
s1.textContent = `@keyframes rowIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }`;
document.head.appendChild(s1);


// ── 9. Contact Form ──────────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.style.display = 'none';
      success.style.display = 'flex';
      form.reset();
      setTimeout(() => {
        success.style.display = 'none';
        btn.style.display = '';
        btn.disabled = false;
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Send Message`;
      }, 4500);
    }, 1600);
  });
})();


console.log('%c🟡 Taniya Sharma Portfolio', 'color:#e8ff47;font-size:16px;font-weight:bold;');
