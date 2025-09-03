// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbar = document.querySelector('.navbar');

  // Toggle menu on click
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navbar.classList.toggle('active');
      this.classList.toggle('is-active');
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideMenu = navbar.contains(event.target);
    const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);

    if (navbar.classList.contains('active') && !isClickInsideMenu && !isClickOnMenuBtn) {
      navbar.classList.remove('active');
      mobileMenuBtn.classList.remove('is-active');
    }
  });

  // Close menu when window resizes to desktop size
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991 && navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      mobileMenuBtn.classList.remove('is-active');
    }
  });
});
