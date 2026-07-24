// Product Page JavaScript Logic - Zeifur Rohman Personal Web
        // Safe Lenis Smooth Scroll Initialization
        let lenis = null;
        if (typeof Lenis !== 'undefined') {
            try {
                lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    smoothTouch: false
                });

                function raf(time) {
                    if (lenis) lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            } catch (err) {
                console.warn("Lenis init fallback:", err);
            }
        }

        // Emergency Scroll Unlocker
        window.forceUnlockScroll = function() {
            document.body.style.overflow = '';
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflow = '';
            document.documentElement.style.overflowY = 'auto';
            if (lenis) lenis.start();
        };

        // Unlock scroll after page load
        window.addEventListener('load', () => {
            setTimeout(window.forceUnlockScroll, 300);
            setTimeout(window.forceUnlockScroll, 1200);
        });

        // Keydown Escape handler to close any active modal & unlock scroll
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (typeof closeDetails === 'function') closeDetails();
                if (typeof closeSuccess === 'function') closeSuccess();
                window.forceUnlockScroll();
            }
        });
        // Image preview switcher for CapKarya showcase (Desktop vs Mobile mode)
        window.switchCapKaryaImg = function(imgSrc, mode, btn) {
            const previewImg = document.getElementById('capkarya-preview-img');
            const modeBadge = document.getElementById('capkarya-device-mode');
            if (previewImg) {
                gsap.to(previewImg, {
                    opacity: 0,
                    scale: 0.96,
                    duration: 0.15,
                    onComplete: () => {
                        previewImg.src = imgSrc;
                        if (modeBadge) {
                            modeBadge.innerHTML = mode === 'mobile' 
                                ? '<i data-lucide="smartphone" style="width:12px;height:12px;"></i> MOBILE / SMARTPHONE' 
                                : '<i data-lucide="monitor" style="width:12px;height:12px;"></i> DESKTOP / LAPTOP';
                            if (typeof lucide !== 'undefined') lucide.createIcons();
                        }
                        gsap.to(previewImg, { opacity: 1, scale: 1, duration: 0.25 });
                    }
                });
            }
            if (btn && btn.parentElement) {
                btn.parentElement.querySelectorAll('.mode-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        };

        // Store Product Database (CapKarya Web App & Coffee Treat Config)
        const productsData = {
            1: {
                id: 1,
                title_id: "Traktir Kopi Kreatif (Dukungan Karya)",
                title_en: "Buy Me a Coffee (Creator Support)",
                desc_id: "Dukung kontinuitas karya digital, eksperimen website, dan konten edukatif Zeifur Rohman dengan mentraktir secangkir kopi hangat. Anda bebas menentukan nominal apresiasi terbaik Anda secara sukarela via DOKU / QRIS / E-Wallet.",
                desc_en: "Support Zeifur Rohman's ongoing digital creations, open web experiments, and educational guides by buying him a warm cup of coffee! Choose any contribution amount via live DOKU / QRIS / E-Wallet Gateway.",
                features_id: "Apresiasi Sukarela Bebas Nominal | Mendukung Karya Digital & Web Development | DOKU / QRIS / VA / E-Wallet Gateway | Ucapan Terima Kasih Spesial dari Kreator",
                features_en: "Flexible Voluntary Contribution | Supports Digital Work & Web Development | Live DOKU / QRIS / E-Wallet Gateway | Heartfelt Creator Appreciation",
                priceNumeric: 0,
                priceString: "Rp ∞",
                class: "preview-presets",
                icon: "coffee",
                category: "coffee",
                tags: ["Coffee", "Support", "Donation"],
                paymentLink: "https://pay.doku.com/p-link/p/TraktirKopi"
            },
            2: {
                id: 2,
                title_id: "CapKarya by Zeifur Rohman (Web App Monogram)",
                title_en: "CapKarya by Zeifur Rohman (Monogram Web App)",
                desc_id: "Aplikasi web generator logo monogram & identitas visual instan berbasis browser yang dirancang khusus oleh Zeifur Rohman untuk membantu UMKM, pebisnis, dan kreator menciptakan cap identitas/monogram kelas premium secara presisi.",
                desc_en: "Instant browser-based monogram logo & visual identity web application designed by Zeifur Rohman to empower small businesses, entrepreneurs, and creators to generate premium monogram logos in seconds.",
                features_id: "Editor Monogram Presisi 320x320px | Kustomisasi Inisial 2-3 Huruf & Tagline | Kontrol Rotasi Sudut & Skala Ukuran | Simpan Desain Favorit & Ekspor Aset | 100% Gratis Digunakan",
                features_en: "320x320px Precision Monogram Canvas | 2-3 Letter Monogram & Tagline Builder | Rotation Angle & Scale Controls | Local Favorites Saver & Asset Export | 100% Free to Use",
                priceNumeric: 0,
                priceString: "GRATIS (FREE DEMO)",
                class: "preview-template-1",
                icon: "globe",
                category: "free-web",
                tags: ["CapKarya", "WebApp", "Monogram", "Generator"],
                webLink: "http://capkarya.great-site.net",
                paymentLink: "http://capkarya.great-site.net",
                image: "assets/images/capkarya-display-1.png"
            }
        };

        // Active States
        let cart = [];
        let currentActiveProductId = null;
        let selectedCategory = "all";
        let selectedTag = "all";
        let maxFilterPrice = 300000;
        let activeSorting = "latest";
        let currentPage = 1;
        const productsPerPage = 6;

        // Custom Cursor Logic
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (cursor && follower) {
            let cursorVisible = false;

            document.addEventListener('mousemove', (e) => {
                if (!cursorVisible) {
                    cursor.classList.add('visible');
                    follower.classList.add('visible');
                    cursorVisible = true;
                }
                gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
                gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.25 });
            });

            document.addEventListener('mouseleave', () => {
                cursor.classList.remove('visible');
                follower.classList.remove('visible');
                cursorVisible = false;
            });

            document.addEventListener('mouseenter', () => {
                cursor.classList.add('visible');
                follower.classList.add('visible');
                cursorVisible = true;
            });

            document.addEventListener('mousedown', () => {
                cursor.classList.add('is-active');
                follower.classList.add('is-active');
            });

            document.addEventListener('mouseup', () => {
                cursor.classList.remove('is-active');
                follower.classList.remove('is-active');
            });

            // Dynamic Hover effects
            document.addEventListener('mouseover', (e) => {
                const target = e.target.closest('a, button, select, input, .social-icon-btn, .category-link, .tag-btn, .btn-store-detail, .btn-store-buy, .social-circle, [role="button"]');
                if (target) {
                    cursor.classList.add('is-hovered');
                    follower.classList.add('is-hovered');
                } else {
                    cursor.classList.remove('is-hovered');
                    follower.classList.remove('is-hovered');
                }
            });
        }

        // Slide-out Menu Navigation Panel
        const menuToggle = document.querySelector('.menu-toggle');
        const menuPanel = document.querySelector('.menu-panel');
        const menuOverlay = document.querySelector('.menu-panel-overlay');

        if (menuToggle && menuPanel && menuOverlay) {
            const closeMenu = () => {
                document.body.classList.remove('menu-open');
                lenis.start();
                
                const isDesktop = window.innerWidth > 1024;
                gsap.to(menuPanel, { 
                    left: isDesktop ? -400 : '-100%', 
                    duration: 0.6, 
                    ease: 'power4.inOut' 
                });
                gsap.to(menuOverlay, { opacity: 0, visibility: 'hidden', duration: 0.4 });
            };

            menuToggle.addEventListener('click', () => {
                const isOpen = document.body.classList.toggle('menu-open');
                
                if (isOpen) {
                    lenis.stop();
                    const isDesktop = window.innerWidth > 1024;
                    
                    gsap.to(menuPanel, { 
                        left: isDesktop ? 80 : 0, 
                        duration: 0.6, 
                        ease: 'power4.out' 
                    });
                    gsap.to(menuOverlay, { opacity: 1, visibility: 'visible', duration: 0.4 });
                    
                    gsap.fromTo('.menu-panel-link', 
                        { y: 30, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
                    );
                } else {
                    closeMenu();
                }
            });

            menuOverlay.addEventListener('click', closeMenu);
        }

        // Category trigger scrolling to category widget
        const categoriesTrigger = document.querySelector('.categories-trigger');
        if (categoriesTrigger) {
            categoriesTrigger.addEventListener('click', () => {
                const widget = document.getElementById('categories-sidebar-widget');
                if (widget) {
                    lenis.scrollTo(widget, { offset: -100 });
                }
            });
        }

        // Render Storefront Grid Cards based on filters & sorting
        function renderProductsGrid() {
            const gridContainer = document.getElementById('products-grid-container');
            if (!gridContainer) return;

            const currentLang = localStorage.getItem('preferred_language') || 'id';
            const dict = translations[currentLang] || translations['id'];

            // 1. Filter products (Exclude Section 1 Web Works & Section 3 Coffee Treat from Section 2 sale grid)
            let filteredList = Object.values(productsData).filter(prod => {
                if (prod.id === 1 || prod.category === 'coffee' || prod.category === 'free-web') return false;
                // Category match
                if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
                // Tag match
                if (selectedTag !== 'all' && !prod.tags.includes(selectedTag)) return false;
                // Price match
                if (prod.priceNumeric > maxFilterPrice) return false;
                return true;
            });

            // 2. Sort products
            if (activeSorting === 'low-high') {
                filteredList.sort((a, b) => a.priceNumeric - b.priceNumeric);
            } else if (activeSorting === 'high-low') {
                filteredList.sort((a, b) => b.priceNumeric - a.priceNumeric);
            } else {
                filteredList.sort((a, b) => b.id - a.id);
            }

            // 3. Paginate
            const totalProducts = filteredList.length;
            const totalPages = Math.ceil(totalProducts / productsPerPage);
            if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
            
            const startIdx = (currentPage - 1) * productsPerPage;
            const endIdx = startIdx + productsPerPage;
            const paginatedList = filteredList.slice(startIdx, endIdx);

            // Update result counter text
            const resultsCounter = document.getElementById('toolbar-results-count');
            if (resultsCounter) {
                if (totalProducts === 0) {
                    resultsCounter.textContent = currentLang === 'en' ? "Showing 0 results" : "Menampilkan 0 hasil";
                } else {
                    const startCount = startIdx + 1;
                    const endCount = Math.min(endIdx, totalProducts);
                    resultsCounter.textContent = currentLang === 'en' 
                        ? `Showing ${startCount}–${endCount} of ${totalProducts} results`
                        : `Menampilkan ${startCount}–${endCount} dari ${totalProducts} hasil`;
                }
            }

            // Render HTML
            gridContainer.innerHTML = "";
            if (paginatedList.length === 0) {
                gridContainer.innerHTML = `
                    <div class="empty-products-card" style="grid-column: 1/-1; background: rgba(15, 18, 24, 0.5); border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 60px 25px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; margin: 10px 0;">
                        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(152, 0, 0, 0.15); border: 1px solid rgba(152, 0, 0, 0.35); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(152, 0, 0, 0.35);">
                            <i data-lucide="package-open" style="width: 32px; height: 32px; color: var(--accent-color);"></i>
                        </div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 900; color: #fff; letter-spacing: 0.05em; margin: 0; text-transform: uppercase;">${dict['store_sec2_empty_title'] || 'BELUM ADA PRODUK DIJUAL'}</h3>
                        <p style="font-family: var(--font-body); font-size: 0.88rem; color: var(--muted-text); max-width: 480px; line-height: 1.6; margin: 0;">${dict['store_sec2_empty_desc'] || 'Katalog produk digital premium (Ebook, Template Web, Aset Branding, dan Preset Kit) sedang dalam persiapan. Nantikan peluncuran resminya segera!'}</p>
                    </div>
                `;
            } else {
                paginatedList.forEach(prod => {
                    const card = document.createElement('div');
                    card.className = "product-card";
                    
                    let badgeText = "";
                    if (prod.priceNumeric === 0 || prod.category === 'free-web') {
                        badgeText = dict['badge_karya_web'] || 'KARYA WEB';
                    } else if (prod.id === 4) {
                        badgeText = dict['badge_premium'] || 'PREMIUM';
                    } else if (prod.id === 5) {
                        badgeText = dict['product_popular'] || 'POPULER';
                    } else if (prod.id === 6) {
                        badgeText = dict['product_new'] || 'BARU';
                    }
                    const badgeHtml = badgeText ? `<span class="card-badge">${badgeText}</span>` : '';

                    const isFree = prod.priceNumeric === 0 || prod.category === 'free-web';
                    const priceDisplay = isFree ? (dict['price_free'] || 'GRATIS (FREE DEMO)') : prod.priceString;
                    const priceColor = isFree ? 'style="color: var(--accent-color); font-weight: 800;"' : '';
                    
                    let buyBtnText = dict['btn_buy'] || 'BELI SEKARANG';
                    let buyAction = `triggerDirectBuy(${prod.id})`;

                    if (isFree && prod.webLink) {
                        buyBtnText = dict['btn_visit_website'] || 'AKSES WEBSITE';
                        buyAction = `window.open('${prod.webLink}', '_blank', 'noopener,noreferrer')`;
                    } else if (prod.dokuStoreUrl || prod.paymentLink) {
                        buyBtnText = 'BELI SEKARANG';
                        buyAction = `window.open('${prod.dokuStoreUrl || prod.paymentLink}', '_blank', 'noopener,noreferrer')`;
                    }

                    const prodImgSrc = prod.image || prod.image_url || "";
                    const previewContentHtml = prodImgSrc
                        ? `<div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background:radial-gradient(circle at center, #161920 0%, #08090c 100%); padding:14px; position:relative; overflow:hidden;">
                             <img src="${prodImgSrc}" alt="${prod.title_id || 'Produk'}" style="max-width:92%; max-height:92%; object-fit:contain; border-radius:8px; filter:drop-shadow(0 10px 22px rgba(0,0,0,0.8)); transition:transform 0.4s ease;" class="card-cover-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg, rgba(20,22,22,0.8), rgba(6,8,8,0.9));\'><i data-lucide=\'${prod.icon || 'package'}\' style=\'width:48px;height:48px;color:var(--accent-color);\'></i></div>'; lucide.createIcons();">
                           </div>`
                        : `<div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background: linear-gradient(135deg, rgba(20,22,22,0.8), rgba(6,8,8,0.9)); position:relative;">
                             <div style="position:absolute; width:100%; height:100%; opacity:0.15; background-image:radial-gradient(var(--accent-color) 1px, transparent 1px); background-size:15px 15px;"></div>
                             <i data-lucide="${prod.icon || 'package'}" style="width:48px;height:48px;color:var(--accent-color);z-index:2;"></i>
                           </div>`;

                    card.innerHTML = `
                        <div class="product-preview">
                            ${badgeHtml}
                            ${previewContentHtml}
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${(currentLang === 'en' ? prod.title_en : prod.title_id) || dict[prod.titleKey] || prod.title_id || prod.titleKey}</h3>
                            <div class="product-price-tag" ${priceColor}>${priceDisplay}</div>
                            <div class="product-buttons">
                                <button class="btn-store-detail" onclick="openDetails(${prod.id})">${dict['btn_details'] || 'DETAIL'}</button>
                                <button class="btn-store-buy" onclick="${buyAction}">${buyBtnText}</button>
                            </div>
                        </div>
                    `;
                    gridContainer.appendChild(card);
                });
            }

            // Render Pagination Buttons
            renderPagination(totalPages);
            updateCategoryCounts();

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // Section 2: Coffee Treat Direct Action Handler
        window.executeCoffeeTreat = function() {
            const dokuCoffeeUrl = "https://pay.doku.com/p-link/p/TraktirKopi";
            window.open(dokuCoffeeUrl, '_blank', 'noopener,noreferrer');
        };

        // Dynamic category count calculation for Section 2 Digital Sale Products
        function updateCategoryCounts() {
            let counts = { all: 0, ebooks: 0, templates: 0, branding: 0, presets: 0 };
            Object.values(productsData).forEach(prod => {
                if (prod.id === 1 || prod.category === 'coffee' || prod.category === 'free-web') return;
                counts.all++;
                if (counts[prod.category] !== undefined) {
                    counts[prod.category]++;
                }
            });

            // Update DOM
            const allEl = document.getElementById('cat-count-all');
            if (allEl) allEl.textContent = `(${counts.all})`;

            const ebookEl = document.getElementById('cat-count-ebooks');
            if (ebookEl) ebookEl.textContent = `(${counts.ebooks})`;

            const tempEl = document.getElementById('cat-count-templates');
            if (tempEl) tempEl.textContent = `(${counts.templates})`;
            
            const brandEl = document.getElementById('cat-count-branding');
            if (brandEl) brandEl.textContent = `(${counts.branding})`;
            
            const presetEl = document.getElementById('cat-count-presets');
            if (presetEl) presetEl.textContent = `(${counts.presets})`;
        }

        // Render Pagination buttons
        function renderPagination(totalPages) {
            const paginationBox = document.getElementById('shop-pagination-box');
            if (!paginationBox) return;

            if (totalPages <= 1) {
                paginationBox.style.display = 'none';
                return;
            }

            paginationBox.style.display = 'flex';
            paginationBox.innerHTML = '';

            // Previous arrow
            const prev = document.createElement('a');
            prev.href = '#';
            prev.className = 'page-num-btn';
            prev.innerHTML = '<i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>';
            if (currentPage === 1) {
                prev.style.pointerEvents = 'none';
                prev.style.opacity = '0.3';
            } else {
                prev.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage--;
                    renderProductsGrid();
                    lenis.scrollTo('.shop-layout-container', { offset: -100 });
                });
            }
            paginationBox.appendChild(prev);

            // Numbers
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('a');
                btn.href = '#';
                btn.className = `page-num-btn${i === currentPage ? ' active' : ''}`;
                btn.textContent = i;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderProductsGrid();
                    lenis.scrollTo('.shop-layout-container', { offset: -100 });
                });
                paginationBox.appendChild(btn);
            }

            // Next arrow
            const next = document.createElement('a');
            next.href = '#';
            next.className = 'page-num-btn';
            next.innerHTML = '<i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>';
            if (currentPage === totalPages) {
                next.style.pointerEvents = 'none';
                next.style.opacity = '0.3';
            } else {
                next.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage++;
                    renderProductsGrid();
                    lenis.scrollTo('.shop-layout-container', { offset: -100 });
                });
            }
            paginationBox.appendChild(next);
        }

        // Active Category filtering
        const catLinks = document.querySelectorAll('.category-link');
        catLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                catLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                selectedCategory = link.getAttribute('data-category');
                currentPage = 1;
                renderProductsGrid();
            });
        });

        // Active Tag filtering
        const tagBtns = document.querySelectorAll('.tag-btn');
        tagBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tagBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                selectedTag = btn.getAttribute('data-tag');
                currentPage = 1;
                renderProductsGrid();
            });
        });

        // Price filter ranges slider label updater
        window.updatePriceSliderVal = function(val) {
            maxFilterPrice = parseInt(val);
            const label = document.getElementById('price-slider-label');
            if (label) {
                const displayK = maxFilterPrice / 1000;
                label.textContent = `Price: Rp 50k — Rp ${displayK}k`;
            }
        };

        window.applyPriceFilter = function() {
            currentPage = 1;
            renderProductsGrid();
        };

        // Sort handler
        window.handleSort = function(val) {
            activeSorting = val;
            currentPage = 1;
            renderProductsGrid();
        };

        // Cart functions
        window.addToCart = function(id) {
            const product = productsData[id];
            const inCartIdx = cart.findIndex(item => item.id === id);

            if (inCartIdx > -1) {
                cart[inCartIdx].quantity += 1;
            } else {
                cart.push({
                    id: id,
                    product: product,
                    quantity: 1
                });
            }
            
            // Micro glow animation
            const cartWidget = document.getElementById('cart-widget-box');
            if (cartWidget) {
                gsap.fromTo(cartWidget, 
                    { boxShadow: '0 0 0px var(--accent-glow)' },
                    { boxShadow: '0 0 20px var(--accent-color)', duration: 0.3, yoyo: true, repeat: 1 }
                );
            }

            renderCart();
        };

        window.removeFromCart = function(id) {
            cart = cart.filter(item => item.id !== id);
            renderCart();
        };

        function renderCart() {
            const cartContainer = document.getElementById('cart-items-list-container');
            const subtotalEl = document.getElementById('cart-subtotal-val');
            const checkoutBtn = document.getElementById('cart-checkout-btn');
            
            const currentLang = localStorage.getItem('preferred_language') || 'id';
            const dict = translations[currentLang] || translations['id'];

            if (cart.length === 0) {
                cartContainer.innerHTML = `<p class="cart-empty-text">${dict['widget_cart_empty'] || "Belum ada produk di keranjang."}</p>`;
                subtotalEl.textContent = "Rp 0";
                checkoutBtn.disabled = true;
                return;
            }

            // Render list
            cartContainer.innerHTML = "";
            let subtotal = 0;

            cart.forEach(item => {
                const itemTotal = item.product.priceNumeric * item.quantity;
                subtotal += itemTotal;

                const itemRow = document.createElement('div');
                itemRow.className = "cart-item-row";
                itemRow.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${dict[item.product.titleKey] || item.product.titleKey} x${item.quantity}</span>
                        <span class="cart-item-price">Rp ${(itemTotal).toLocaleString('id-ID')}</span>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                `;
                cartContainer.appendChild(itemRow);
            });

            subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
            checkoutBtn.disabled = false;
            lucide.createIcons();
        }

        // Details Modal Operations
        const detailsModal = document.getElementById('modal-details');
        window.currentModalImgUrl = "";
        window.currentModalCaption = "";
        
        window.switchModalPreview = function(imgUrl, caption, btn) {
            window.currentModalImgUrl = imgUrl;
            window.currentModalCaption = caption;

            const imgEl = document.getElementById('detail-modal-img');
            if (imgEl) {
                gsap.to(imgEl, { opacity: 0, scale: 0.95, duration: 0.15, onComplete: () => {
                    imgEl.src = imgUrl;
                    gsap.to(imgEl, { opacity: 1, scale: 1, duration: 0.25 });
                }});
            }
            if (btn && btn.parentElement) {
                btn.parentElement.querySelectorAll('button').forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = '#8e9ab0';
                    b.style.fontWeight = '700';
                    b.style.borderColor = 'rgba(255,255,255,0.15)';
                });
                btn.style.background = 'linear-gradient(135deg, #980000, #c40000)';
                btn.style.color = '#ffffff';
                btn.style.fontWeight = '800';
                btn.style.borderColor = 'transparent';
            }
        };

        window.triggerModalLightbox = function() {
            if (window.currentModalImgUrl) {
                openLightbox(window.currentModalImgUrl, window.currentModalCaption);
            }
        };

        window.openLightbox = function(imgUrl, caption) {
            const lightbox = document.getElementById('modal-lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCap = document.getElementById('lightbox-caption');
            if (!lightbox || !lightboxImg) return;

            lightboxImg.src = imgUrl;
            if (lightboxCap) lightboxCap.textContent = caption || "";

            if (lenis) lenis.stop();
            document.body.style.overflow = 'hidden';
            lightbox.classList.add('active');
            lucide.createIcons();
            gsap.fromTo(lightbox.querySelector('img'), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' });
        };

        window.closeLightbox = function(e) {
            if (e.target.id === 'modal-lightbox') {
                closeLightboxDirect();
            }
        };

        window.closeLightboxDirect = function() {
            const lightbox = document.getElementById('modal-lightbox');
            if (!lightbox) return;
            gsap.to(lightbox.querySelector('img'), { scale: 0.85, opacity: 0, duration: 0.2, onComplete: () => {
                lightbox.classList.remove('active');
                if (!document.getElementById('modal-details').classList.contains('active')) {
                    window.forceUnlockScroll();
                }
            }});
        };

        window.openDetails = function(id) {
            currentActiveProductId = id;
            const product = productsData[id];
            if (!product) return;

            window.currentModalImgUrl = product.image || "";
            window.currentModalCaption = product.title_id || "";
            
            const currentLang = localStorage.getItem('preferred_language') || 'id';
            const dict = translations[currentLang] || translations['id'];
            const banner = document.getElementById('modal-banner');
            banner.className = `detail-preview-banner ${product.class || 'preview-templates'}`;
            if (product.image) {
                banner.innerHTML = `
                    <div style="width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; position:relative;">
                        
                        <!-- Left Column: Clean Unobstructed Image Frame -->
                        <div style="position:relative; display:flex; justify-content:center; align-items:center;">
                            <img id="detail-modal-img" src="${product.image}" alt="${product.title_id}" style="max-height:340px; max-width:100%; object-fit:contain; border-radius:10px; box-shadow: 0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(152,0,0,0.35); border: 1px solid rgba(255, 255, 255, 0.12); transition:transform 0.3s ease;">
                        </div>

                        <!-- Bottom Switcher Pills (Brand Red #980000 Accent) -->
                        ${product.tocImage ? `
                        <div style="display:flex; gap:8px; background:rgba(18,22,28,0.95); border:1px solid rgba(255,255,255,0.12); padding:5px 8px; border-radius:30px; backdrop-filter:blur(10px); z-index:5;">
                            <button onclick="switchModalPreview('${product.image}', '${product.title_id}', this)" class="modal-tab-pill" style="padding:7px 18px; font-size:0.75rem; font-weight:800; border-radius:20px; border:none; background:linear-gradient(135deg, #980000, #c40000); color:#fff; cursor:pointer; transition:all 0.25s ease;">📕 SAMPUL</button>
                            <button onclick="switchModalPreview('${product.tocImage}', 'Daftar Isi (Table of Contents)', this)" class="modal-tab-pill" style="padding:7px 18px; font-size:0.75rem; font-weight:700; border-radius:20px; border:1px solid rgba(255,255,255,0.15); background:transparent; color:#8e9ab0; cursor:pointer; transition:all 0.25s ease;">📑 DAFTAR ISI</button>
                        </div>
                        ` : ''}
                    </div>
                `;
            } else {
                banner.innerHTML = `<div class="preview-decorations"></div><div class="preview-icon-wrapper"><i data-lucide="${product.icon || 'coffee'}" style="width:54px;height:54px;color:#c40000;"></i></div>`;
            }
            
            const categoryKey = product.catKey || 'filter_' + product.category;
            document.getElementById('modal-cat').setAttribute('data-translate', categoryKey);
            document.getElementById('modal-cat').textContent = dict[categoryKey] || product.category || "";
            
            const title = (currentLang === 'en' ? product.title_en : product.title_id) || dict[product.titleKey] || product.title_id || product.titleKey;
            document.getElementById('modal-title').textContent = title;
            
            const desc = (currentLang === 'en' ? product.desc_en : product.desc_id) || dict[product.descKey] || product.desc_id || product.descKey;
            document.getElementById('modal-desc').textContent = desc;

            const isFree = product.priceNumeric === 0 || product.category === 'free-web';
            document.getElementById('modal-price').textContent = isFree && product.category !== 'coffee' ? (dict['price_free'] || 'GRATIS (FREE DEMO)') : product.priceString;

            const list = document.getElementById('modal-features');
            list.innerHTML = "";
            const rawFeatures = (currentLang === 'en' ? product.features_en : product.features_id) || dict[product.featuresKey] || "";
            const featuresArr = rawFeatures.split(/[•|]/).map(f => f.trim()).filter(f => f);
            
            featuresArr.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px;color:#c40000;"></i> <span>${feature}</span>`;
                list.appendChild(li);
            });

            const checkoutBtn = document.getElementById('modal-checkout-btn');
            if (product.category === 'coffee') {
                checkoutBtn.innerHTML = `<i data-lucide="coffee" style="width:18px;height:18px;"></i> <span>TRAKTIR KOPI (SUKARELA)</span>`;
                checkoutBtn.style.background = 'linear-gradient(135deg, #980000, #c40000)';
                checkoutBtn.style.color = '#ffffff';
                checkoutBtn.style.fontWeight = '900';
                checkoutBtn.style.boxShadow = '0 6px 22px rgba(152, 0, 0, 0.5)';
                checkoutBtn.style.border = 'none';
                checkoutBtn.onclick = () => {
                    closeDetails();
                    window.open(product.paymentLink, '_blank', 'noopener,noreferrer');
                };
            } else if (isFree && product.webLink) {
                checkoutBtn.innerHTML = `<i data-lucide="external-link" style="width:18px;height:18px;"></i> <span>${dict['btn_visit_website'] || 'AKSES WEBSITE LANGSUNG'}</span>`;
                checkoutBtn.style.background = 'linear-gradient(135deg, #980000, #c40000)';
                checkoutBtn.style.color = '#ffffff';
                checkoutBtn.style.fontWeight = '900';
                checkoutBtn.style.boxShadow = '0 6px 22px rgba(152, 0, 0, 0.5)';
                checkoutBtn.style.border = 'none';
                checkoutBtn.onclick = () => {
                    closeDetails();
                    window.open(product.webLink, '_blank', 'noopener,noreferrer');
                };
            } else if (product.id === 7 || product.category === 'ebooks') {
                checkoutBtn.innerHTML = `<i data-lucide="shopping-bag" style="width:18px;height:18px;"></i> <span>BELI DI DOKU STORE</span>`;
                checkoutBtn.style.background = 'linear-gradient(135deg, #980000, #c40000)';
                checkoutBtn.style.color = '#ffffff';
                checkoutBtn.style.fontWeight = '900';
                checkoutBtn.style.boxShadow = '0 6px 22px rgba(152, 0, 0, 0.5)';
                checkoutBtn.style.border = 'none';
                checkoutBtn.onclick = () => {
                    closeDetails();
                    window.open(product.dokuStoreUrl || product.paymentLink, '_blank', 'noopener,noreferrer');
                };
            } else {
                checkoutBtn.innerHTML = `<i data-lucide="shopping-bag" style="width:18px;height:18px;"></i> <span>${dict['btn_buy'] || 'BELI SEKARANG'}</span>`;
                checkoutBtn.style.background = 'linear-gradient(135deg, #980000, #c40000)';
                checkoutBtn.style.color = '#ffffff';
                checkoutBtn.style.fontWeight = '900';
                checkoutBtn.style.boxShadow = '0 6px 22px rgba(152, 0, 0, 0.5)';
                checkoutBtn.style.border = 'none';
                checkoutBtn.onclick = () => {
                    closeDetails();
                    setTimeout(() => {
                        triggerDirectBuy(id);
                    }, 400);
                };
            }

            lucide.createIcons();

            if (lenis) lenis.stop();
            document.body.style.overflow = 'hidden';
            detailsModal.scrollTop = 0;
            detailsModal.classList.add('active');
            gsap.fromTo(detailsModal.querySelector('.modal-box'), 
                { scale: 0.9, y: 20, opacity: 0 }, 
                { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
            );
        };

        window.closeDetails = function() {
            gsap.to(detailsModal.querySelector('.modal-box'), {
                scale: 0.9, y: 20, opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: () => {
                    detailsModal.classList.remove('active');
                    window.forceUnlockScroll();
                }
            });
        };

        window.closeDetailsOutside = function(e) {
            if (e.target === detailsModal) {
                closeDetails();
            }
        };

        window.triggerDirectBuy = function(id) {
            const product = productsData[id];
            if (!product) return;

            const targetUrl = product.dokuStoreUrl || product.paymentLink || "https://dashboard.doku.com/retail/merchant/ZeifurRohmanFreelanc6206/EbookPersonalBrandingAnakMudadiEraDigital-849405b25d1d4b8f";

            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        };

        // Scroll to Top action in footer
        const toTopBtn = document.querySelector('.to-top-btn');
        if (toTopBtn) {
            toTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                lenis.scrollTo(0);
            });
        }

        // Listen for language changes to update translation rendering
        window.addEventListener('languageChanged', (e) => {
            renderProductsGrid();
        });

        async function fetchProducts() {
            try {
                const response = await fetch('api/get_products.php');
                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }
                const data = await response.json();
                if (data && Object.keys(data).length > 0) {
                    for (const key in productsData) {
                        delete productsData[key];
                    }
                    Object.assign(productsData, data);

                    // Update CapKarya showcase image dynamically if custom image exists in database
                    const capKaryaProd = Object.values(productsData).find(p => p.id === 2 || (p.title_id && p.title_id.toLowerCase().includes('capkarya')));
                    if (capKaryaProd) {
                        const capImg = capKaryaProd.image || capKaryaProd.image_url;
                        if (capImg) {
                            const capImgEl = document.getElementById('capkarya-preview-img');
                            if (capImgEl) capImgEl.src = capImg;
                        }
                    }
                }
            } catch (error) {
                console.warn("Database offline or local file mode. Loading default static product.", error);
            }
        }

        // Initial setup
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            
            setTimeout(async () => {
                if (preloader) {
                    // Dynamically fetch catalog from database before showing
                    await fetchProducts();

                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';
                        if (typeof lenis !== 'undefined') lenis.start();
                    }, 400);

                    renderProductsGrid();
                        
                    const tl = gsap.timeline();
                    // Fix sidebar FOUC opacity to make it fully show up
                    tl.fromTo('.sidebar', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' })
                        .from('.shop-topbar', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
                        .from('.shop-cover-banner', { opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.out' }, '-=0.6')
                        .from('.shop-layout-container', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
                        .from('.footer-section', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
                }
            }, 1000);
        });
