document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const backToTop = document.getElementById('back-to-top');

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
