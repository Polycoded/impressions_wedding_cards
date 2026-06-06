(function() {
    'use strict';

    // ========== PRELOADER ==========
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('preloader').classList.add('hide');
        }, 600);
    });

    // ========== STATE & CONSTANTS ==========
    const WHATSAPP_NUMBER = '919526577999';
    const ITEMS_PER_PAGE = 6;
    let allProducts = [];
    let currentFilter = 'All', currentSearchQuery = '', currentSort = 'featured';
    let filteredProducts = [];
    let visibleCount = ITEMS_PER_PAGE;
    let currentImages = [], currentGalleryIndex = 0;

    // ========== DOM REFS ==========
    const productContainer = document.getElementById('product-container');
    const showMoreBtn = document.getElementById('show-more-btn');
    const filterContainer = document.getElementById('filter-container');
    const categoryGrid = document.getElementById('category-grid');
    const modal = document.getElementById('quick-view-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalMainImg = document.getElementById('modal-main-img');
    const thumbnailRow = document.getElementById('modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalCategoryLabel = document.getElementById('modal-category-label');
    const modalUnitPrice = document.getElementById('modal-unit-price');
    const modalDescText = document.getElementById('modal-desc-text');
    const modalDetails = document.getElementById('modal-details');
    const qtySelect = document.getElementById('modal-qty-select');
    const calcCardCost = document.getElementById('calc-card-cost');
    const printingRow = document.getElementById('printing-row');
    const calcPrintingVal = document.getElementById('calc-printing-val');
    const discountRow = document.getElementById('discount-row');
    const calcDiscountVal = document.getElementById('calc-discount-val');
    const savingsRow = document.getElementById('savings-row');
    const calcSavingsVal = document.getElementById('calc-savings-val');
    const calcFinalTotal = document.getElementById('calc-final-total');
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    const modalShareBtn = document.getElementById('modal-share-btn');
    const galleryOverlay = document.getElementById('gallery-overlay');
    const galleryImg = document.getElementById('gallery-img');
    const galleryCloseBtn = document.getElementById('gallery-close');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');
    const galleryCounter = document.getElementById('gallery-counter');
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ========== UTILS ==========
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

    // ========== DATA LOADING ==========
    fetch('./data/cards.json')
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(data => {
            allProducts = data.map(p => ({
                ...p,
                images: (p.images && p.images.length) ? p.images : ['assets/cards/placeholder.jpg'],
                minOrder: p.minOrder || 100,
                description: p.description || 'A beautiful handcrafted design.'
            }));
            buildCategories();
            buildFilterButtons();
            applyFilters();
            checkHash();
        })
        .catch(err => {
            console.error('Failed to load cards.json:', err);
            productContainer.innerHTML = '<p class="text-center text-on-surface-variant col-span-full">Unable to load designs. Please try again later.</p>';
        });

    // ========== CATEGORY CARDS ==========
    function buildCategories() {
        const cats = [...new Set(allProducts.map(p => p.category))];
        categoryGrid.innerHTML = cats.map(cat => {
            const sample = allProducts.find(p => p.category === cat);
            return `<div class="reveal-on-scroll group bg-surface-container-low rounded-xl p-8 text-center border-2 border-transparent hover:border-primary shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer" data-category="${esc(cat)}">
                <span class="text-xs text-primary/70 tracking-widest uppercase block mb-3">COLLECTION</span>
                <h3 class="font-display text-2xl text-plum-deep mb-3">${esc(cat)}</h3>
                <p class="text-sm text-on-surface-variant">${esc(sample?.description || 'Exclusive handcrafted designs')}</p>
            </div>`;
        }).join('');

        categoryGrid.addEventListener('click', e => {
            const card = e.target.closest('[data-category]');
            if (!card) return;
            const cat = card.dataset.category;
            setActiveFilter(cat);
            document.getElementById('portfolio-search').value = '';
            currentSearchQuery = '';
            applyFilters();
            document.getElementById('portfolio').scrollIntoView({behavior:'smooth'});
        });
    }

    // ========== FILTER BUTTONS ==========
    function buildFilterButtons() {
        filterContainer.querySelectorAll('.filter-btn:not([data-filter="All"])').forEach(b => b.remove());
        [...new Set(allProducts.map(p => p.category))].forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn px-5 py-2 rounded-full border border-outline-variant text-sm font-medium hover:border-primary hover:text-primary transition-colors';
            btn.dataset.filter = cat;
            btn.textContent = cat;
            filterContainer.appendChild(btn);
        });
        filterContainer.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            setActiveFilter(btn.dataset.filter);
            applyFilters();
        });
    }

    function setActiveFilter(filter) {
        currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    }

    // ========== FILTER / SORT / SEARCH ==========
    function applyFilters() {
        filteredProducts = currentFilter === 'All' ? [...allProducts] : allProducts.filter(p => p.category === currentFilter);
        if (currentSearchQuery.trim()) {
            const q = currentSearchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
                p.id.toLowerCase().includes(q) ||
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }
        if (currentSort === 'price-asc') filteredProducts.sort((a,b) => a.price - b.price);
        else if (currentSort === 'price-desc') filteredProducts.sort((a,b) => b.price - a.price);
        else filteredProducts.sort((a,b) => (b.featured?1:0) - (a.featured?1:0));

        visibleCount = Math.min(ITEMS_PER_PAGE, filteredProducts.length);
        renderProducts();
    }

    // ========== RENDER PRODUCT GRID ==========
    function renderProducts() {
        productContainer.innerHTML = filteredProducts.slice(0, visibleCount).map(p => `
            <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div class="product-img-wrapper relative aspect-[4/5] bg-surface-container-low flex items-center justify-center overflow-hidden card-inner-frame">
                    <img src="${esc(p.images[0])}" alt="${esc(p.id)}" class="w-full h-full object-cover transition-transform duration-700">
                    <div class="quick-view-overlay">
                        <button class="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg" data-product='${esc(JSON.stringify(p))}'>Quick View</button>
                    </div>
                </div>
                <div class="p-5 text-center flex-grow">
                    <h4 class="font-display text-xl text-plum-deep">${esc(p.id)}</h4>
                    <p class="text-sm text-on-surface-variant mt-1">Rs. ${p.price} / card</p>
                </div>
            </div>`).join('');

        showMoreBtn.style.display = visibleCount < filteredProducts.length ? 'inline-block' : 'none';

        // Re-attach reveal-on-scroll observer
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            if (!el.dataset.observed) {
                el.dataset.observed = 'true';
                scrollObserver.observe(el);
            }
        });
    }

    // ========== MODAL ==========
    function openModal(product) {
        modalMainImg.src = product.images[0];
        modalTitle.textContent = product.id;
        modalCategoryLabel.textContent = product.category || 'Collection';
        modalUnitPrice.textContent = `Rs. ${product.price} / card`;
        modalDescText.textContent = product.description || '';
        modalDetails.innerHTML = '';
        if (product.size) modalDetails.innerHTML += `<strong>Size:</strong> ${product.size}<br>`;
        if (product.material) modalDetails.innerHTML += `<strong>Material:</strong> ${product.material}`;

        thumbnailRow.innerHTML = '';
        if (product.images.length > 1) {
            product.images.forEach((src, i) => {
                const thumb = document.createElement('div');
                thumb.className = `thumb${i===0?' active':''}`;
                thumb.dataset.src = src;
                thumb.innerHTML = `<img src="${esc(src)}" alt="Thumbnail ${i+1}">`;
                thumb.addEventListener('click', () => {
                    modalMainImg.src = src;
                    thumbnailRow.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                thumbnailRow.appendChild(thumb);
            });
        }

        const minOrder = product.minOrder || 100;
        qtySelect.innerHTML = '';
        for (let q = minOrder; q <= 1500; q += 50) {
            const opt = document.createElement('option');
            opt.value = q;
            opt.textContent = `${q.toLocaleString()} cards`;
            if (q === minOrder) opt.selected = true;
            qtySelect.appendChild(opt);
        }

        function updateCalc() {
            const qty = parseInt(qtySelect.value);
            const cardCost = qty * product.price;
            const extraCharges = product.extraCharges || [];
            const extraTotal = extraCharges.reduce((sum, ch) => sum + ch.price, 0);
            let printingFee = 0, waived = 0;
            const showPrinting = minOrder === 100;
            if (showPrinting) {
                printingFee = qty < 200 ? 600 : 0;
                waived = printingFee === 0 && qty >= 200 ? 600 : 0;
            }
            let factor = 1, discPct = 0;
            if (qty >= 1000) { factor = 0.9; discPct = 10; }
            else if (qty >= 500) { factor = 0.95; discPct = 5; }
            const discountAmt = Math.round(cardCost * (1 - factor));
            const final = Math.round(cardCost * factor) + printingFee + extraTotal;
            const savings = waived + discountAmt;

            calcCardCost.textContent = `Rs. ${cardCost.toLocaleString()}`;
            printingRow.style.display = showPrinting ? 'flex' : 'none';
            if (showPrinting) {
                if (printingFee > 0) {
                    calcPrintingVal.innerHTML = 'Rs. 600';
                    calcPrintingVal.style.color = '';
                } else {
                    calcPrintingVal.innerHTML = '<span style="text-decoration: line-through; color:#999;">Rs. 600</span> <span style="color:#2e7d32; font-weight:600;">FREE</span>';
                }
            }
            discountRow.classList.toggle('hidden', discPct === 0);
            if (discPct) calcDiscountVal.textContent = `− Rs. ${discountAmt.toLocaleString()} (${discPct}%)`;
            savingsRow.classList.toggle('hidden', savings === 0);
            calcSavingsVal.textContent = `Rs. ${savings.toLocaleString()}`;
            calcFinalTotal.textContent = `Rs. ${final.toLocaleString()}`;

            const msg = [
                `*Design:* ${product.id} (${product.category})`,
                `*Quantity:* ${qty}`,
                ``,
                `*Estimate:* Rs. ${final.toLocaleString()}`,
            ];
            if (extraCharges.length) extraCharges.forEach(ch => msg.push(`${ch.name}: Rs. ${ch.price}`));
            if (showPrinting && printingFee > 0) msg.push('Extra charge below 200: Rs. 600');
            if (discountAmt > 0) msg.push(`Volume Discount (${discPct}%): – Rs. ${discountAmt.toLocaleString()}`);
            msg.push(`You Save: Rs. ${savings.toLocaleString()}`, '', 'Please let me know how to proceed.');
            whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.join('\n'))}`;
        }
        qtySelect.addEventListener('change', updateCalc);
        updateCalc();

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        history.replaceState(null, null, `#card=${product.id}`);
    }

    function closeModal() {
        galleryOverlay.classList.remove('active');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        history.replaceState(null, null, window.location.pathname);
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // ========== LIGHTBOX ==========
    modalMainImg.addEventListener('click', () => {
        const activeSrc = modalMainImg.src;
        const thumbs = [...thumbnailRow.querySelectorAll('.thumb')];
        currentImages = thumbs.length ? thumbs.map(t => t.dataset.src) : [activeSrc];
        currentGalleryIndex = currentImages.indexOf(activeSrc);
        if (currentGalleryIndex < 0) currentGalleryIndex = 0;
        updateGallery();
        galleryOverlay.classList.add('active');
    });

    function updateGallery() {
        galleryImg.src = currentImages[currentGalleryIndex];
        galleryCounter.textContent = currentImages.length > 1 ? `${currentGalleryIndex+1} / ${currentImages.length}` : '';
        galleryPrevBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
        galleryNextBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
    }

    galleryCloseBtn.addEventListener('click', () => galleryOverlay.classList.remove('active'));
    galleryPrevBtn.addEventListener('click', () => {
        if (currentImages.length > 1) currentGalleryIndex = (currentGalleryIndex - 1 + currentImages.length) % currentImages.length;
        updateGallery();
    });
    galleryNextBtn.addEventListener('click', () => {
        if (currentImages.length > 1) currentGalleryIndex = (currentGalleryIndex + 1) % currentImages.length;
        updateGallery();
    });

    // ========== SHARE ==========
    modalShareBtn.addEventListener('click', async () => {
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: 'Impressions Wedding Card', text: modalTitle.textContent, url }); return; } catch {}
        }
        try {
            await navigator.clipboard.writeText(url);
            modalShareBtn.classList.add('copied');
            setTimeout(() => modalShareBtn.classList.remove('copied'), 2000);
        } catch { alert('Copy failed. Link: ' + url); }
    });

    // ========== SEARCH & SORT ==========
    document.getElementById('portfolio-search').addEventListener('input', e => {
        currentSearchQuery = e.target.value;
        applyFilters();
    });
    document.getElementById('portfolio-sort').addEventListener('change', e => {
        currentSort = e.target.value;
        applyFilters();
    });

    // ========== SHOW MORE ==========
    showMoreBtn.addEventListener('click', () => {
        const nextCount = Math.min(visibleCount + ITEMS_PER_PAGE, filteredProducts.length);
        const newHTML = filteredProducts.slice(visibleCount, nextCount).map(p => `
            <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div class="product-img-wrapper relative aspect-[4/5] bg-surface-container-low flex items-center justify-center overflow-hidden card-inner-frame">
                    <img src="${esc(p.images[0])}" alt="${esc(p.id)}" class="w-full h-full object-cover transition-transform duration-700">
                    <div class="quick-view-overlay">
                        <button class="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg" data-product='${esc(JSON.stringify(p))}'>Quick View</button>
                    </div>
                </div>
                <div class="p-5 text-center flex-grow">
                    <h4 class="font-display text-xl text-plum-deep">${esc(p.id)}</h4>
                    <p class="text-sm text-on-surface-variant mt-1">Rs. ${p.price} / card</p>
                </div>
            </div>`).join('');
        productContainer.insertAdjacentHTML('beforeend', newHTML);
        visibleCount = nextCount;
        showMoreBtn.style.display = visibleCount < filteredProducts.length ? 'inline-block' : 'none';
    });

    // Quick view delegation
    productContainer.addEventListener('click', e => {
        const btn = e.target.closest('.quick-view-btn');
        if (!btn) return;
        try {
            const product = JSON.parse(decodeURIComponent(btn.getAttribute('data-product')));
            openModal(product);
        } catch (err) { console.error('Product parse error:', err); }
    });

    // ========== HASH ROUTING ==========
    function checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#card=')) {
            const id = decodeURIComponent(hash.substring(6));
            const product = allProducts.find(p => p.id === id);
            if (product && !modal.classList.contains('active')) openModal(product);
        }
    }
    window.addEventListener('hashchange', checkHash);

    // ========== MOBILE NAV ==========
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
    document.querySelectorAll('#mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });

    // ========== SCROLL REVEAL ==========
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal-on-scroll').forEach(el => scrollObserver.observe(el));

})();
