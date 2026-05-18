// ========== CURRENCY HELPER ==========
const CURRENCY = 'MK';
function formatPrice(amount) {
    return `${CURRENCY} ${parseFloat(amount).toFixed(2)}`;
}

// ========== CART STATE ==========
const cartState = [];
const cartOverlay = document.getElementById('cartOverlay');
const cartBody = document.getElementById('cartBody');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');

function updateCartUI() {
  if (cartState.length === 0) {
    cartBody.innerHTML = '<div class="cart-drawer__empty">Your cart is empty. Time for a treat! 🧁</div>';
    cartBadge.classList.remove('visible');
  } else {
    cartBadge.classList.add('visible');
    cartBadge.textContent = cartState.length;
    cartBody.innerHTML = cartState.map((item, index) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item__img" width="72" height="72" loading="lazy" onerror="this.src='/assets/images/fallback.jpg'">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">${formatPrice(item.price)}</div>
          <button style="font-size:0.75rem; color:var(--pink-400); margin-top:4px; font-weight:600;" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `).join('');
  }
  const total = cartState.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatPrice(total);
}

window.removeFromCart = function(index) {
  cartState.splice(index, 1);
  updateCartUI();
};

// Add to cart listeners
document.querySelectorAll('.product-card__add').forEach(btn => {
  btn.addEventListener('click', function() {
    cartState.push({
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      img: this.dataset.img
    });
    updateCartUI();

    // Button feedback
    const orig = this.innerHTML;
    this.innerHTML = '✓ Added!';
    this.style.background = '#4CAF50';
    this.style.color = '#fff';
    this.style.borderColor = '#4CAF50';
    setTimeout(() => {
      this.innerHTML = orig;
      this.style.background = '';
      this.style.color = '';
      this.style.borderColor = '';
    }, 1500);
  });
});

// Cart drawer toggle
document.getElementById('cartToggle').addEventListener('click', () => cartOverlay.classList.add('active'));
document.getElementById('cartClose').addEventListener('click', () => cartOverlay.classList.remove('active'));
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) cartOverlay.classList.remove('active');
});

// ========== NAVIGATION ==========
const nav = document.getElementById('nav');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Logo click smooth scroll to top
document.querySelector('.nav__logo').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('[data-mobile-link]').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link:not([data-mobile-link])');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
  });
});

// ========== SCROLL ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ========== FILTER ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    productCards.forEach(card => {
      const c = card.dataset.category;
      if (f === 'all' || c === f) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ========== WISHLIST ==========
document.querySelectorAll('.product-card__wishlist').forEach(btn => {
  btn.addEventListener('click', function() {
    const svg = this.querySelector('svg');
    const filled = svg.getAttribute('fill') === 'currentColor';
    if (filled) {
      svg.setAttribute('fill', 'none');
    } else {
      svg.setAttribute('fill', 'var(--pink-400)');
    }
  });
});

// ========== COUNTDOWN ==========
function updateCountdown() {
  const now = new Date();
  const end = new Date();
  end.setDate(now.getDate() + 2);
  end.setHours(23, 59, 59);
  const diff = end - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ========== NEWSLETTER ==========
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#4CAF50';
  this.querySelector('input').value = '';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 3000);
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  });
});