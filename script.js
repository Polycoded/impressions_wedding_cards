// ============================================================
// ALLURE – SCRIPTS (Premium Animation Edition)
// Includes: GSAP, ScrollTrigger, SplitText, Flip, Lenis,
// custom cursor, scroll progress, back-to-top,
// portfolio grid reveal, hero reveals, parallax, etc.
// All original functionality preserved.
// ============================================================

/* ---------- LENIS SMOOTH SCROLL ---------- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

/* ---------- REDUCED MOTION CHECK ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.querySelector('.custom-cursor');
if (!prefersReducedMotion && cursor) {
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };
  const speed = 0.1;

  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * speed;
    pos.y += (mouse.y - pos.y) * speed;
    gsap.set(cursor, { x: pos.x, y: pos.y });
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .btn, .category-card, .product-card, .filter-btn, .whatsapp-fab, .thumb, .modal-share-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.querySelector('.scroll-progress');
if (!prefersReducedMotion && progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });
}

/* ---------- BACK TO TOP ---------- */
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5 });
  });
}

/* ---------- PRELOADER (GSAP enhanced) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector('#preloader svg');
  const preloader = document.getElementById('preloader');
  const counterEl = document.querySelector('.preloader-counter');
  if (!svg || !preloader) return;

  const paths = Array.from(svg.querySelectorAll('path'));

  function playAnimation() {
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.transition = 'none';
      path.style.strokeDasharray = `${length} ${length + 10}`;
      path.style.strokeDashoffset = length;
      if (path.classList.contains('fil0')) {
        path.style.fill = 'transparent';
      }
    });

    svg.getBoundingClientRect();

    paths.forEach((path, index) => {
      const traceDelay = index * 0.15;
      path.style.transition = `stroke-dashoffset 1.8s ease-in-out ${traceDelay}s`;
      path.style.strokeDashoffset = '0';
      if (path.classList.contains('fil0')) {
        const fillDelay = traceDelay + 1.8;
        setTimeout(() => {
          path.style.transition = 'fill 0.8s ease-in';
          path.style.fill = '#B26500';
        }, fillDelay * 1000);
      }
    });
  }

  playAnimation();

  // Counter animation
  if (counterEl) {
    gsap.fromTo(counterEl, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 });
    const counter = { value: 0 };
    gsap.to(counter, {
      value: 100,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        counterEl.textContent = Math.round(counter.value) + '%';
      }
    });
  }

  // Hide preloader with GSAP
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.8,
    delay: 3.2,
    ease: 'power2.inOut',
    onComplete: () => {
      preloader.classList.add('hide');
      // Small page reveal
      gsap.from('body', { opacity: 0, duration: 0.6 });
    }
  });
});

/* ---------- HEADER SCROLL ---------- */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ---------- MOBILE NAV – HAMBURGER TOGGLE ---------- */
(function () {
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  if (!navToggle || !mobileNav) return;

  function openMenu() {
    navToggle.classList.add('open');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Staggered link animation
    if (!prefersReducedMotion) {
      gsap.fromTo(mobileNav.querySelectorAll('li'), {
        opacity: 0,
        y: 15
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }

  function closeMenu() {
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    navToggle.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  }, { passive: true });
})();

/* ============================================================
   PORTFOLIO, MODAL, CALCULATOR, LIGHTBOX, SHARE
   (Original code kept intact, with subtle animations added)
   ============================================================ */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '919526577999';
  const DEFAULT_DESC = 'Experience the timeless elegance of this design. Crafted on premium materials with exquisite detailing.';
  const ITEMS_PER_PAGE = 12;

  const productContainer = document.getElementById('product-container');
  const showMoreBtn = document.getElementById('show-more-btn');
  const filterContainer = document.getElementById('filter-container');
  const categoryGrid = document.getElementById('category-grid');

  const modal = document.getElementById('quick-view-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const modalImg = document.getElementById('modal-main-img');
  const thumbnailRow = document.getElementById('modal-thumbnails');
  const modalTitle = document.getElementById('modal-title');
  const modalUnitPrice = document.getElementById('modal-unit-price');
  const modalCategoryLbl = document.getElementById('modal-category-label');
  const modalDescText = document.getElementById('modal-desc-text');
  const modalDetails = document.getElementById('modal-details');

  const qtySelect = document.getElementById('modal-qty-select');
  const calcCardCost = document.getElementById('calc-card-cost');
  const calcPrintingVal = document.getElementById('calc-printing-val');
  const printingRow = document.getElementById('printing-row');
  const discountRow = document.getElementById('discount-row');
  const calcDiscountVal = document.getElementById('calc-discount-val');
  const savingsRow = document.getElementById('savings-row');
  const calcSavingsVal = document.getElementById('calc-savings-val');
  const calcFinalTotal = document.getElementById('calc-final-total');
  const whatsappBtn = document.getElementById('modal-whatsapp-btn');

  const galleryOverlay = document.getElementById('gallery-overlay');
  const galleryImg = document.getElementById('gallery-img');
  const galleryClose = document.getElementById('gallery-close');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const galleryCounter = document.getElementById('gallery-counter');

  let allProducts = [];
  let filteredProducts = [];
  let visibleCount = 0;
  let currentFilter = 'All';
  let currentImages = [];
  let currentGalleryIndex = 0;
  let currentUnitPrice = 0;
  let currentProductName = '';
  let currentProductCat = '';
  let currentMinOrder = 100;
  let currentExtraCharges = [];
  let currentSearchQuery = '';
  let currentSort = 'featured';

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- UTILS ---------- */
  function getUniqueCategories() {
    return [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- DATA LOAD ---------- */
  fetch('./data/cards.json')
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(data => {
      allProducts = data.map(p => ({
        ...p,
        images: (p.images && p.images.length > 0) ? p.images : ['assets/cards/placeholder.jpg'],
        featured: p.featured || false,
        minOrder: p.minOrder || 100,
        description: p.description || DEFAULT_DESC
      }));

      buildCategoryMenu();
      buildFilterButtons();
      applyFilter('All');

      // Setup portfolio grid reveal after products rendered
      setupPortfolioReveal();

      // Hash check for shared links
      function checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#card=')) {
          const cardId = decodeURIComponent(hash.substring(6));
          const product = allProducts.find(p => p.id === cardId);
          if (product) {
            openProductModal(product);
          }
        }
      }
      checkHash();
      window.addEventListener('hashchange', () => {
        if (window.location.hash.startsWith('#card=')) {
          const cardId = decodeURIComponent(window.location.hash.substring(6));
          const product = allProducts.find(p => p.id === cardId);
          if (product && !modal.classList.contains('active')) {
            openProductModal(product);
          }
        } else if (modal.classList.contains('active')) {
          closeModal();
        }
      });
    })
    .catch(err => {
      console.error('Failed to load cards.json:', err);
      if (productContainer) {
        productContainer.innerHTML = '<p class="no-products">Unable to load designs. Please try again later.</p>';
      }
    });

  /* ---------- PORTFOLIO GRID REVEAL (GSAP) ---------- */
  function setupPortfolioReveal() {
    const wrapper = document.querySelector('.portfolio-reveal-wrapper');
    const cards = gsap.utils.toArray('.product-card');
    if (!cards.length || !wrapper || prefersReducedMotion) {
      // If reduced motion, just clear initial transform and show
      gsap.set(cards, { clearProps: 'all' });
      return;
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const gridW = wrapper.offsetWidth;
    const gridH = wrapper.offsetHeight;
    const scaleFactor = Math.max(viewportW / gridW, viewportH / gridH) * 1.2;

    gsap.set(wrapper, { scale: scaleFactor });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    tl.to(wrapper, {
      scale: 1,
      duration: 1,
      ease: 'power2.inOut'
    })
    .fromTo(cards, {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      stagger: { each: 0.03, from: 'center' },
      ease: 'back.out(1.4)',
      duration: 0.8
    }, 0)
    .from(cards, {
      y: 30,
      stagger: { each: 0.03, from: 'center' },
      ease: 'power2.out',
      duration: 0.6
    }, 0.1);
  }

  /* ---------- CATEGORY CARDS ---------- */
  const CATEGORY_DESCRIPTIONS = {
    Heritage: 'Rich, traditional luxury',
    Minimal: 'Understated elegance',
    Floral: "Nature's romantic touch",
    Modern: 'Contemporary & bold'
  };

  function buildCategoryMenu() {
    const cats = getUniqueCategories();
    categoryGrid.innerHTML = cats.map(cat => `
      <div class="category-card" data-category="${escapeHtml(cat)}" role="button" tabindex="0"
           aria-label="View ${escapeHtml(cat)} collection">
        <h3>${escapeHtml(cat)}</h3>
        <p>${escapeHtml(CATEGORY_DESCRIPTIONS[cat] || 'Explore our exclusive collection')}</p>
      </div>
    `).join('');

    categoryGrid.addEventListener('click', onCategoryClick);
    categoryGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') onCategoryClick(e);
    });

    // Animate category cards on scroll
    if (!prefersReducedMotion) {
      gsap.from('.category-card', {
        scrollTrigger: {
          trigger: '#collections',
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }

  function onCategoryClick(e) {
    const card = e.target.closest('.category-card');
    if (!card) return;
    const cat = card.dataset.category;
    setActiveFilter(cat);
    document.getElementById('portfolio-search').value = '';
    currentSearchQuery = '';
    applyFilter(cat);
    lenis.scrollTo('#portfolio', { offset: -100 });
  }

  /* ---------- FILTER & SORT ---------- */
  function buildFilterButtons() {
    filterContainer.querySelectorAll('.filter-btn:not([data-filter="All"])').forEach(b => b.remove());
    getUniqueCategories().forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = cat;
      btn.textContent = cat;
      filterContainer.appendChild(btn);
    });
  }

  filterContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    setActiveFilter(btn.dataset.filter);
    applyFilter(btn.dataset.filter);
  });

  const searchInput = document.getElementById('portfolio-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearchQuery = searchInput.value;
      applyFilter(currentFilter);
    });
  }

  const sortSelect = document.getElementById('portfolio-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      applyFilter(currentFilter);
    });
  }

  function setActiveFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });
    document.querySelectorAll('.category-card').forEach(c => {
      c.classList.toggle('active', c.dataset.category === filter);
    });
  }

  function applyFilter(filter) {
    currentFilter = filter;
    filteredProducts = filter === 'All'
      ? [...allProducts]
      : allProducts.filter(p => p.category === filter);

    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.id.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    switch (currentSort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    visibleCount = Math.min(ITEMS_PER_PAGE, filteredProducts.length);
    productContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
      productContainer.innerHTML = '<p class="no-products">No designs found.</p>';
    } else {
      productContainer.innerHTML = filteredProducts
        .slice(0, visibleCount)
        .map(createCardHTML)
        .join('');
    }
    updateShowMoreBtn();
  }

  /* ---------- CARD HTML ---------- */
  function createCardHTML(product) {
    const productJson = encodeURIComponent(JSON.stringify(product));
    const featuredBadge = product.featured
      ? '<span class="featured-badge">Featured</span>'
      : '';
    const mainImage = product.images[0];
    const thumbSrc = mainImage
      ? mainImage.replace('/cards/', '/cards/thumb/')
      : 'assets/cards/placeholder.jpg';

    return `
      <div class="product-card">
        <div class="product-img-wrapper">
          ${featuredBadge}
          <img src="${escapeHtml(thumbSrc)}"
               alt="${escapeHtml(product.id)} card design"
               loading="lazy"
               onerror="this.onerror=null;this.src='${escapeHtml(mainImage)}';">
          <div class="quick-view-overlay">
            <button class="quick-view-btn"
                    data-product="${productJson}"
                    aria-label="Quick view ${escapeHtml(product.id)}">
              Quick View
            </button>
          </div>
        </div>
        <h4 class="product-id" style="font-family: 'Montserrat', 'Helvetica Neue', sans-serif; font-weight: 700;">${escapeHtml(product.id)}</h4>
        <p class="product-price">Rs. ${product.price} / card</p>
      </div>
    `;
  }

  /* ---------- QUICK VIEW ---------- */
  productContainer.addEventListener('click', e => {
    const btn = e.target.closest('.quick-view-btn');
    if (!btn) return;
    try {
      const product = JSON.parse(decodeURIComponent(btn.getAttribute('data-product')));
      openProductModal(product);
    } catch (err) {
      console.error('Could not parse product data:', err);
    }
  });

  /* ---------- SHOW MORE ---------- */
  showMoreBtn.addEventListener('click', () => {
    const nextCount = Math.min(visibleCount + ITEMS_PER_PAGE, filteredProducts.length);
    const newHTML = filteredProducts
      .slice(visibleCount, nextCount)
      .map(createCardHTML)
      .join('');
    productContainer.insertAdjacentHTML('beforeend', newHTML);
    visibleCount = nextCount;
    updateShowMoreBtn();
    // Animate new cards in
    if (!prefersReducedMotion) {
      const newCards = productContainer.querySelectorAll('.product-card:nth-child(n+' + (visibleCount - (nextCount - visibleCount) + 1) + ')');
      gsap.from(newCards, {
        opacity: 0,
        y: 30,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  });

  function updateShowMoreBtn() {
    showMoreBtn.style.display = visibleCount < filteredProducts.length ? 'inline-block' : 'none';
  }

  /* ---------- MODAL MANAGEMENT (with Flip) ---------- */
  function openProductModal(product) {
    // Prepare modal content as before
    modalImg.src = '';
    modalTitle.textContent = 'Loading...';
    modalCategoryLbl.textContent = '';
    modalUnitPrice.textContent = '';
    modalDescText.textContent = '';
    if (modalDetails) modalDetails.textContent = '';
    thumbnailRow.innerHTML = '';

    currentProductName = product.id;
    currentProductCat = product.category;
    currentUnitPrice = product.price;
    currentMinOrder = product.minOrder || 100;
    currentImages = product.images || [];
    currentExtraCharges = product.extraCharges || [];

    modalTitle.textContent = product.id;
    modalCategoryLbl.textContent = product.category
      ? `Allure ${product.category} Collection`
      : 'Allure Collection';
    modalUnitPrice.textContent = `Rs. ${product.price} / card`;
    modalDescText.textContent = product.description || DEFAULT_DESC;

    if (modalDetails) {
      let detailsHtml = '';
      if (product.size && product.material) {
        detailsHtml = `<strong>Size:</strong> ${product.size}<br><strong>Material:</strong> ${product.material}`;
      } else if (product.size) {
        detailsHtml = `<strong>Size:</strong> ${product.size}`;
      } else if (product.material) {
        detailsHtml = `<strong>Material:</strong> ${product.material}`;
      }
      modalDetails.innerHTML = detailsHtml;
    }

    modalImg.src = currentImages[0] || '';
    modalImg.alt = product.id;

    thumbnailRow.innerHTML = '';
    if (currentImages.length > 1) {
      currentImages.forEach((src, idx) => {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = `thumb${idx === 0 ? ' active' : ''}`;
        thumbDiv.innerHTML = `<img src="${escapeHtml(src)}" alt="Thumbnail ${idx + 1}">`;
        thumbDiv.addEventListener('click', () => {
          modalImg.style.opacity = '0.5';
          setTimeout(() => {
            modalImg.src = src;
            modalImg.style.opacity = '1';
          }, 160);
          document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
          thumbDiv.classList.add('active');
        });
        thumbnailRow.appendChild(thumbDiv);
      });
    }

    populateQtyDropdown(currentMinOrder);
    qtySelect.removeEventListener('change', calculateTotal);
    qtySelect.addEventListener('change', calculateTotal);
    calculateTotal();

    // Flip animation from clicked card (if available)
    const clickedCard = document.querySelector(`.product-card[data-product*='"id":"${product.id}"']`);
    if (clickedCard && !prefersReducedMotion) {
      const state = Flip.getState(clickedCard.querySelector('.product-img-wrapper img'));
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      Flip.from(state, {
        duration: 0.8,
        ease: 'power2.inOut',
        absolute: true,
        onComplete: () => {
          closeModalBtn.focus();
        }
      });
    } else {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeModalBtn.focus();
      gsap.fromTo(modal.querySelector('.modal-content'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }

    history.replaceState(null, null, `#card=${product.id}`);
  }

  function closeModal() {
    closeGallery(true);
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    history.replaceState(null, null, window.location.pathname);
  }

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  /* ---------- MODAL SHARE BUTTON ---------- */
  const modalShareBtn = document.getElementById('modal-share-btn');
  if (modalShareBtn) {
    modalShareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        modalShareBtn.classList.add('copied');
        // Bounce animation
        if (!prefersReducedMotion) {
          gsap.fromTo(modalShareBtn, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
        }
        setTimeout(() => {
          modalShareBtn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        alert('Copy failed. Please manually copy the URL.');
      });
    });
  }

  /* ---------- CALCULATOR (with number animation) ---------- */
  function populateQtyDropdown(minOrder) {
    qtySelect.innerHTML = '';
    for (let qty = minOrder; qty <= 1500; qty += 50) {
      const opt = document.createElement('option');
      opt.value = qty;
      opt.textContent = qty.toLocaleString() + ' cards';
      if (qty === minOrder) opt.selected = true;
      qtySelect.appendChild(opt);
    }
  }

  function animateValue(el, start, end, duration = 0.6) {
    if (prefersReducedMotion) {
      el.textContent = 'Rs. ' + end.toLocaleString();
      return;
    }
    gsap.fromTo(el, { innerText: start }, {
      innerText: end,
      duration,
      snap: { innerText: 1 },
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = 'Rs. ' + Math.round(this.targets()[0].innerText).toLocaleString();
      }
    });
  }

  function calculateTotal() {
    const qty = parseInt(qtySelect.value, 10);
    const cardCost = qty * currentUnitPrice;
    const extraTotal = currentExtraCharges.reduce((sum, ch) => sum + ch.price, 0);

    let printingFee = 0;
    let printingWaived = 0;
    const showPrinting = currentMinOrder === 100;

    if (showPrinting) {
      printingFee = qty < 200 ? 600 : 0;
      printingWaived = printingFee === 0 ? 600 : 0;
    }

    let factor = 1.0;
    let discountPct = 0;
    if (qty >= 1000) { factor = 0.90; discountPct = 10; }
    else if (qty >= 500) { factor = 0.95; discountPct = 5; }

    const discountAmt = Math.round(cardCost * (1 - factor));
    const finalTotal = Math.round(cardCost * factor) + printingFee + extraTotal;
    const totalSavings = printingWaived + discountAmt;

    animateValue(calcCardCost, parseInt(calcCardCost.textContent.replace(/[^0-9]/g, '')) || 0, cardCost);
    // Update other fields normally
    calcPrintingVal.textContent = printingFee > 0 ? 'Rs. 600' : '<span class="waived">Rs. 600</span> <span class="saved-text">FREE</span>';
    discountRow.style.display = discountPct > 0 ? 'flex' : 'none';
    if (discountPct > 0) {
      calcDiscountVal.innerHTML = `− Rs. ${discountAmt.toLocaleString()} (${discountPct}%)`;
    }
    savingsRow.style.display = totalSavings > 0 ? 'flex' : 'none';
    calcSavingsVal.textContent = `Rs. ${totalSavings.toLocaleString()}`;
    animateValue(calcFinalTotal, parseInt(calcFinalTotal.textContent.replace(/[^0-9]/g, '')) || 0, finalTotal);

    // WhatsApp message
    const breakdownLines = [
      `*Design:* ${currentProductName} (${currentProductCat} Collection)`,
      `*Quantity:* ${qty}`,
      ``,
      `*Price Breakdown:*`,
      `Card Cost: Rs. ${cardCost.toLocaleString()}`
    ];
    if (currentExtraCharges.length > 0) {
      currentExtraCharges.forEach(ch => breakdownLines.push(`${ch.name}: Rs. ${ch.price}`));
      if (currentExtraCharges.length > 1) breakdownLines.push(`Total Extra Charges: Rs. ${extraTotal.toLocaleString()}`);
    }
    if (showPrinting) {
      breakdownLines.push(printingFee > 0 ? `Extra charge below 200: Rs. 600` : `Extra charge below 200: FREE (saved Rs. 600)`);
    }
    if (discountAmt > 0) breakdownLines.push(`Volume Discount (${discountPct}%): – Rs. ${discountAmt.toLocaleString()}`);
    breakdownLines.push(`───`);
    breakdownLines.push(`*Final Estimate: Rs. ${finalTotal.toLocaleString()}*`);
    breakdownLines.push(`*You Save: Rs. ${totalSavings.toLocaleString()}*`);
    breakdownLines.push(``);
    breakdownLines.push(`Please let me know how to proceed.`);
    const message = breakdownLines.join('\n');
    whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  /* ---------- LIGHTBOX ---------- */
  modalImg.addEventListener('click', () => {
    if (!currentImages.length) return;
    const activeSrc = modalImg.getAttribute('src');
    const idx = currentImages.indexOf(activeSrc);
    openGallery(idx >= 0 ? idx : 0);
  });

  function openGallery(index) {
    if (!currentImages.length) return;
    currentGalleryIndex = index;
    updateGalleryImage();
    galleryOverlay.classList.add('active');
    galleryClose.focus();
    if (!prefersReducedMotion) {
      gsap.fromTo(galleryImg, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }

  function updateGalleryImage() {
    galleryImg.src = currentImages[currentGalleryIndex];
    galleryImg.alt = `Image ${currentGalleryIndex + 1} of ${currentImages.length}`;
    const multiple = currentImages.length > 1;
    galleryCounter.textContent = multiple ? `${currentGalleryIndex + 1} / ${currentImages.length}` : '';
    galleryPrev.style.display = multiple ? 'block' : 'none';
    galleryNext.style.display = multiple ? 'block' : 'none';
  }

  function closeGallery(fromModal = false) {
    galleryOverlay.classList.remove('active');
    if (!fromModal && !modal.classList.contains('active')) {
      document.body.style.overflow = 'auto';
    }
  }

  galleryClose.addEventListener('click', () => closeGallery());
  galleryOverlay.addEventListener('click', e => {
    if (e.target === galleryOverlay) closeGallery();
  });
  galleryPrev.addEventListener('click', e => {
    e.stopPropagation();
    if (!currentImages.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentImages.length) % currentImages.length;
    updateGalleryImage();
  });
  galleryNext.addEventListener('click', e => {
    e.stopPropagation();
    if (!currentImages.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentImages.length;
    updateGalleryImage();
  });
  document.addEventListener('keydown', e => {
    if (!galleryOverlay.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape': closeGallery(); break;
      case 'ArrowLeft':
        if (currentImages.length > 1) {
          currentGalleryIndex = (currentGalleryIndex - 1 + currentImages.length) % currentImages.length;
          updateGalleryImage();
        }
        break;
      case 'ArrowRight':
        if (currentImages.length > 1) {
          currentGalleryIndex = (currentGalleryIndex + 1) % currentImages.length;
          updateGalleryImage();
        }
        break;
    }
  });
})();

/* ============================================================
   ADDITIONAL PREMIUM ANIMATIONS (Scroll-triggered)
   ============================================================ */

// Hero text reveal (SplitText)
if (!prefersReducedMotion && document.querySelector('.hero-heading')) {
  const heroHeading = document.querySelector('.hero-heading');
  const split = new SplitText(heroHeading, { type: 'words,chars' });
  gsap.from(split.chars, {
    opacity: 0,
    y: 20,
    stagger: 0.03,
    duration: 0.6,
    ease: 'power3.out',
    delay: 2.8  // after preloader
  });

  // Hero image zoom
  gsap.to('.hero', {
    backgroundSize: '105%',
    duration: 3,
    ease: 'none'
  });
}

// Our Story section reveals
if (!prefersReducedMotion) {
  gsap.from('.hook-text .section-tag', {
    scrollTrigger: { trigger: '#our-story', start: 'top 70%' },
    opacity: 0, y: 20, duration: 0.8, ease: 'power2.out'
  });
  gsap.from('.hook-text h2', {
    scrollTrigger: { trigger: '#our-story', start: 'top 70%' },
    opacity: 0, y: 30, duration: 0.8, delay: 0.1, ease: 'power2.out'
  });
  gsap.from('.hook-text p', {
    scrollTrigger: { trigger: '#our-story', start: 'top 70%' },
    opacity: 0, y: 20, stagger: 0.15, duration: 0.8, ease: 'power2.out'
  });
  gsap.from('.hook-image img', {
    scrollTrigger: { trigger: '#our-story', start: 'top 70%' },
    opacity: 0, x: -40, duration: 1, ease: 'power3.out'
  });
}

// Footer reveal
if (!prefersReducedMotion) {
  gsap.from('.footer-grid', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'power2.out'
  });
}

// WhatsApp FAB pulse
if (!prefersReducedMotion) {
  gsap.to('.whatsapp-fab', {
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'power1.inOut'
  });
}

// Button hover shimmer (CSS handles most, but we can add subtle scale)
document.querySelectorAll('.btn-gold').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    if (!prefersReducedMotion) gsap.to(btn, { scale: 1.03, duration: 0.2 });
  });
  btn.addEventListener('mouseleave', () => {
    if (!prefersReducedMotion) gsap.to(btn, { scale: 1, duration: 0.2 });
  });
});
