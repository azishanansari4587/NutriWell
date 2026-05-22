// ---- PAGE NAVIGATION ----
function showPage(pageId, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => a.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Re-trigger fade animations
  document.querySelectorAll('#page-' + pageId + ' .fade-up').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });
  // Trigger stats counters when About Us page is opened
  if (pageId === 'team') {
    setTimeout(triggerAboutCounters, 400);
  }
}

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

// ---- HAMBURGER MENU ----
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ---- HERO SLIDER ----
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function goSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
function nextSlide() { goSlide(currentSlide + 1); }
function prevSlide() { goSlide(currentSlide - 1); }
setInterval(nextSlide, 5000);

// ---- PRODUCT CAROUSEL ----
let carPos = 0;
const carTrack = document.getElementById('carTrack');
function carNext() {
  const maxPos = -(carTrack.children.length - 3) * (200 + 24);
  if (carPos > maxPos) { carPos -= 224; carTrack.style.transform = `translateX(${carPos}px)`; }
}
function carPrev() {
  if (carPos < 0) { carPos += 224; carTrack.style.transform = `translateX(${carPos}px)`; }
}

// ---- CALENDAR ----
function buildCalendar() {
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  for (let i = 1; i <= 31; i++) {
    const s = document.createElement('span');
    s.textContent = i;
    if (i === 22) s.classList.add('today');
    grid.appendChild(s);
  }
}
buildCalendar();

// ---- VIDEO PLACEHOLDER ----
function playVideo() {
  const vp = document.getElementById('videoPlaceholder');
  vp.innerHTML = '<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen style="display:block"></iframe>';
}

// ---- NAVBAR SHADOW ON SCROLL ----
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (window.scrollY > 10) { nb.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)'; }
  else { nb.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)'; }
});

// ---- FOOTER FORM ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('contactSubmitBtn');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');
    
    // Check if values are filled
    if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim() || !messageInput.value.trim()) {
      btn.textContent = 'Fill all fields';
      btn.style.background = '#e74c3c';
      setTimeout(() => { btn.textContent = 'Submit'; btn.style.background = ''; }, 2000);
      return;
    }
    
    // Show sending state
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.background = '#1a5c6b'; // Primary Teal theme color
    
    // Send form data via AJAX
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
        // Clear all inputs
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        messageInput.value = '';
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
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
