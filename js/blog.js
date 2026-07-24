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

// Default Static Fallback Data for Blog Posts
let blogsData = {
    "post1": {
        id: "post1",
        numeric_id: 1,
        slug: "strategi-pengembangan-website-modern",
        title_id: "STRATEGI PENGEMBANGAN WEBSITE MODERN YANG CEPAT DAN RESPONSIF",
        title_en: "MODERN WEB DEVELOPMENT STRATEGY FOR HIGH SPEED AND RESPONSIVENESS",
        category: "website",
        tags: "branding,website",
        author: "ZEIFUR ROHMAN",
        date: "JUNE 08, 2026",
        excerpt_id: "Dalam era digital saat ini, performa dan aksesibilitas website adalah kunci keberhasilan bisnis. Pelajari bagaimana memadukan vanilla JavaScript, animasi GSAP, dan optimalisasi Core Web Vitals untuk menciptakan pengalaman pengguna yang mulus.",
        excerpt_en: "In today's digital era, website performance and accessibility are key to business success. Learn how to blend vanilla JavaScript, GSAP animations, and Core Web Vitals optimization.",
        content_id: "<h3>Metodologi Clean Code & Performa Utama</h3><p>Membangun website modern tidak lagi sekadar tentang visual yang indah, melainkan tentang kecepatan muat halaman dan struktur kode yang efisien...</p>",
        content_en: "<h3>Clean Code Methodology & Peak Performance</h3><p>Building modern websites is no longer just about aesthetics, but page load speed and efficient code architecture...</p>",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "post2": {
        id: "post2",
        numeric_id: 2,
        slug: "filosofi-branding-visual-identitas-logo",
        title_id: "FILOSOFI BRANDING VISUAL: MENERJEMAHKAN VISI MENJADI IDENTITAS LOGO",
        title_en: "VISUAL BRANDING PHILOSOPHY: TRANSLATING VISION INTO LOGO IDENTITY",
        category: "branding",
        tags: "branding",
        author: "ZEIFUR ROHMAN",
        date: "JUNE 05, 2026",
        excerpt_id: "Logo bukan sekadar gambar, melainkan sebuah representasi filosofis dari visi dan misi suatu brand. Sebagai desainer visual, penting bagi saya untuk melakukan riset audiens dan merumuskan panduan brand digital yang komprehensif.",
        excerpt_en: "A logo is not just an image, but a philosophical representation of a brand's vision and mission. It is vital to perform audience research and formulate comprehensive brand guidelines.",
        content_id: "<h3>Eksplorasi Monogram & Identitas Visual</h3><p>Setiap garis dan warna dalam desain logo memiliki bobot emosional dan daya pikat bisnis...</p>",
        content_en: "<h3>Monogram Exploration & Visual Identity</h3><p>Every line and color in logo design holds emotional weight and business appeal...</p>",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "post3": {
        id: "post3",
        numeric_id: 3,
        slug: "seni-fotografi-dokumenter-dan-penceritaan-visual",
        title_id: "TEKNIK FOTOGRAFI DOKUMENTASI DAN OLAHRAGA BERKECEPATAN TINGGI",
        title_en: "HIGH-SPEED SPORTS AND DOCUMENTARY PHOTOGRAPHY TECHNIQUES",
        category: "photography",
        tags: "photography",
        author: "ZEIFUR ROHMAN",
        date: "MAY 29, 2026",
        excerpt_id: "Fotografi dokumentasi dan olahraga menuntut kesiapan teknis yang luar biasa dan kecepatan reaksi di lapangan. Simak panduan mendalam tentang shutter speed, dynamic range, dan komposisi visual.",
        excerpt_en: "Documentary and sports photography demand extraordinary technical readiness and quick field reactions. Discover shutter speed, dynamic range, and composition secrets.",
        content_id: "<h3>Teknik Framing & Esensi Visual</h3><p>Melalui kamera, kita membekukan fragmen waktu menjadi kenangan abadi...</p>",
        content_en: "<h3>Framing Techniques & Visual Essence</h3><p>Through the lens, we freeze fragments of time into everlasting memories...</p>",
        image: "assets/images/portofolio/foto-sport-display-2-cropped.jpg"
    }
};

// Fetch dynamic blog posts from Database API endpoint
async function fetchBlogsFromApi() {
    try {
        const response = await fetch('api/get_blogs.php');
        if (response.ok) {
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                blogsData = data;
            }
        }
    } catch (e) {
        console.warn("Database API offline or offline mode. Loading default static blog data.", e);
    }
}

// Preloader & Animations
window.addEventListener('load', async () => {
    const preloader = document.querySelector('.preloader');
    
    // Fetch DB blogs first
    await fetchBlogsFromApi();

    // Render Posts HTML dynamically into DOM
    renderAllBlogArticles();

    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                tl.fromTo('.sidebar', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
                  .from('.blog-topbar', { y: -30, opacity: 0, duration: 0.8 }, '-=0.6')
                  .from('.blog-cover-content', { scale: 0.95, opacity: 0, duration: 1.2 }, '-=0.6')
                  .from('.blog-post', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2 }, '-=0.8')
                  .from('.sidebar-widget', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=1');
                
                // Check deep link hash or query param (SEO URL navigation)
                checkUrlHashNavigation();
            }, 400);
        }
    }, 800);
});

