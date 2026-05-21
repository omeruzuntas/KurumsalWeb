document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');

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
});
