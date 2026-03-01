const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Page enter/exit transitions for internal links.
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
    if (targetUrl.origin !== window.location.origin) {
      return;
    }

    if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
      return;
    }

    event.preventDefault();
    document.body.classList.add('page-exit-active');
    window.setTimeout(() => {
      window.location.href = href;
    }, 220);
  });
});

// Smooth reveal on scroll.
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const contactPanel = document.getElementById('contactPanel');
  const submitButton = document.getElementById('contactSubmit');
  const testSubmitButton = document.getElementById('testSubmit');
  const revertSubmitButton = document.getElementById('revertSubmit');
  const formStatus = document.getElementById('formStatus');
  const formSuccess = document.getElementById('formSuccess');
  const successText = document.getElementById('successText');

  const showSuccess = (message) => {
    contactPanel?.classList.add('is-submitted');
    formSuccess?.classList.add('visible');
    formSuccess?.setAttribute('aria-hidden', 'false');
    if (successText) successText.textContent = message;
  };

  const resetToNormalMode = () => {
    contactForm.reset();
    contactPanel?.classList.remove('is-submitted');
    formSuccess?.classList.remove('visible');
    formSuccess?.setAttribute('aria-hidden', 'true');

    if (formStatus) {
      formStatus.textContent = '';
      formStatus.classList.remove('error');
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  };

  const openMailClientFallback = () => {
    const name = document.getElementById('name')?.value ?? '';
    const email = document.getElementById('email')?.value ?? '';
    const message = document.getElementById('message')?.value ?? '';

    const subject = encodeURIComponent('kobbo Portfolio Contact');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:kobbowork@gmail.com?subject=${subject}&body=${body}`;
  };

  testSubmitButton?.addEventListener('click', () => {
    showSuccess('Test mode: successful submission animation triggered. Use Revert to return to normal email submission.');
  });

  revertSubmitButton?.addEventListener('click', resetToNormalMode);

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
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Submit failed with status ${response.status}`);
      }

      contactForm.reset();
      showSuccess("Your message has been sent successfully. I'll get back to you soon.");
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Could not confirm web submission. Opening your email app as backup...';
        formStatus.classList.add('error');
      }

      openMailClientFallback();
      showSuccess('A draft email has been opened so you can finish sending your message to kobbowork@gmail.com.');
    }
  });
}
