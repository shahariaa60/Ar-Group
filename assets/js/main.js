/* ========================================
   AR GROUP RECRUITMENT AGENCY - MAIN.JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== LUCIDE ICONS ====================
  lucide.createIcons();

  // ==================== AOS ANIMATION ====================
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
    disable: window.innerWidth < 768 ? 'mobile' : false
  });

  // ==================== SWIPER ====================
  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });

  // ==================== NAVBAR SCROLL ====================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ==================== MOBILE MENU ====================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const closeMobile = document.getElementById('close-mobile');

  function toggleMobile(open) {
    if (open) {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  hamburger.addEventListener('click', () => toggleMobile(true));
  closeMobile.addEventListener('click', () => toggleMobile(false));
  mobileOverlay.addEventListener('click', () => toggleMobile(false));

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMobile(false));
  });

  // ==================== COUNTER ANIMATION ====================
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      const step = Math.max(1, Math.floor(target / 60));
      let current = 0;

      const update = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
          return;
        }
        counter.textContent = current + suffix;
        requestAnimationFrame(() => setTimeout(update, 30));
      };
      update();
    });
  }

  // Observer for counter animation
  const statsSection = document.querySelector('#home .stat-card-hero')?.closest('section');
  const statSection2 = document.querySelector('.stat-card');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        setTimeout(animateCounters, 300);
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) counterObserver.observe(statsSection);

  // Also observe secondary stats
  let countersAnimated2 = false;
  const counterObserver2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated2) {
        countersAnimated2 = true;
        // Reset and re-animate only if not already done for hero
        if (!countersAnimated) {
          animateCounters();
        }
        counterObserver2.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (statSection2) {
    const statParent = statSection2.closest('section');
    if (statParent) counterObserver2.observe(statParent);
  }

  // ==================== GALLERY LIGHTBOX ====================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  const gallerySrcs = [];

  galleryItems.forEach((item, index) => {
    gallerySrcs.push(item.dataset.src);
    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox(item.dataset.src);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[currentIndex];
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[currentIndex];
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // ==================== FAQ ACCORDION ====================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        openItem.classList.remove('active');
        const icon = openItem.querySelector('[data-lucide="chevron-down"]');
        if (icon) icon.style.transform = 'rotate(0deg)';
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('[data-lucide="chevron-down"]');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ==================== SCROLL PROGRESS ====================
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ==================== BACK TO TOP ====================
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-4');
      backToTop.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
      backToTop.classList.add('opacity-0', 'invisible', 'translate-y-4');
      backToTop.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==================== BUTTON RIPPLE ====================
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==================== SMOOTH SCROLL FOR NAV LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==================== ACTIVE NAV LINK ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const bottom = top + section.offsetHeight;
      if (window.pageYOffset >= top && window.pageYOffset < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-[#F4B400]', 'font-semibold');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('text-[#F4B400]', 'font-semibold');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ==================== PARALLAX HERO ====================
  const heroParallax = document.querySelector('.hero-parallax');
  if (heroParallax) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroParallax.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    }, { passive: true });
  }

  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate send
      setTimeout(() => {
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#16A34A';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ==================== TRACKING CODE PLACEHOLDER ====================
  // Add your Google Analytics or other tracking code here

  console.log('AR Group Recruitment Agency - Website loaded successfully');
});
