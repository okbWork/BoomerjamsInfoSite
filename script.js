const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Page enter/exit transitions for internal links.
document.body.classList.add('page-enter');
requestAnimationFrame(() => {
  document.body.classList.add('page-enter-active');
});

const internalLinks = document.querySelectorAll('a[href]');
internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
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


// Add reveal animation classes to privacy policy sections.
const policyMain = document.querySelector('.policy');
if (policyMain) {
  const policyBlocks = policyMain.querySelectorAll('h2, h3, h4, p, ul');
  policyBlocks.forEach((block) => block.classList.add('reveal'));
}

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
    window.location.href = `mailto:kob@kobbo.net?subject=${subject}&body=${body}`;
  };


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
      showSuccess('A draft email has been opened so you can finish sending your message to kob@kobbo.net.');
    }
  });
}


const deletionForm = document.getElementById('deletionRequestForm');
if (deletionForm) {
  const deletionSubmit = document.getElementById('deletionSubmit');
  const deletionStatus = document.getElementById('deletionStatus');

  deletionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!deletionForm.checkValidity()) {
      deletionForm.reportValidity();
      return;
    }

    if (deletionSubmit) {
      deletionSubmit.disabled = true;
      deletionSubmit.textContent = 'Submitting...';
    }

    if (deletionStatus) {
      deletionStatus.textContent = 'Submitting deletion request...';
      deletionStatus.classList.remove('error');
    }

    try {
      const response = await fetch(deletionForm.action, {
        method: 'POST',
        body: new FormData(deletionForm),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Submit failed with status ${response.status}`);
      }

      deletionForm.reset();
      if (deletionStatus) {
        deletionStatus.textContent = 'Deletion request submitted successfully. We will follow up at your account email.';
      }
    } catch (error) {
      if (deletionStatus) {
        deletionStatus.textContent = 'Could not confirm web submission. Please email kob@kobbo.net with your Firebase UID and account email.';
        deletionStatus.classList.add('error');
      }
    } finally {
      if (deletionSubmit) {
        deletionSubmit.disabled = false;
        deletionSubmit.textContent = 'Submit Deletion Request';
      }
    }
  });
}
