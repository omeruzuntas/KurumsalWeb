document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('back-to-top');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const headerInner = document.querySelector('.header-inner');
  const navLinks = document.querySelectorAll('.site-header nav a');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.metric-card, .feature-card, .service-card, .portfolio-card, .testimonial-card, .team-card, .package-card, .case-card, .pricing-card, .value-card, .contact-card, .client-card, .case-study-card, .blog-card, .social-card, .process-step, .faq-item').forEach(el => {
    observer.observe(el);
  });

  const counterElements = document.querySelectorAll('.metric-card strong');
  let countersAnimated = false;

  window.addEventListener('scroll', () => {
    if (!countersAnimated && window.scrollY > 500) {
      counterElements.forEach(el => {
        const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
        if (!isNaN(target)) {
          animateCounter(el, target);
        }
      });
      countersAnimated = true;
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }
  });

  function animateCounter(element, target) {
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 50));
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(interval);
      } else {
        element.textContent = current;
      }
    }, 20);
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('h3');
    if (!header) return;
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const response = i.querySelector('p');
        if (response) response.style.display = 'none';
      });
      if (!isActive) {
        const answer = item.querySelector('p');
        if (answer) {
          answer.style.display = 'block';
          item.classList.add('active');
        }
      }
    });
  });

  document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
    const cards = wrapper.querySelectorAll('article');
    if (cards.length <= 1) return;
    let currentIndex = 0;
    const prevButton = wrapper.querySelector('.slider-prev');
    const nextButton = wrapper.querySelector('.slider-next');
    let autoAdvance = null;

    function updateSlider() {
      cards.forEach((card, index) => {
        card.style.display = index === currentIndex ? 'block' : 'none';
      });
    }

    function goNext() {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    }

    function goPrev() {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateSlider();
    }

    prevButton?.addEventListener('click', () => {
      goPrev();
      resetAutoAdvance();
    });

    nextButton?.addEventListener('click', () => {
      goNext();
      resetAutoAdvance();
    });

    function resetAutoAdvance() {
      if (autoAdvance) {
        clearInterval(autoAdvance);
      }
      autoAdvance = setInterval(goNext, 6000);
    }

    updateSlider();
    resetAutoAdvance();
  });

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
      darkModeToggle.textContent = '☀️';
    }
  }

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      const expanded = hamburgerMenu.getAttribute('aria-expanded') !== 'true';
      hamburgerMenu.classList.toggle('active');
      headerInner?.classList.toggle('active');
      hamburgerMenu.setAttribute('aria-expanded', String(expanded));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        headerInner?.classList.remove('active');
        hamburgerMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('form[data-contact-form]').forEach(form => {
    const formMessage = document.createElement('div');
    formMessage.className = 'form-message';
    form.insertBefore(formMessage, form.querySelector('button[type="submit"]'));

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFormErrors(form);

      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const messageInput = form.querySelector('textarea[name="message"]');

      const isNameValid = validateField(nameInput, value => value.length >= 3, 'Adınız en az 3 karakter olmalı');
      const isEmailValid = validateField(emailInput, value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Geçerli bir e-posta adresi girin');
      const isMessageValid = validateField(messageInput, value => value.length >= 10, 'Mesajınız en az 10 karakter olmalı');

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showFormMessage('Lütfen formu kontrol edin ve tekrar gönderin.', 'error');
        return;
      }

      const action = form.getAttribute('action') || '';
      const formData = new FormData(form);

      try {
        if (action.includes('formsubmit.co/ajax')) {
          const response = await fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json'
            }
          });
          const result = await response.json();
          if (!response.ok || result.success === false) {
            throw new Error(result.message || 'Mesaj gönderilemedi.');
          }
          showFormMessage('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.', 'success');
          form.reset();
        } else {
          showFormMessage('Form kaydedildi. En kısa sürede dönüş sağlanacaktır.', 'success');
          form.reset();
        }
      } catch (error) {
        showFormMessage('Mesaj gönderimi sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        console.error('Form gönderim hatası:', error);
      }
    });
  });

  function showFormMessage(message, status) {
    document.querySelectorAll('.form-message').forEach(element => {
      element.textContent = message;
      element.classList.toggle('success', status === 'success');
      element.classList.toggle('error', status === 'error');
    });
  }

  function validateField(input, validator, message) {
    if (!input) return false;
    const value = input.value.trim();
    const isValid = validator(value);
    if (!isValid) {
      const errorNode = document.createElement('div');
      errorNode.className = 'error-message';
      errorNode.textContent = message;
      input.classList.add('error');
      input.parentNode.insertBefore(errorNode, input.nextSibling);
    }
    return isValid;
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.error-message').forEach(element => element.remove());
    form.querySelectorAll('.error').forEach(element => element.classList.remove('error'));
  }
});
