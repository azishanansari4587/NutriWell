// ============================================================
//  NutriWell Pharma — script.js
//  Multi-page site: navigation + all interactive features
// ============================================================

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

// ---- ABOUT US STAT COUNTERS (Auto-trigger on About page) ----
const aboutStatNums = document.querySelectorAll('.about-stat-num');
if (aboutStatNums.length > 0) {
  const aboutCounterObserver = new IntersectionObserver((entries) => {
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
        aboutCounterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  aboutStatNums.forEach(el => aboutCounterObserver.observe(el));
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
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
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
  const swipeThreshold = 40;
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
          nextSlide();
        } else {
          prevSlide();
        }
        startProductCarousel();
      }
    }, { passive: true });
  }

  // Auto-start on products page
  startProductCarousel();
}

initProductCarousel();

// ---- DYNAMIC FRUIT OF THE DAY ----
function displayFruitOfTheDay() {
  const fruits = [
    {
      name: "Cherries",
      emoji: "🍒",
      serving: "Nutritional Values (1 cup, 138g):",
      calories: "87",
      vitaminC: "16% DV",
      fiber: "2.9g",
      antioxidants: "High in melatonin",
      benefits: "Enhances sleep quality, Reduces inflammation, Supports heart health."
    },
    {
      name: "Apples",
      emoji: "🍎",
      serving: "Nutritional Values (1 medium, 182g):",
      calories: "95",
      vitaminC: "14% DV",
      fiber: "4.4g",
      antioxidants: "High in quercetin",
      benefits: "Supports gut health, Lowers cholesterol, Regulates blood sugar levels."
    },
    {
      name: "Blueberries",
      emoji: "🫐",
      serving: "Nutritional Values (1 cup, 148g):",
      calories: "84",
      vitaminC: "24% DV",
      fiber: "3.6g",
      antioxidants: "Rich in anthocyanins",
      benefits: "Boosts brain function, Lowers blood pressure, Promotes DNA repair."
    },
    {
      name: "Oranges",
      emoji: "🍊",
      serving: "Nutritional Values (1 medium, 131g):",
      calories: "62",
      vitaminC: "116% DV",
      fiber: "3.1g",
      antioxidants: "High in hesperidin",
      benefits: "Strengthens immune system, Enhances iron absorption, Promotes skin health."
    },
    {
      name: "Bananas",
      emoji: "🍌",
      serving: "Nutritional Values (1 medium, 118g):",
      calories: "105",
      vitaminC: "17% DV",
      fiber: "3.1g",
      antioxidants: "Contains dopamine & catechins",
      benefits: "Provides instant energy, Supports heart health, Aids digestion."
    },
    {
      name: "Kiwi",
      emoji: "🥝",
      serving: "Nutritional Values (1 large, 91g):",
      calories: "56",
      vitaminC: "141% DV",
      fiber: "2.7g",
      antioxidants: "Rich in lutein",
      benefits: "Improves digestive health, Promotes sound sleep, Supports respiratory function."
    },
    {
      name: "Strawberries",
      emoji: "🍓",
      serving: "Nutritional Values (1 cup, 152g):",
      calories: "49",
      vitaminC: "149% DV",
      fiber: "3.0g",
      antioxidants: "High in ellagic acid",
      benefits: "Improves insulin sensitivity, Enhances heart health, Protects skin from UV rays."
    }
  ];

  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (86400000));
  const fruitIndex = dayOfYear % fruits.length;
  const fruit = fruits[fruitIndex];

  const titleEl = document.getElementById('fruit-name-title');
  const servingEl = document.getElementById('fruit-serving');
  const caloriesEl = document.getElementById('fruit-calories');
  const vitcEl = document.getElementById('fruit-vitaminc');
  const fiberEl = document.getElementById('fruit-fiber');
  const antiEl = document.getElementById('fruit-antioxidants');
  const benefitsEl = document.getElementById('fruit-benefits');
  const imgEl = document.getElementById('fruit-emoji-side');

  if (titleEl) titleEl.innerHTML = `${fruit.emoji} Fruit of the day: ${fruit.name}`;
  if (servingEl) servingEl.textContent = fruit.serving;
  if (caloriesEl) caloriesEl.textContent = fruit.calories;
  if (vitcEl) vitcEl.textContent = fruit.vitaminC;
  if (fiberEl) fiberEl.textContent = fruit.fiber;
  if (antiEl) antiEl.textContent = fruit.antioxidants;
  if (benefitsEl) benefitsEl.textContent = fruit.benefits;
  if (imgEl) imgEl.textContent = fruit.emoji;
}

displayFruitOfTheDay();
