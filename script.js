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
  const sloganTextEl = $('#sloganText');
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
     SLOGAN TYPING ANIMATION
     Type → pause 2s → delete → pause 0.5s → repeat
     ---------------------------------------------------------- */
  const SLOGAN = 'Where Your Vision Becomes Reality';
  const TYPE_SPEED = 70;
  const DELETE_SPEED = 40;
  const PAUSE_FULL = 2000;
  const PAUSE_EMPTY = 500;
  let sloganIdx = 0;
  let sloganDeleting = false;

  function sloganType() {
    if (!sloganTextEl) return;
    if (!sloganDeleting) {
      sloganIdx++;
      sloganTextEl.textContent = SLOGAN.substring(0, sloganIdx);
      if (sloganIdx === SLOGAN.length) {
        sloganDeleting = true;
        setTimeout(sloganType, PAUSE_FULL);
        return;
      }
      setTimeout(sloganType, TYPE_SPEED);
    } else {
      sloganIdx--;
      sloganTextEl.textContent = SLOGAN.substring(0, sloganIdx);
      if (sloganIdx === 0) {
        sloganDeleting = false;
        setTimeout(sloganType, PAUSE_EMPTY);
        return;
      }
      setTimeout(sloganType, DELETE_SPEED);
    }
  }

  sloganType();

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