// Interactive Custom Cursor
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
}

// Slide-out Menu Panel Logic
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel = document.querySelector('.menu-panel');
const menuOverlay = document.querySelector('.menu-panel-overlay');

if (menuToggle && menuPanel && menuOverlay) {
    const closeMenu = () => {
        document.body.classList.remove('menu-open');
        lenis.start();
        const isDesktop = window.innerWidth > 1024;
        gsap.to(menuPanel, { left: isDesktop ? -400 : '-100%', duration: 0.6, ease: 'power4.inOut' });
        gsap.to(menuOverlay, { opacity: 0, visibility: 'hidden', duration: 0.4 });
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('menu-open');
        if (isOpen) {
            lenis.stop();
            const isDesktop = window.innerWidth > 1024;
            gsap.to(menuPanel, { left: isDesktop ? 80 : 0, duration: 0.6, ease: 'power4.out' });
            gsap.to(menuOverlay, { opacity: 1, visibility: 'visible', duration: 0.4 });
        } else {
            closeMenu();
        }
    });

    menuOverlay.addEventListener('click', closeMenu);
}

// Search Modal
const searchTrigger = document.querySelector('.search-trigger');
const searchModal = document.querySelector('.search-modal');
const searchClose = document.querySelector('.search-close');
const searchInput = document.querySelector('.search-input');

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
            filterPosts('all', 'category');
        }, 400);
        lenis.start();
    };

    searchClose.addEventListener('click', closeSearch);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
    });

    searchInput.addEventListener('input', (e) => {
        filterPosts(e.target.value.toLowerCase(), 'search');
    });
}

// Render All Blog Articles Dynamically into DOM
function renderAllBlogArticles() {
    const postsColumn = document.querySelector('.blog-posts-column');
    if (!postsColumn) return;

    const currentLang = localStorage.getItem('preferred_language') || 'id';

    // Clear existing article elements except detail-header-nav
    const detailHeaderNav = postsColumn.querySelector('.detail-header-nav');
    postsColumn.innerHTML = '';
    if (detailHeaderNav) postsColumn.appendChild(detailHeaderNav);

    Object.values(blogsData).forEach(b => {
        const title = (currentLang === 'en' && b.title_en) ? b.title_en : b.title_id;
        const excerpt = (currentLang === 'en' && b.excerpt_en) ? b.excerpt_en : b.excerpt_id;
        const content = (currentLang === 'en' && b.content_en) ? b.content_en : b.content_id;
        const img = b.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

        const article = document.createElement('article');
        article.className = 'blog-post';
        article.setAttribute('data-post-id', b.id);
        article.setAttribute('data-slug', b.slug || b.id);
        article.setAttribute('data-category', b.category || 'website');
        article.setAttribute('data-tags', b.tags || 'website');

        article.innerHTML = `
            <div class="post-accent-line"></div>
            <h2 class="post-title">
                <a href="#${b.slug || b.id}" class="post-link" data-post-id="${b.id}">${title}</a>
            </h2>
            
            <div class="post-meta-bar">
                <span class="post-meta-date">${b.date}</span>
                <span class="post-meta-sep">/</span>
                <div class="post-meta-cat">
                    <span>KATEGORI :</span> <span style="text-transform:uppercase; font-weight:700;">${b.category}</span>
                </div>
            </div>

            <div class="post-media">
                <img src="${img}" alt="${title}" loading="lazy">
            </div>

            <div class="post-details">
                <div class="post-details-item">
                    <i data-lucide="user"></i>
                    <span>${b.author || 'ZEIFUR ROHMAN'}</span>
                </div>
            </div>

            <p class="post-excerpt">${excerpt}</p>
            
            <a href="#${b.slug || b.id}" class="btn-read-more post-link" data-post-id="${b.id}">BACA SELENGKAPNYA</a>

            <!-- Full content (Inline reading) -->
            <div class="post-full-content" style="display: none;">
                <div class="full-content-body">${content}</div>
                <div class="post-detail-nav" style="margin-top: 40px; padding-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <button class="btn-back-to-list" onclick="resetToListView()">
                        <i data-lucide="arrow-left"></i> <span>KEMBALI KE DAFTAR ARTIKEL</span>
                    </button>
                </div>
            </div>
        `;

        postsColumn.appendChild(article);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Re-attach handlers
    attachPostClickEvents();
    updateCategoryCounts();
    renderPosts(false);
}

// Categories & Tags Filtering
let activePostId = null;
let currentPage = 1;
const postsPerPage = 2;
let activeFilterType = 'category';
let activeFilterVal = 'all';

function updateCategoryCounts() {
    const blogPosts = document.querySelectorAll('.blog-post');
    const categoryLinks = document.querySelectorAll('.category-item-link');
    const counts = { all: blogPosts.length, website: 0, branding: 0, photography: 0, tutorial: 0 };

    blogPosts.forEach(post => {
        const cat = post.getAttribute('data-category');
        if (cat in counts) counts[cat]++;
    });

    categoryLinks.forEach(link => {
        const cat = link.getAttribute('data-category');
        if (cat in counts) {
            const countSpan = link.querySelector('.category-count');
            if (countSpan) countSpan.textContent = `(${counts[cat]})`;
        }
    });
}

function renderPosts(animate = false) {
    const blogPosts = document.querySelectorAll('.blog-post');
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

    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    matchedPosts.forEach((post, idx) => {
        if (idx >= startIndex && idx < endIndex) {
            post.style.display = 'block';
            if (animate) {
                gsap.fromTo(post, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
            }
        } else {
            post.style.display = 'none';
        }
    });

    renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
    const paginationWidget = document.querySelector('.blog-pagination');
    if (!paginationWidget) return;

    if (totalPages <= 1) {
        paginationWidget.style.display = 'none';
        return;
    }

    paginationWidget.style.display = 'flex';
    paginationWidget.innerHTML = '';

    const prevBtn = document.createElement('a');
    prevBtn.href = '#';
    prevBtn.className = 'page-num-btn';
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

    const nextBtn = document.createElement('a');
    nextBtn.href = '#';
    nextBtn.className = 'page-num-btn';
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

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterPosts(filterVal, type) {
    if (activePostId) resetToListView();
    activeFilterType = type;
    activeFilterVal = filterVal;
    currentPage = 1;
    renderPosts(true);
}

// Category & Tag filter click attachments
document.querySelectorAll('.category-item-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.category-item-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const category = link.getAttribute('data-category');
        filterPosts(category, 'category');
    });
});

document.querySelectorAll('.blog-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.blog-tag-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.getAttribute('data-tag');
        filterPosts(tag, 'tag');
    });
});

