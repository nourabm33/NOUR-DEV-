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
     HERO 3D PARALLAX — cursor-reactive card tilt
     ---------------------------------------------------------- */
  const heroScene = $('#hero3dScene');
  const heroCard = $('#heroCard3d');

  if (heroScene && heroCard) {
    const MAX_TILT = 8;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let rafId = null;
    let isHovering = false;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animateCard() {
      const ease = isHovering ? 0.08 : 0.04;
      currentRotateX = lerp(currentRotateX, targetRotateX, ease);
      currentRotateY = lerp(currentRotateY, targetRotateY, ease);

      if (Math.abs(currentRotateX - targetRotateX) > 0.01 ||
          Math.abs(currentRotateY - targetRotateY) > 0.01) {
        heroCard.style.transform =
          'translateY(' + (isHovering ? '-4px' : '0') + ') ' +
          'rotateX(' + currentRotateX + 'deg) ' +
          'rotateY(' + currentRotateY + 'deg)';
        heroCard.style.animationPlayState = 'paused';
      } else if (!isHovering) {
        heroCard.style.transform = '';
        heroCard.style.animationPlayState = '';
      }

      rafId = requestAnimationFrame(animateCard);
    }

    heroScene.addEventListener('mousemove', function (e) {
      const rect = heroScene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetRotateY = (x - 0.5) * MAX_TILT * 2;
      targetRotateX = (0.5 - y) * MAX_TILT * 2;
      isHovering = true;
    });

    heroScene.addEventListener('mouseleave', function () {
      targetRotateX = 0;
      targetRotateY = 0;
      isHovering = false;
    });

    /* Touch parallax for mobile */
    heroScene.addEventListener('touchmove', function (e) {
      const touch = e.touches[0];
      const rect = heroScene.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      targetRotateY = (x - 0.5) * MAX_TILT;
      targetRotateX = (0.5 - y) * MAX_TILT;
      isHovering = true;
    }, { passive: true });

    heroScene.addEventListener('touchend', function () {
      targetRotateX = 0;
      targetRotateY = 0;
      isHovering = false;
    });

    rafId = requestAnimationFrame(animateCard);
  }

  /* ----------------------------------------------------------
     COUNTER ANIMATION (for any stat-number elements)
     ---------------------------------------------------------- */
  const counters = $$('.stat-number');
  if (counters.length) {
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
  }

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
