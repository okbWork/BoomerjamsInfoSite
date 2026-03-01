const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  document.body.classList.add('page-enter');
  requestAnimationFrame(() => {
    document.body.classList.add('page-enter-active');
  });

  const internalLinks = document.querySelectorAll('a[href$=".html"], a[href*=".html#"]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:')) {
        return;
      }

      const targetUrl = new URL(href, window.location.href);
      if (targetUrl.origin !== window.location.origin || targetUrl.pathname === window.location.pathname && targetUrl.hash) {
        return;
      }

      event.preventDefault();
      document.body.classList.add('page-exit-active');
      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitButton = document.getElementById('contactSubmit');
  const formStatus = document.getElementById('formStatus');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    if (formStatus) {
      formStatus.textContent = 'Submitting your message...';
      formStatus.classList.remove('error');
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      contactForm.classList.add('submitted');
      if (formStatus) {
        formStatus.textContent = 'Your message has been submitted successfully.';
      }

      window.setTimeout(() => {
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.setAttribute('aria-hidden', 'false');
        }
      }, 280);

      contactForm.reset();
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Submission failed. Please email kobbowork@gmail.com directly.';
        formStatus.classList.add('error');
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}