// Single Post Detail & SEO Meta Tag Updater
function showPostDetail(postId) {
    activePostId = postId;
    const blogPosts = document.querySelectorAll('.blog-post');
    const detailHeaderNav = document.querySelector('.detail-header-nav');
    const paginationWidget = document.querySelector('.blog-pagination');

    let activeData = blogsData[postId];
    if (!activeData) {
        activeData = Object.values(blogsData).find(b => b.slug === postId || b.id === postId);
    }

    // Dynamic SEO Updates for Google Indexing
    if (activeData) {
        document.title = `${activeData.title_id} | Blog Zeifur Rohman`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', activeData.excerpt_id);
    }

    blogPosts.forEach(post => {
        if (post.getAttribute('data-post-id') !== postId && post.getAttribute('data-slug') !== postId) {
            post.style.display = 'none';
        } else {
            post.style.display = 'block';
            post.classList.add('is-single-view');
            
            const fullContent = post.querySelector('.post-full-content');
            if (fullContent) fullContent.style.display = 'block';

            const excerpt = post.querySelector('.post-excerpt');
            const readMore = post.querySelector('.btn-read-more');
            if (excerpt) excerpt.style.display = 'none';
            if (readMore) readMore.style.display = 'none';
        }
    });

    if (paginationWidget) paginationWidget.style.display = 'none';
    if (detailHeaderNav) {
        detailHeaderNav.style.display = 'block';
        gsap.fromTo(detailHeaderNav, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });
    }

    lenis.scrollTo('.blog-layout-container', { offset: -120 });
}

function resetToListView() {
    if (!activePostId) return;

    // Reset SEO title
    document.title = "Zeifur Rohman | Creative Blog";

    const activePost = document.querySelector(`.blog-post[data-post-id="${activePostId}"], .blog-post[data-slug="${activePostId}"]`);
    if (activePost) {
        activePost.classList.remove('is-single-view');
        const fullContent = activePost.querySelector('.post-full-content');
        if (fullContent) fullContent.style.display = 'none';
        const excerpt = activePost.querySelector('.post-excerpt');
        const readMore = activePost.querySelector('.btn-read-more');
        if (excerpt) excerpt.style.display = 'block';
        if (readMore) readMore.style.display = 'inline-block';
    }

    activePostId = null;
    const detailHeaderNav = document.querySelector('.detail-header-nav');
    if (detailHeaderNav) detailHeaderNav.style.display = 'none';

    renderPosts(true);
    lenis.scrollTo('.blog-layout-container', { offset: -120 });
}

function attachPostClickEvents() {
    document.querySelectorAll('.post-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const postId = link.getAttribute('data-post-id') || link.closest('.blog-post').getAttribute('data-post-id');
            if (postId) {
                showPostDetail(postId);
            }
        });
    });

    document.querySelectorAll('.btn-back-to-list').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            resetToListView();
        });
    });
}

function checkUrlHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const found = Object.values(blogsData).find(b => b.slug === hash || b.id === hash);
        if (found) {
            showPostDetail(found.id);
        }
    }
}

// Back to top button
const toTopBtn = document.querySelector('.to-top-btn');
if (toTopBtn) {
    toTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0);
    });
}
