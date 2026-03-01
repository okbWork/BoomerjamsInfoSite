const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Simple page enter/exit transition for internal HTML navigation.
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
    if (contactPanel) {
      contactPanel.classList.add('is-submitted');
    }

    if (formSuccess) {
      formSuccess.classList.add('visible');
      formSuccess.setAttribute('aria-hidden', 'false');
    }

    if (successText) {
      successText.textContent = message;
    }
  };

  const resetToNormalMode = () => {
    contactForm.reset();

    if (contactPanel) {
      contactPanel.classList.remove('is-submitted');
    }

    if (formSuccess) {
      formSuccess.classList.remove('visible');
      formSuccess.setAttribute('aria-hidden', 'true');
    }

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

    const subject = encodeURIComponent('Boomerjams Portfolio Contact');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:kobbowork@gmail.com?subject=${subject}&body=${body}`;
  };

  if (testSubmitButton) {
    testSubmitButton.addEventListener('click', () => {
      showSuccess('Test mode: successful submission animation triggered. Use Revert to return to normal email submission.');
    });
  }

  if (revertSubmitButton) {
    revertSubmitButton.addEventListener('click', resetToNormalMode);
  }

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

      showSuccess("Your message has been sent successfully. I'll get back to you soon.");
      contactForm.reset();
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Could not confirm web submission. Opening your email app as a backup...';
        formStatus.classList.add('error');
      }

      openMailClientFallback();
      showSuccess('A draft email has been opened so you can finish sending your message to kobbowork@gmail.com.');
    }
  });
}
