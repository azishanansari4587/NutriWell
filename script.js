// ============================================================
//  NutriWell Pharma — script.js
//  Single-page app navigation + all interactive features
// ============================================================

// ---- PAGE NAVIGATION ----
function showPage(pageId, linkEl) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Update nav link active state
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-trigger fade-up animations
  if (target) {
    target.querySelectorAll('.fade-up').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  // Trigger stat counters when About Us page is opened
  if (pageId === 'team') {
    setTimeout(triggerAboutCounters, 400);
  }
  // Replay hero animation when Home page is revisited
  if (pageId === 'home') {
    setTimeout(replayHeroAnim, 100);
  }
  // Re-start or stop product carousel based on active page
  if (pageId === 'products') {
    if (typeof startProductCarousel === 'function') startProductCarousel();
  } else {
    if (typeof stopProductCarousel === 'function') stopProductCarousel();
  }
}

// ---- CLOSE MOBILE MENU ----
function closeMenu() {
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  if (navMenu) navMenu.classList.remove('open');
  if (navToggle) navToggle.classList.remove('active');
}

// ---- MOBILE HAMBURGER ----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
}

// ---- NAVBAR: SCROLLED STATE ----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- ANIMATE ON SCROLL (IntersectionObserver) ----
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => animObserver.observe(el));

// ---- COUNTER ANIMATION (Stats on Home Page) ----
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-value').forEach(c => counterObserver.observe(c));

// ---- ABOUT US STAT COUNTERS ----
function triggerAboutCounters() {
  document.querySelectorAll('#page-team .about-stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  });
}

// ---- RE-ANIMATE HERO TEXT ON HOME REVISIT ----
function replayHeroAnim() {
  const lines = document.querySelectorAll('.hv-line-1, .hv-line-2, .hv-tag, .hv-actions');
  lines.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
  });
  const video = document.getElementById('heroBgVideo');
  if (video) { video.currentTime = 0; video.play(); }
}

// ---- CALENDAR (Health Tips Page) ----
function buildCalendar() {
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const today = now.getDate();

  // Update the calendar heading with month and year
  const calBox = grid.closest('.calendar-box');
  if (calBox) {
    const h3 = calBox.querySelector('h3');
    if (h3) {
      const monthNames = ['January','February','March','April','May','June',
        'July','August','September','October','November','December'];
      h3.textContent = monthNames[month] + ' ' + year;
    }
  }

  // Add day-of-week headers
  const dayHeaders = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  dayHeaders.forEach(d => {
    const hdr = document.createElement('span');
    hdr.textContent = d;
    hdr.style.fontWeight = '700';
    hdr.style.fontSize = '0.7rem';
    hdr.style.color = '#1a5c6b';
    hdr.style.cursor = 'default';
    grid.appendChild(hdr);
  });

  // First day of the month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDay = new Date(year, month, 1).getDay();
  // Total days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty spacers for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('span');
    empty.style.cursor = 'default';
    grid.appendChild(empty);
  }

  // Add the actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const s = document.createElement('span');
    s.textContent = i;
    if (i === today) s.classList.add('today');
    grid.appendChild(s);
  }
}
buildCalendar();

// ---- FOOTER CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('contactSubmitBtn');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim() || !messageInput.value.trim()) {
      btn.textContent = 'Fill all fields';
      btn.style.background = '#e74c3c';
      setTimeout(() => { btn.textContent = 'Submit'; btn.style.background = ''; }, 2000);
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.background = '#1a5c6b';

    fetch('https://formsubmit.co/ajax/azishanansari4587@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Name: nameInput.value,
        Email: emailInput.value,
        Phone: phoneInput.value,
        Message: messageInput.value,
        _subject: 'New Contact Inquiry - NutriWell Website',
        _captcha: 'false'
      })
    })
    .then(response => {
      if (response.ok) {
        btn.textContent = '✓ Sent!';
        btn.style.background = '#27ae60';
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        messageInput.value = '';
      } else {
        throw new Error('Submission failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      btn.textContent = 'Error! Try Again';
      btn.style.background = '#e74c3c';
    })
    .finally(() => {
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = 'Submit';
        btn.style.background = '';
      }, 3000);
    });
  });
}

// ---- CONTACT PAGE FORM (Full Page) ----
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('cpSubmitBtn');
  const successEl = document.getElementById('cpFormSuccess');
  const name = document.getElementById('cpName').value.trim();
  const email = document.getElementById('cpEmail').value.trim();
  const phone = document.getElementById('cpPhone').value.trim();
  const subject = document.getElementById('cpSubject').value;
  const message = document.getElementById('cpMessage').value.trim();

  if (!name || !email || !message) return;

  btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  fetch('https://formsubmit.co/ajax/azishanansari4587@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      Name: name, Email: email, Phone: phone,
      Subject: subject, Message: message,
      _subject: 'New Inquiry - NutriWell Contact Page',
      _captcha: 'false'
    })
  })
  .then(res => {
    if (res.ok) {
      if (successEl) successEl.style.display = 'flex';
      e.target.reset();
      setTimeout(() => { if (successEl) successEl.style.display = 'none'; }, 6000);
    } else throw new Error();
  })
  .catch(() => {
    btn.innerHTML = 'Error! Try Again <i class="fas fa-times"></i>';
    btn.style.background = '#e74c3c';
  })
  .finally(() => {
    btn.disabled = false;
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
    }, 3000);
  });
}

// ---- FAQ ACCORDION ----
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('open');
        const ans = fi.querySelector('.faq-answer');
        if (ans) { ans.style.maxHeight = ''; ans.style.padding = ''; }
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '0 24px 20px';
      }
    });
  });
}
initFaqAccordion();

// Globals for Carousel Control
let startProductCarousel = null;
let stopProductCarousel = null;

// ---- PRODUCT HERO CAROUSEL ----
function initProductCarousel() {
  const slides = document.querySelectorAll('.prod-carousel-slide');
  const dots = document.querySelectorAll('.prod-carousel-dots .dot');
  
  if (slides.length === 0) return;
  
  let currentIndex = 0;
  let autoplayTimer = null;
  
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex = index;
    }
    
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }
  }
  
  function nextSlide() {
    showSlide(currentIndex + 1);
  }
  
  function prevSlide() {
    showSlide(currentIndex - 1);
  }
  
  startProductCarousel = function() {
    stopProductCarousel();
    autoplayTimer = setInterval(nextSlide, 5000); // Transition slide every 5 seconds
  };
  
  stopProductCarousel = function() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.dataset.slide);
      showSlide(targetIndex);
      startProductCarousel(); // Reset autoplay timer
    });
  });

  // Mobile Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 40; // minimum swipe distance in pixels
  const trackEl = document.querySelector('.prod-carousel-track');
  
  if (trackEl) {
    trackEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    
    trackEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance < 0) {
          nextSlide(); // Swiped left -> Next Slide
        } else {
          prevSlide(); // Swiped right -> Previous Slide
        }
        startProductCarousel(); // Reset autoplay timer
      }
    }, { passive: true });
  }

  // Start initially if product page is active
  const parentPage = document.getElementById('page-products');
  if (parentPage && parentPage.classList.contains('active')) {
    startProductCarousel();
  }
}

initProductCarousel();
