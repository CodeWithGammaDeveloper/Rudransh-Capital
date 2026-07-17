const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-top');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const navLinks = document.querySelectorAll('.site-nav a');
const chatWidget = document.querySelector('.chat-widget');
const chatToggle = document.querySelector('.chat-toggle');
const chatForm = document.querySelector('.chat-form');
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');
const loanForm = document.getElementById('loanForm');
const formModal = document.getElementById('formModal');
const closeModal = document.getElementById('closeModal');
const newsletterForm = document.querySelector('.newsletter-form');
const typingText = document.querySelector('.typing-text');
const testimonialsContainer = document.querySelector('.testimonial-track');

const theme = localStorage.getItem('rudransh-theme') || 'light';
if (theme === 'dark') {
  body.classList.add('dark');
  themeToggle.querySelector('.theme-icon').textContent = '🌙';
}

function toggleMenu() {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

navToggle?.addEventListener('click', toggleMenu);
siteNav?.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('rudransh-theme', isDark ? 'dark' : 'light');
});

function updateScrollProgress() {
  const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / maxHeight) * 100;
  progressBar.style.transform = `scaleX(${Number.isFinite(progress) ? progress / 100 : 0})`;
}
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealElements.forEach((el) => observer.observe(el));

function animateCounters() {
  counters.forEach((counter, index) => {
    const target = Number(counter.dataset.target);
    const duration = 1400 + index * 120;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = start.toLocaleString();
      }
    }, duration / 60);
  });
}

const statsSection = document.querySelector('.stats-grid');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
statsObserver.observe(statsSection);

let testimonialIndex = 0;
function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
}
function changeTestimonial(direction) {
  testimonialIndex = (testimonialIndex + direction + testimonialCards.length) % testimonialCards.length;
  showTestimonial(testimonialIndex);
}
document.querySelector('.testimonial-nav.prev')?.addEventListener('click', () => changeTestimonial(-1));
document.querySelector('.testimonial-nav.next')?.addEventListener('click', () => changeTestimonial(1));
setInterval(() => changeTestimonial(1), 6000);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});
window.addEventListener('scroll', () => {
  const sectionIds = Array.from(document.querySelectorAll('main section[id]'));
  const current = sectionIds.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 140 && rect.bottom > 140;
  });
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current?.id}`;
    link.classList.toggle('active', active);
  });
  backToTop.classList.toggle('show', window.scrollY > 700);
});

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('.ripple').forEach((button) => {
  button.addEventListener('click', (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

chatToggle?.addEventListener('click', () => chatWidget.classList.toggle('open'));
chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = chatForm.querySelector('input');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = input.value;
  document.querySelector('.chat-body').appendChild(bubble);
  input.value = '';
});

function showCookieBanner() {
  cookieBanner.classList.add('show');
}
function hideCookieBanner() {
  cookieBanner.classList.remove('show');
}
if (!localStorage.getItem('rudransh-cookie')) {
  setTimeout(showCookieBanner, 1200);
}
cookieAccept?.addEventListener('click', () => {
  localStorage.setItem('rudransh-cookie', 'accepted');
  hideCookieBanner();
});
cookieDecline?.addEventListener('click', () => {
  localStorage.setItem('rudransh-cookie', 'declined');
  hideCookieBanner();
});

function validateField(field) {
  const value = field.value.trim();
  if (!value) return `${field.name} is required.`;
  if (field.name === 'mobile' && !/^\+?[0-9]{10,13}$/.test(value)) return 'Please enter a valid mobile number.';
  if (field.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
  return '';
}

loanForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fields = loanForm.querySelectorAll('input, select, textarea');
  let hasError = false;
  fields.forEach((field) => {
    const error = validateField(field);
    if (error) {
      hasError = true;
      field.style.borderColor = 'crimson';
    } else {
      field.style.borderColor = 'var(--border)';
    }
  });
  if (!hasError) {
    try {
      const response = await fetch(loanForm.action, {
        method: loanForm.method,
        headers: { 'Accept': 'application/json' },
        body: new FormData(loanForm)
      });
      if (response.ok) {
        formModal.classList.add('show');
        loanForm.reset();
      } else {
        alert('There was a problem sending your request. Please try again later.');
      }
    } catch (error) {
      alert('There was a problem sending your request. Please try again later.');
    }
  }
});
closeModal?.addEventListener('click', () => formModal.classList.remove('show'));
formModal?.addEventListener('click', (event) => {
  if (event.target === formModal) formModal.classList.remove('show');
});

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = newsletterForm.querySelector('button');
  button.textContent = 'Subscribed';
  setTimeout(() => {
    button.textContent = 'Subscribe';
    newsletterForm.reset();
  }, 1800);
});

const typeWords = ['Smart Loans', 'Secure Wealth', 'Trusted Advice', 'Fast Approval'];
let wordIndex = 0;
function typeLoop() {
  const word = typeWords[wordIndex];
  let letterIndex = 0;
  typingText.textContent = '';
  const interval = setInterval(() => {
    typingText.textContent += word[letterIndex];
    letterIndex += 1;
    if (letterIndex === word.length) {
      clearInterval(interval);
      setTimeout(() => {
        typingText.textContent = '';
        wordIndex = (wordIndex + 1) % typeWords.length;
        typeLoop();
      }, 1400);
    }
  }, 120);
}
typeLoop();
