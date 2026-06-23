/* ============================================================
   PORTFOLIO — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     DOM REFERENCES
     ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const navbar = $('#navbar');
  const navLinks = $('#navLinks');
  const hamburger = $('#hamburger');
  const themeToggle = $('#themeToggle');
  const scrollTopBtn = $('#scrollTop');
  const typingTextEl = $('#typingText');
  const particleCanvas = $('#particleCanvas');
  const contactForm = $('#contactForm');

  /* ----------------------------------------------------------
     THEME TOGGLE (dark / light)
     ---------------------------------------------------------- */
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ----------------------------------------------------------
     NAVBAR — scroll styling & active link
     ---------------------------------------------------------- */
  const sections = $$('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Scroll-to-top visibility
    scrollTopBtn.classList.toggle('visible', scrollY > 500);

    // Active nav link
    let currentSection = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top) currentSection = sec.id;
    });
    $$('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------- */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     SCROLL TO TOP
     ---------------------------------------------------------- */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     TYPING ANIMATION
     ---------------------------------------------------------- */
  const typingPhrases = ['Web Developer', 'UI/UX Enthusiast', 'Problem Solver'];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPING_SPEED = 90;
  const DELETING_SPEED = 50;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_AFTER_DELETE = 400;

  function typeEffect() {
    const current = typingPhrases[phraseIdx];
    if (!isDeleting) {
      typingTextEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(typeEffect, TYPING_SPEED);
    } else {
      typingTextEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % typingPhrases.length;
        setTimeout(typeEffect, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(typeEffect, DELETING_SPEED);
    }
  }

  typeEffect();

  /* ----------------------------------------------------------
     PARTICLE BACKGROUND (hero)
     ---------------------------------------------------------- */
  const ctx = particleCanvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECT_DISTANCE = 120;

  function resizeCanvas() {
    particleCanvas.width = particleCanvas.parentElement.offsetWidth;
    particleCanvas.height = particleCanvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 0.5,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    const theme = document.documentElement.getAttribute('data-theme');
    const particleColor = theme === 'light' ? '0, 85, 221' : '0, 102, 255';
    const lineColor = theme === 'light' ? '0, 85, 221' : '0, 102, 255';

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + particleColor + ', 0.5)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle =
            'rgba(' + lineColor + ',' + (1 - dist / CONNECT_DISTANCE) * 0.15 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealElements = $$('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     COUNTER ANIMATION (hero stats)
     ---------------------------------------------------------- */
  const counters = $$('.stat-number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let count = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(interval);
            }
            el.textContent = count;
          }, 40);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* ----------------------------------------------------------
     PROJECT FILTERS
     ---------------------------------------------------------- */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });

  /* ----------------------------------------------------------
     CONTACT FORM (simulated send)
     ---------------------------------------------------------- */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sendBtn = $('.btn-send', contactForm);
    sendBtn.classList.add('sending');

    setTimeout(() => {
      sendBtn.classList.remove('sending');
      sendBtn.classList.add('sent');
      contactForm.reset();

      setTimeout(() => {
        sendBtn.classList.remove('sent');
      }, 2500);
    }, 1500);
  });

  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLL (fallback for older browsers)
     ---------------------------------------------------------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
