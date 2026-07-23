// Blog Page JavaScript Logic - Zeifur Rohman Personal Web
        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Preloader Logic
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('fade-out');
                    
                    // Entrance Animations
                    setTimeout(() => {
                        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                        tl.fromTo('.sidebar', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
                          .from('.blog-topbar', { y: -30, opacity: 0, duration: 0.8 }, '-=0.6')
                          .from('.blog-cover-content', { scale: 0.95, opacity: 0, duration: 1.2 }, '-=0.6')
                          .from('.blog-post', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2 }, '-=0.8')
                          .from('.sidebar-widget', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=1');
                    }, 400);
                }
            }, 1000);
        });

        // Interactive Custom Cursor Logic (consistent with index.html)
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

            // Event delegation for interactive hover states
            document.addEventListener('mouseover', (e) => {
                const target = e.target.closest('a, button, .blog-tag-btn, .category-item-link, .slider-arrow, .search-close, .detail-close, [role="button"]');
                if (target) {
                    cursor.classList.add('is-hovered');
                    follower.classList.add('is-hovered');
                } else {
                    cursor.classList.remove('is-hovered');
                    follower.classList.remove('is-hovered');
                }
            });
        }

        // Slide-out Menu Panel Logic (consistent with index.html)
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

        // JS Logic 1: GSAP Image Slider for Post 1
        const slider = document.getElementById('post1-slider');
        if (slider) {
            const slidesContainer = slider.querySelector('.slider-slides');
            const slides = slider.querySelectorAll('.slide-img-item');
            const prevBtn = slider.querySelector('.slider-arrow-prev');
            const nextBtn = slider.querySelector('.slider-arrow-next');
            const dots = slider.querySelectorAll('.slider-dot-btn');
            let currentIndex = 0;
            const totalSlides = slides.length;

            const updateSlider = (index) => {
                currentIndex = (index + totalSlides) % totalSlides;
                
                // Animate position
                gsap.to(slidesContainer, {
                    x: `-${currentIndex * 100}%`,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });

                // Update dots
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            };

            prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
            nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));

            dots.forEach((dot) => {
                dot.addEventListener('click', () => {
                    const slideIndex = parseInt(dot.getAttribute('data-slide'));
                    updateSlider(slideIndex);
                });
            });
        }

        // JS Logic 2: Search Dialog overlay trigger
        const searchTrigger = document.querySelector('.search-trigger');
        const searchModal = document.getElementById('search-modal-overlay');
        const searchClose = document.getElementById('search-close-btn');
        const searchInput = document.getElementById('search-input-field');

        if (searchTrigger && searchModal && searchClose) {
            searchTrigger.addEventListener('click', () => {
                searchModal.style.display = 'flex';
                searchModal.offsetHeight;
                searchModal.classList.add('show');
                searchInput.focus();
                lenis.stop();
            });

            const closeSearch = () => {
                searchModal.classList.remove('show');
                setTimeout(() => {
                    searchModal.style.display = 'none';
                    searchInput.value = '';
                    
                    // Restore active category or tag
                    const activeCatLink = document.querySelector('.category-item-link.active');
                    const activeTagBtn = document.querySelector('.blog-tag-btn.active');
                    if (activeCatLink && activeCatLink.getAttribute('data-category') !== 'all') {
                        filterPosts(activeCatLink.getAttribute('data-category'), 'category');
                    } else if (activeTagBtn && activeTagBtn.getAttribute('data-tag') !== 'all') {
                        filterPosts(activeTagBtn.getAttribute('data-tag'), 'tag');
                    } else {
                        filterPosts('all', 'category');
                    }
                }, 400);
                lenis.start();
            };

            searchClose.addEventListener('click', closeSearch);
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal) closeSearch();
            });

            // Trigger filtering on typing
            searchInput.addEventListener('input', (e) => {
                filterPosts(e.target.value.toLowerCase(), 'search');
            });
        }

        // JS Logic 3: Categories & Tags Filtering and Pagination
        let activePostId = null;
        const blogPosts = document.querySelectorAll('.blog-post');
        const categoryLinks = document.querySelectorAll('.category-item-link');
        const tagButtons = document.querySelectorAll('.blog-tag-btn');
        const categoriesTriggerBtn = document.querySelector('.categories-trigger');

        // Dynamic Category Counter
        const updateCategoryCounts = () => {
            const counts = {
                all: blogPosts.length,
                website: 0,
                branding: 0,
                photography: 0,
                quotes: 0,
                kehidupan: 0
            };
            blogPosts.forEach(post => {
                const cat = post.getAttribute('data-category');
                if (cat in counts) {
                    counts[cat]++;
                }
            });
            categoryLinks.forEach(link => {
                const cat = link.getAttribute('data-category');
                if (cat in counts) {
                    const countSpan = link.querySelector('.category-count');
                    if (countSpan) {
                        countSpan.textContent = `(${counts[cat]})`;
                    }
                }
            });
        };

        // Pagination State
        let currentPage = 1;
        const postsPerPage = 2;
        let activeFilterType = 'category'; // 'category', 'tag', 'search'
        let activeFilterVal = 'all';      // 'all', tag_name, category_name, search_query

        const renderPosts = (animate = false) => {
            const matchedPosts = [];
            blogPosts.forEach(post => {
                let matches = false;
                if (activeFilterType === 'category') {
                    const postCat = post.getAttribute('data-category');
                    matches = (activeFilterVal === 'all' || postCat === activeFilterVal);
                } else if (activeFilterType === 'tag') {
                    const postTags = post.getAttribute('data-tags').split(',');
                    matches = (activeFilterVal === 'all' || postTags.includes(activeFilterVal));
                } else if (activeFilterType === 'search') {
                    const titleText = post.querySelector('.post-title').textContent.toLowerCase();
                    const excerptText = post.querySelector('.post-excerpt').textContent.toLowerCase();
                    matches = (titleText.includes(activeFilterVal) || excerptText.includes(activeFilterVal));
                }

                if (matches) {
                    matchedPosts.push(post);
                } else {
                    post.style.display = 'none';
                }
            });

            const totalPosts = matchedPosts.length;
            const totalPages = Math.ceil(totalPosts / postsPerPage);

            // Correct current page if out of bounds
            if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
            if (currentPage < 1) currentPage = 1;

            const startIndex = (currentPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            matchedPosts.forEach((post, idx) => {
                if (idx >= startIndex && idx < endIndex) {
                    post.style.display = 'block';
                    if (animate) {
                        gsap.fromTo(post, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
                    } else {
                        post.style.opacity = 1;
                        post.style.transform = 'none';
                    }
                } else {
                    post.style.display = 'none';
                }
            });

            // Update pagination control visibility and buttons
            renderPaginationControls(totalPages);
        };

        const renderPaginationControls = (totalPages) => {
            const paginationWidget = document.querySelector('.blog-pagination');
            if (!paginationWidget) return;

            if (totalPages <= 1) {
                paginationWidget.style.display = 'none';
                return;
            }

            paginationWidget.style.display = 'flex';
            paginationWidget.innerHTML = '';

            // Previous Button
            const prevBtn = document.createElement('a');
            prevBtn.href = '#';
            prevBtn.className = 'page-num-btn';
            prevBtn.setAttribute('aria-label', 'Previous page');
            prevBtn.innerHTML = '<i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>';
            if (currentPage === 1) {
                prevBtn.style.pointerEvents = 'none';
                prevBtn.style.opacity = '0.4';
            } else {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage--;
                    renderPosts(true);
                    lenis.scrollTo('.blog-layout-container', { offset: -120 });
                });
            }
            paginationWidget.appendChild(prevBtn);

            // Page Number Buttons
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('a');
                pageBtn.href = '#';
                pageBtn.className = `page-num-btn${i === currentPage ? ' active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderPosts(true);
                    lenis.scrollTo('.blog-layout-container', { offset: -120 });
                });
                paginationWidget.appendChild(pageBtn);
            }

            // Next Button
            const nextBtn = document.createElement('a');
            nextBtn.href = '#';
            nextBtn.className = 'page-num-btn';
            nextBtn.setAttribute('aria-label', 'Next page');
            nextBtn.innerHTML = '<i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>';
            if (currentPage === totalPages) {
                nextBtn.style.pointerEvents = 'none';
                nextBtn.style.opacity = '0.4';
            } else {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage++;
                    renderPosts(true);
                    lenis.scrollTo('.blog-layout-container', { offset: -120 });
                });
            }
            paginationWidget.appendChild(nextBtn);

            // Initialize icons in pagination controls
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        };

        const filterPosts = (filterVal, type) => {
            if (activePostId) {
                resetToListView();
            }
            activeFilterType = type;
            activeFilterVal = filterVal;
            currentPage = 1;
            renderPosts(true);
        };

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Clear tag active styling
                tagButtons.forEach(b => b.classList.remove('active'));
                document.querySelector('.blog-tag-btn[data-tag="all"]').classList.add('active');

                const category = link.getAttribute('data-category');
                filterPosts(category, 'category');
            });
        });

        tagButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tagButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Clear category active styling
                categoryLinks.forEach(l => l.classList.remove('active'));
                document.querySelector('.category-item-link[data-category="all"]').classList.add('active');

                const tag = btn.getAttribute('data-tag');
                filterPosts(tag, 'tag');
            });
        });

        if (categoriesTriggerBtn) {
            categoriesTriggerBtn.addEventListener('click', () => {
                const catWidget = document.querySelector('.sidebar-widget:last-child');
                if (catWidget) {
                    lenis.scrollTo(catWidget, { offset: -100 });
                }
            });
        }

        // JS Logic 4: Inline Article Detail View and Navigation
        const detailHeaderNav = document.querySelector('.detail-header-nav');
        const paginationWidget = document.querySelector('.blog-pagination');
        const backToListButtons = document.querySelectorAll('.btn-back-to-list');
        const postLinks = document.querySelectorAll('.post-link, .btn-read-more');

        const updateInlinePostContent = (lang) => {
            if (!activePostId) return;
            const activePost = document.querySelector(`.blog-post[data-post-id="${activePostId}"]`);
            if (activePost) {
                const bodyContainer = activePost.querySelector('.full-content-body');
                if (bodyContainer && window.translations && translations[lang]) {
                    const bodyKey = `blog_${activePostId}_body`;
                    if (translations[lang][bodyKey]) {
                        bodyContainer.innerHTML = translations[lang][bodyKey];
                    }
                }
            }
        };

        const showPostDetail = (postId) => {
            activePostId = postId;
            const currentLang = localStorage.getItem('preferred_language') || 'id';

            // Hide all other posts
            blogPosts.forEach(post => {
                if (post.getAttribute('data-post-id') !== postId) {
                    post.style.display = 'none';
                } else {
                    post.style.display = 'block';
                    post.classList.add('is-single-view');
                    
                    // Style the post meta bar
                    const metaBar = post.querySelector('.post-meta-bar');
                    if (metaBar) metaBar.classList.add('full-meta-bar');

                    // Populate and show full content
                    const fullContent = post.querySelector('.post-full-content');
                    if (fullContent) {
                        fullContent.style.display = 'block';
                        updateInlinePostContent(currentLang);
                    }

                    // Hide excerpt and read more button
                    const excerpt = post.querySelector('.post-excerpt');
                    const readMore = post.querySelector('.btn-read-more');
                    if (excerpt) excerpt.style.display = 'none';
                    if (readMore) readMore.style.display = 'none';
                }
            });

            // Hide pagination
            if (paginationWidget) paginationWidget.style.display = 'none';

            // Show top back button
            if (detailHeaderNav) {
                detailHeaderNav.style.display = 'block';
                gsap.fromTo(detailHeaderNav, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });
            }

            // Scroll to the top of the posts column
            lenis.scrollTo('.blog-layout-container', { offset: -120 });
        };

        const resetToListView = () => {
            if (!activePostId) return;

            // Reset active post elements
            const activePost = document.querySelector(`.blog-post[data-post-id="${activePostId}"]`);
            if (activePost) {
                activePost.classList.remove('is-single-view');
                const metaBar = activePost.querySelector('.post-meta-bar');
                if (metaBar) metaBar.classList.remove('full-meta-bar');

                const fullContent = activePost.querySelector('.post-full-content');
                if (fullContent) fullContent.style.display = 'none';

                const excerpt = activePost.querySelector('.post-excerpt');
                const readMore = activePost.querySelector('.btn-read-more');
                if (excerpt) excerpt.style.display = 'block';
                if (readMore) readMore.style.display = 'inline-block';
            }

            activePostId = null;

            // Hide top back button
            if (detailHeaderNav) detailHeaderNav.style.display = 'none';

            // Restore all posts based on pagination and filter states
            renderPosts(true);

            lenis.scrollTo('.blog-layout-container', { offset: -120 });
        };

        // Attach click handlers to links
        postLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = link.getAttribute('data-post-id') || link.closest('.blog-post').getAttribute('data-post-id');
                if (postId) {
                    showPostDetail(postId);
                }
            });
        });

        // Attach back buttons
        backToListButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                resetToListView();
            });
        });

        // Listen for language changes to update contents
        window.addEventListener('languageChanged', (e) => {
            updateInlinePostContent(e.detail.lang);
        });

        // Back to top button inside footer
        const toTopBtn = document.querySelector('.to-top-btn');
        if (toTopBtn) {
            toTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                lenis.scrollTo(0);
            });
        }

        // Initialize posts with pagination of 2 posts
        updateCategoryCounts();
        renderPosts(false);

        // Initialize Lucide icons on DOM Ready
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
