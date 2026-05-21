document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const backToTop = document.getElementById('back-to-top');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const hamburgerMenu = document.querySelector('.hamburger-menu');

  // Scroll Animasyonları - Kartları görünüme geçerken fade-in yapar
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.metric-card, .feature-card, .service-card, .portfolio-card, .testimonial-card, .team-card, .package-card, .case-card, .pricing-card, .value-card, .contact-card, .client-card, .case-study-card').forEach(el => {
    observer.observe(el);
  });

  // Canlı Sayaç Animasyonu
  const counterElements = document.querySelectorAll('.metric-card strong');
  let hasAnimated = false;

  window.addEventListener('scroll', function () {
    if (!hasAnimated && window.scrollY > 800) {
      counterElements.forEach(el => {
        const target = parseInt(el.textContent);
        if (!isNaN(target)) {
          animateCounter(el, target);
        }
      });
      hasAnimated = true;
    }
  });

  function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(interval);
      } else {
        element.textContent = current;
      }
    }, 30);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('h3');
    if (header) {
      header.style.cursor = 'pointer';
      header.addEventListener('click', function () {
        const answer = item.querySelector('p');
        if (answer.style.display === 'none' || answer.style.display === '') {
          answer.style.display = 'block';
          item.classList.add('active');
        } else {
          answer.style.display = 'none';
          item.classList.remove('active');
        }
      });
    }
  });

  // Testimonial Slider
  const testimonialSlider = initializeSlider('.testimonial-grid');
  if (testimonialSlider) {
    setInterval(() => {
      testimonialSlider.next();
    }, 5000);
    
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    if (prevBtn) prevBtn.addEventListener('click', () => testimonialSlider.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => testimonialSlider.next());
  }

  // Portfolio Slider
  const portfolioSlider = initializeSlider('.portfolio-grid');
  if (portfolioSlider) {
    const prevBtn = document.getElementById('prev-portfolio');
    const nextBtn = document.getElementById('next-portfolio');
    if (prevBtn) prevBtn.addEventListener('click', () => portfolioSlider.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => portfolioSlider.next());
  }

  function initializeSlider(selector) {
    const container = document.querySelector(selector);
    if (!container) return null;
    const cards = container.querySelectorAll('article');
    if (cards.length <= 3) return null;

    let currentIndex = 0;
    const slider = {
      next: () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
      },
      prev: () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
      }
    };

    function updateSlider() {
      cards.forEach((card, i) => {
        card.style.display = i === currentIndex ? 'block' : 'none';
      });
    }

    updateSlider();
    return slider;
  }

  // Dark Mode Toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }

  // Hamburger Menu
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', function () {
      hamburgerMenu.classList.toggle('active');
      const headerInner = document.querySelector('.header-inner');
      if (headerInner) {
        headerInner.classList.toggle('active');
      }
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', function () {
        hamburgerMenu.classList.remove('active');
        const headerInner = document.querySelector('.header-inner');
        if (headerInner) {
          headerInner.classList.remove('active');
        }
      });
    });
  }

  // Advanced Form Validation
  const emailInput = form?.email;
  const nameInput = form?.name;
  const messageInput = form?.message;

  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('error')) validateName();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('error')) validateEmail();
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('error')) validateMessage();
    });
  }

  function validateName() {
    if (!nameInput) return false;
    const value = nameInput.value.trim();
    const error = !value ? 'Ad gerekli' : value.length < 3 ? 'En az 3 karakter' : '';
    showFieldError(nameInput, error);
    return !error;
  }

  function validateEmail() {
    if (!emailInput) return false;
    const value = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const error = !value ? 'E-posta gerekli' : !regex.test(value) ? 'Geçerli e-posta girin' : '';
    showFieldError(emailInput, error);
    return !error;
  }

  function validateMessage() {
    if (!messageInput) return false;
    const value = messageInput.value.trim();
    const error = !value ? 'Mesaj gerekli' : value.length < 10 ? 'En az 10 karakter' : '';
    showFieldError(messageInput, error);
    return !error;
  }

  function showFieldError(input, error) {
    input.classList.toggle('error', !!error);
    let errorDiv = input.nextElementSibling;
    if (error) {
      if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
      }
      errorDiv.textContent = error;
    } else if (errorDiv && errorDiv.classList.contains('error-message')) {
      errorDiv.remove();
    }
  }

  // Contact Form Submit
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (isNameValid && isEmailValid && isMessageValid) {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        console.log('Mesaj gönderildi:', { name, email, message });
        alert('Mesajınız kaydedildi. En kısa zamanda size dönüş yapacağız.');
        form.reset();
        document.querySelectorAll('.error-message').forEach(e => e.remove());
      }
    });
  }

  // Back to Top
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
