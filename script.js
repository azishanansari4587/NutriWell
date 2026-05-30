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
  for (let i = 1; i <= 31; i++) {
    const s = document.createElement('span');
    s.textContent = i;
    if (i === new Date().getDate()) s.classList.add('today');
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
