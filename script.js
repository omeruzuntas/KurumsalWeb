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

  // Contact Form
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email) {
        alert('Lütfen adınızı ve e-posta adresinizi girin.');
        return;
      }

      console.log('Mesaj gönderildi:', { name, email, message });
      alert('Mesajınız kaydedildi. En kısa zamanda size dönüş yapacağız.');
      form.reset();
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
