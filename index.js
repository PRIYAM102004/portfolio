/* =========================================================
   Priyadharshini M — Portfolio Script
   Handles: mobile nav, active-link highlighting, scroll
   reveal animations, back-to-top button, contact form
   validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu after a link is tapped
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll cue on hero ---------- */
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Active nav-link highlighting ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .about-grid, .timeline-item, .skill-card, .project-card, .cert-card, .contact-grid'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener(
      'scroll',
      () => backToTop.classList.toggle('visible', window.scrollY > 480),
      { passive: true }
    );
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    const fields = {
      name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
      email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
      subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
      message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (key) => {
      const { el, error } = fields[key];
      const value = el.value.trim();
      let message = '';

      if (!value) {
        message = 'This field is required.';
      } else if (key === 'email' && !emailPattern.test(value)) {
        message = 'Please enter a valid email address.';
      } else if (key === 'message' && value.length < 10) {
        message = 'Message should be at least 10 characters.';
      }

      error.textContent = message;
      el.closest('.form-row').classList.toggle('invalid', Boolean(message));
      return !message;
    };

    Object.keys(fields).forEach((key) => {
      fields[key].el.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.textContent = '';

      const allValid = Object.keys(fields)
        .map(validateField)
        .every(Boolean);

      if (!allValid) return;

      // No backend is connected — this only simulates a successful send.
      formSuccess.textContent = "Thanks! This is a demo form, so nothing was actually sent — connect a backend or service like Formspree/EmailJS to receive real messages.";
      form.reset();
    });
  }

});