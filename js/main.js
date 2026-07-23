// Initialize Lenis for Smooth Scrolling
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

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

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

    // Event delegation for interactive hover states
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .port-item, .menu-toggle, .lang-btn, .social-box, .social-circle, .filter-btn, .hero-arrow-btn, .nav-arrow, .to-top-btn, [role="button"]');
        if (target) {
            cursor.classList.add('is-hovered');
            follower.classList.add('is-hovered');
        } else {
            cursor.classList.remove('is-hovered');
            follower.classList.remove('is-hovered');
        }
    });
}

// Preloader & Initial Animations
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    // Snappy loading timeout for better UX
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            
            // Start Hero Animations after preloader starts fading
            setTimeout(() => {
                const tl = gsap.timeline({
                    defaults: { ease: 'power3.out' }
                });
                
                // 1. Zoom out background image smoothly (Cinematic luxury feel) and fade out shutter overlay
                tl.fromTo('.hero-bg-image', 
                    { scale: 1.15 }, 
                    { scale: 1.0, duration: 2.2, ease: 'power2.out' }
                )
                .fromTo('.hero-bg-shutter', 
                    { opacity: 0.9 }, 
                    { opacity: 0, duration: 2.0, ease: 'power2.out' }, 
                    '0'
                )
                // 2. Slide Sidebar in from the left
                .fromTo('.sidebar', 
                    { x: -80, opacity: 0 }, 
                    { x: 0, opacity: 1, duration: 1.4, ease: 'power4.out' }, 
                    '-=1.8'
                )
                // 3. Slide vertical tag from the left
                .fromTo('.vertical-tag', 
                    { x: -30, opacity: 0 }, 
                    { x: 0, opacity: 1, duration: 1.0 }, 
                    '-=1.2'
                )
                // 4. Slide up title elegantly
                .fromTo('.hero-display-title', 
                    { y: 80, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out' }, 
                    '-=1.0'
                )
                // 5. Dynamic drawing scale-out for the accent line
                .fromTo('.hero-accent-line', 
                    { scaleX: 0, opacity: 0 }, 
                    { scaleX: 1, opacity: 1, duration: 1.0, transformOrigin: 'left center' }, 
                    '-=0.8'
                )
                // 6. Slide up description text
                .fromTo('.hero-desc', 
                    { y: 30, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 1.0 }, 
                    '-=0.8'
                )
                // 7. Pop in CTA button cleanly
                .fromTo('.cta-btn', 
                    { scale: 0.85, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, 
                    '-=0.6'
                )
                // 8. Slide up bottom layout indicators
                .fromTo('.hero-bottom', 
                    { y: 30, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 1.0 }, 
                    '-=0.6'
                );

                // 9. Mobile: animate sub-nav entrance from below
                if (window.innerWidth <= 1024) {
                    gsap.to('.sub-nav', {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: 0.6
                    });
                }
                
                // Allow scrolling after preloader is gone
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }, 400);
        } else {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }
    }, 1200);
});

// Ensure body scroll is unlocked if preloader is not present or active
if (!document.querySelector('.preloader')) {
    document.body.style.overflow = '';
}

// Mobile Sub-nav Sticky Logic: switch from absolute (bottom of hero) to fixed (below top navbar)
const subNav = document.querySelector('.hero-split .sub-nav');
const heroSection = document.querySelector('.hero-split');

function updateSubNavSticky() {
    if (window.innerWidth > 1024) return; // desktop uses CSS sticky, not this logic
    if (!subNav || !heroSection) return;
    
    // The sub-nav should become sticky after the user scrolls past the hero
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    // Threshold: when hero bottom reaches 70px (top navbar height) + sub-nav height (~45px)
    if (heroBottom <= 115) {
        subNav.classList.add('is-sticky');
    } else {
        subNav.classList.remove('is-sticky');
    }
}

// Use Lenis scroll event for accuracy
lenis.on('scroll', updateSubNavSticky);
// Also fire on first paint
window.addEventListener('resize', updateSubNavSticky);

// Section mapping to page index (01 - 08)
const sectionPageMap = {
    'hero': 1,
    'about': 2,
    'services': 3,
    'process': 4,
    'skills': 5,
    'resume': 6,
    'clients': 7,
    'portofolio': 8
};

// Dynamic progress indicator updater
function updateProgress(pageNumber) {
    const percentage = (pageNumber / 8) * 100;
    
    // Update Hero Bottom Progress
    const heroFill = document.querySelector('.hero-progress-indicator .progress-bar-fill');
    const heroText = document.querySelector('.hero-progress-indicator .progress-text');
    if (heroFill) {
        gsap.to(heroFill, { width: `${percentage}%`, duration: 0.5, ease: 'power2.out' });
    }
    if (heroText) {
        heroText.textContent = `${String(pageNumber).padStart(2, '0')} — 08`;
    }
    
    // Update Side Panel Progress
    const sideFill = document.getElementById('side-progress-fill');
    const sideText = document.getElementById('side-progress-text');
    if (sideFill) {
        gsap.to(sideFill, { width: `${percentage}%`, duration: 0.5, ease: 'power2.out' });
    }
    if (sideText) {
        sideText.textContent = `${String(pageNumber).padStart(2, '0')} — 08`;
    }

    // Update Mobile Navbar Progress
    const mobileFill = document.getElementById('mobile-progress-fill');
    const mobileText = document.getElementById('mobile-progress-text');
    if (mobileFill) {
        gsap.to(mobileFill, { width: `${percentage}%`, duration: 0.5, ease: 'power2.out' });
    }
    if (mobileText) {
        mobileText.textContent = `${String(pageNumber).padStart(2, '0')} — 08`;
    }
}

// Fixed Panel & Layer Switching Logic
const contentSections = document.querySelectorAll('.content-section');
const bgLayers = document.querySelectorAll('.bg-layer');
// Select sub-links from BOTH nav variants (mobile inside hero + desktop sticky)
const subLinks = document.querySelectorAll('.sub-links a');

// Hero section trigger to update progress back to 01
ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => updateProgress(1),
    onEnterBack: () => updateProgress(1)
});

contentSections.forEach((section) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => switchLayer(section.id),
        onEnterBack: () => switchLayer(section.id)
    });
});

// Class trigger to reveal progress indicators in sub-nav on scroll
ScrollTrigger.create({
    trigger: '#about',
    start: 'top 85%',
    onEnter: () => document.body.classList.add('scrolled-past-hero'),
    onLeaveBack: () => document.body.classList.remove('scrolled-past-hero')
});

function switchLayer(id) {
    const pageNum = sectionPageMap[id];
    if (pageNum) {
        updateProgress(pageNum);
    }
    bgLayers.forEach(layer => {
        if (layer.getAttribute('data-layer') === id) {
            if (!layer.classList.contains('active')) {
                layer.classList.add('active');
                const title = layer.querySelector('.split-vertical-title');
                if (title) {
                    gsap.fromTo(title, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
                }
            }
        } else {
            layer.classList.remove('active');
        }
    });

    subLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
            
            // Auto scroll active link into view inside swipable sub-links container on mobile/tablet
            if (window.innerWidth <= 768) {
                const subContainer = document.querySelector('.sub-links');
                if (subContainer) {
                    const containerWidth = subContainer.clientWidth;
                    const linkLeft = link.offsetLeft;
                    const linkWidth = link.clientWidth;
                    subContainer.scrollTo({
                        left: linkLeft - (containerWidth / 2) + (linkWidth / 2),
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
}

// Portfolio Filter Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.port-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.classList.remove('hidden');
                gsap.fromTo(item, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' });
            } else {
                item.classList.add('hidden');
            }
        });
        
        ScrollTrigger.refresh();
    });
});

// Ensure the first section is active on load
if (contentSections.length > 0) {
    switchLayer(contentSections[0].id);
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
            
            // Slide panel in
            gsap.to(menuPanel, { 
                left: isDesktop ? 80 : 0, 
                duration: 0.6, 
                ease: 'power4.out' 
            });
            gsap.to(menuOverlay, { opacity: 1, visibility: 'visible', duration: 0.4 });
            
            // Stagger Nav Links entrance
            gsap.fromTo('.menu-panel-link', 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
            );
        } else {
            closeMenu();
        }
    });

    menuOverlay.addEventListener('click', closeMenu);
    
    // Close panel on clicking internal nav links
    document.querySelectorAll('.menu-panel-link').forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                closeMenu();
            }
        });
    });
}

// Back to Top Logic
const toTopBtn = document.querySelector('.to-top-btn');
if (toTopBtn) {
    toTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0);
    });
}

const getScrollOffset = () => {
    return window.innerWidth > 1024 ? -75 : -120;
};

// Smooth Scroll for Nav Links (Fix for '#' error)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Only prevent default if it's a valid internal anchor
        if (targetId.startsWith('#')) {
            e.preventDefault();
            
            if (targetId === '#') {
                // Scroll to top if target is only '#'
                lenis.scrollTo(0);
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if (targetId === '#contact') {
                        // Scroll to absolute bottom to fully reveal sticky footer
                        lenis.scrollTo('bottom');
                    } else {
                        lenis.scrollTo(targetElement, { offset: getScrollOffset() });
                    }
                }
            }
        }
    });
});

// Up/Down Navigation Arrows Logic – works for BOTH desktop and mobile controls
const prevBtns = document.querySelectorAll('.nav-controls-minimal .prev');
const nextBtns = document.querySelectorAll('.nav-controls-minimal .next');

if (prevBtns.length && nextBtns.length) {
    const sections = Array.from(contentSections);
    
    nextBtns.forEach(btn => btn.addEventListener('click', () => {
        // If we are at the top (Hero Section), scroll to About section first (02 Tentang Saya)
        if (window.scrollY < window.innerHeight * 0.4) {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                lenis.scrollTo(aboutSection, { offset: getScrollOffset() });
                return;
            }
        }
        
        const currentActive = document.querySelector('.sub-links a.active');
        if (currentActive) {
            const currentId = currentActive.getAttribute('href').substring(1);
            const currentIndex = sections.findIndex(s => s.id === currentId);
            if (currentIndex < sections.length - 1) {
                lenis.scrollTo(sections[currentIndex + 1], { offset: getScrollOffset() });
            }
        }
    }));

    prevBtns.forEach(btn => btn.addEventListener('click', () => {
        const currentActive = document.querySelector('.sub-links a.active');
        if (currentActive) {
            const currentId = currentActive.getAttribute('href').substring(1);
            const currentIndex = sections.findIndex(s => s.id === currentId);
            if (currentIndex > 0) {
                lenis.scrollTo(sections[currentIndex - 1], { offset: getScrollOffset() });
            } else {
                lenis.scrollTo(0);
            }
        }
    }));
}

// Lucide Icons Initialization
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Premium Testimonials Slider Control Logic
const testiTrack = document.querySelector('.testimonials-track');
const testiSlides = document.querySelectorAll('.testimonial-slide');
const testiDots = document.querySelectorAll('.testi-dot');
const testiPrevBtn = document.querySelector('.testimonials-controls .prev-btn');
const testiNextBtn = document.querySelector('.testimonials-controls .next-btn');

if (testiTrack && testiSlides.length && testiDots.length) {
    let currentSlide = 0;
    const totalSlides = testiSlides.length;

    const updateSlider = () => {
        const isMobile = window.innerWidth <= 768;
        let slideWidthPercentage = 100; // on mobile, 1 slide is 100% width
        let maxSlideIndex = totalSlides - 1;
        
        if (!isMobile) {
            slideWidthPercentage = 50; // on desktop/tablet, each slide is 50% width
            maxSlideIndex = totalSlides - 2;
        }

        // Clamp slide index
        if (currentSlide > maxSlideIndex) currentSlide = maxSlideIndex;
        if (currentSlide < 0) currentSlide = 0;

        // Calculate horizontal offset and apply translate transition
        const offset = -currentSlide * slideWidthPercentage;
        testiTrack.style.transform = `translateX(${offset}%)`;

        // Update active dots
        testiDots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    if (testiPrevBtn) {
        testiPrevBtn.addEventListener('click', () => {
            currentSlide--;
            if (currentSlide < 0) {
                const isMobile = window.innerWidth <= 768;
                currentSlide = isMobile ? totalSlides - 1 : totalSlides - 2;
            }
            updateSlider();
        });
    }

    if (testiNextBtn) {
        testiNextBtn.addEventListener('click', () => {
            currentSlide++;
            const isMobile = window.innerWidth <= 768;
            const maxSlideIndex = isMobile ? totalSlides - 1 : totalSlides - 2;
            if (currentSlide > maxSlideIndex) {
                currentSlide = 0;
            }
            updateSlider();
        });
    }

    testiDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSlide = parseInt(e.target.getAttribute('data-index'));
            updateSlider();
        });
    });

    // Auto-update on resize
    window.addEventListener('resize', updateSlider);
    
    // Initial run
    updateSlider();
}

// Premium Portfolio Lightbox Logic
const lightbox = document.getElementById('portfolio-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCaseStudy = document.getElementById('lightbox-casestudy');
const lightboxClose = document.querySelector('.lightbox-close');
const portItems = document.querySelectorAll('.port-item');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

if (lightbox && lightboxImg && lightboxClose) {
    let currentImages = [];
    let currentImgIndex = 0;
    let baseCaption = "";
    let hasCaseStudy = false;
    let caseStudyHTML = "";
    let isTransitioning = false;

    // Preload lightbox images for instant navigation response
    const preloadImages = () => {
        currentImages.forEach(src => {
            if (src && src !== 'casestudy') {
                const img = new Image();
                img.src = src;
            }
        });
    };

    const updateLightbox = (index, direction = 'next') => {
        if (currentImages.length === 0) return;
        
        const nextIndex = (index + currentImages.length) % currentImages.length;
        const isCaseStudySlide = hasCaseStudy && (nextIndex === currentImages.length - 1);
        
        // Identify active outgoing elements
        let outgoingEl = null;
        let outgoingCaption = null;
        
        if (lightboxCaseStudy.style.display === 'block') {
            outgoingEl = lightboxCaseStudy;
        } else if (lightboxImg.style.display === 'block') {
            outgoingEl = lightboxImg;
            outgoingCaption = lightboxCaption;
        }
        
        currentImgIndex = nextIndex;
        
        // Update Counter
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImgIndex + 1} / ${currentImages.length}`;
            lightboxCounter.style.display = currentImages.length > 1 ? 'block' : 'none';
        }
        
        // Update Nav Buttons
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
            lightboxNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
        }
        
        // Horizontal offset values for slide transition
        let outX = 0;
        let inX = 0;
        
        if (direction === 'next') {
            outX = -60; // slides left
            inX = 60;   // enters from right
        } else if (direction === 'prev') {
            outX = 60;  // slides right
            inX = -60;  // enters from left
        }
        
        const durationOut = 0.2;
        const durationIn = 0.35;
        
        const animateIn = () => {
            if (isCaseStudySlide) {
                // Display Case Study
                lightboxCaseStudy.innerHTML = caseStudyHTML;
                lightboxCaseStudy.style.display = 'block';
                
                if (window.gsap) {
                    gsap.killTweensOf(lightboxCaseStudy);
                    gsap.fromTo(lightboxCaseStudy, 
                        { opacity: 0, x: inX, scale: 0.98 },
                        { 
                            opacity: 1, 
                            x: 0, 
                            scale: 1, 
                            duration: durationIn, 
                            ease: "power2.out",
                            onComplete: () => { isTransitioning = false; }
                        }
                    );
                } else {
                    lightboxCaseStudy.style.opacity = '1';
                    isTransitioning = false;
                }
            } else {
                // Display standard Image
                lightboxImg.style.display = 'block';
                lightboxCaption.style.display = 'block';
                lightboxCaption.textContent = baseCaption;
                
                lightboxImg.src = currentImages[currentImgIndex];
                
                const showImage = () => {
                    if (window.gsap) {
                        gsap.killTweensOf([lightboxImg, lightboxCaption]);
                        
                        gsap.fromTo(lightboxImg,
                            { opacity: 0, x: inX, scale: 0.96 },
                            { 
                                opacity: 1, 
                                x: 0, 
                                scale: 1, 
                                duration: durationIn, 
                                ease: "power2.out",
                                onComplete: () => { isTransitioning = false; }
                            }
                        );
                        gsap.fromTo(lightboxCaption,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: durationIn, ease: "power2.out", delay: 0.05 }
                        );
                    } else {
                        lightboxImg.style.opacity = '1';
                        lightboxCaption.style.opacity = '1';
                        isTransitioning = false;
                    }
                };
                
                // Trigger animation when the new image resource is fully loaded
                if (lightboxImg.complete) {
                    showImage();
                } else {
                    lightboxImg.onload = showImage;
                }
            }
        };
        
        // Handle transitions when navigating slides (direction is next or prev)
        if (outgoingEl && direction !== 'open') {
            if (window.gsap) {
                gsap.killTweensOf(outgoingEl);
                if (outgoingCaption) gsap.killTweensOf(outgoingCaption);
                
                gsap.to(outgoingEl, {
                    opacity: 0,
                    x: outX,
                    duration: durationOut,
                    ease: "power2.in",
                    onComplete: () => {
                        gsap.set(outgoingEl, { display: 'none', x: 0 });
                        if (outgoingCaption) gsap.set(outgoingCaption, { display: 'none', y: 0 });
                        animateIn();
                    }
                });
                
                if (outgoingCaption) {
                    gsap.to(outgoingCaption, {
                        opacity: 0,
                        y: -10,
                        duration: durationOut,
                        ease: "power2.in"
                    });
                }
            } else {
                outgoingEl.style.display = 'none';
                if (outgoingCaption) outgoingCaption.style.display = 'none';
                animateIn();
            }
        } else {
            // First slide open / backdrop initialization
            if (outgoingEl) {
                outgoingEl.style.display = 'none';
                if (outgoingCaption) outgoingCaption.style.display = 'none';
            }
            
            if (window.gsap) {
                if (isCaseStudySlide) {
                    lightboxCaseStudy.innerHTML = caseStudyHTML;
                    lightboxCaseStudy.style.display = 'block';
                    gsap.fromTo(lightboxCaseStudy,
                        { opacity: 0, scale: 0.95, y: 20 },
                        { 
                            opacity: 1, 
                            scale: 1, 
                            y: 0, 
                            duration: 0.45, 
                            ease: "power2.out",
                            onComplete: () => { isTransitioning = false; }
                        }
                    );
                } else {
                    lightboxImg.style.display = 'block';
                    lightboxCaption.style.display = 'block';
                    lightboxCaption.textContent = baseCaption;
                    
                    lightboxImg.src = currentImages[currentImgIndex];
                    
                    const handleInitialLoad = () => {
                        gsap.killTweensOf([lightboxImg, lightboxCaption]);
                        gsap.fromTo(lightboxImg,
                            { opacity: 0, scale: 0.94 },
                            { 
                                opacity: 1, 
                                scale: 1, 
                                duration: 0.45, 
                                ease: "power2.out",
                                onComplete: () => { isTransitioning = false; }
                            }
                        );
                        gsap.fromTo(lightboxCaption,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.1 }
                        );
                    };
                    
                    if (lightboxImg.complete) {
                        handleInitialLoad();
                    } else {
                        lightboxImg.onload = handleInitialLoad;
                    }
                }
            } else {
                animateIn();
            }
        }
    };

    portItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            if (isTransitioning) return;
            
            const img = item.querySelector('img');
            const titleElement = item.querySelector('h3');
            const categoryElement = item.querySelector('span[data-translate]');
            
            if (img) {
                const imagesAttr = item.getAttribute('data-images');
                if (imagesAttr) {
                    currentImages = imagesAttr.split(',').map(s => s.trim());
                } else {
                    currentImages = [img.src];
                }
                
                let captionText = "";
                if (titleElement) {
                    captionText = titleElement.textContent;
                }
                
                if (categoryElement) {
                    baseCaption = `${categoryElement.textContent} — ${captionText}`;
                } else {
                    baseCaption = captionText || img.alt || "Portfolio Work";
                }

                // Check for Case Study HTML
                const caseStudyElement = item.querySelector('.port-casestudy');
                if (caseStudyElement && caseStudyElement.innerHTML.trim() !== '') {
                    hasCaseStudy = true;
                    caseStudyHTML = `<h3 class="casestudy-title">${captionText}</h3><div class="casestudy-content">${caseStudyElement.innerHTML}</div>`;
                    currentImages.push("casestudy");
                } else {
                    hasCaseStudy = false;
                    caseStudyHTML = "";
                }
                
                currentImgIndex = 0;
                isTransitioning = true;
                
                // Preload all portfolio images for smooth navigations
                preloadImages();
                
                // Clear state of the content containers to prevent any visual residual leaks
                lightboxImg.src = '';
                lightboxImg.style.display = 'none';
                lightboxCaption.style.display = 'none';
                lightboxCaseStudy.style.display = 'none';
                
                if (window.gsap) {
                    gsap.set([lightboxImg, lightboxCaption, lightboxCaseStudy], { clearProps: "all" });
                    gsap.set(lightboxImg, { opacity: 0 });
                    gsap.set(lightboxCaption, { opacity: 0 });
                    gsap.set(lightboxCaseStudy, { opacity: 0 });
                }
                
                // Initialize active slide
                updateLightbox(0, 'open');
                
                // Open backdrop smoothly
                lightbox.style.display = 'flex';
                lightbox.offsetHeight; // force reflow
                lightbox.classList.add('show');
                
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
        
        if (window.gsap) {
            // Animate active element out along with the backdrop
            if (lightboxCaseStudy.style.display === 'block') {
                gsap.to(lightboxCaseStudy, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.35,
                    ease: "power2.in"
                });
            } else {
                gsap.to(lightboxImg, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.35,
                    ease: "power2.in"
                });
                gsap.to(lightboxCaption, {
                    opacity: 0,
                    y: 15,
                    duration: 0.35,
                    ease: "power2.in"
                });
            }
        }
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Reset state parameters
            currentImages = [];
            currentImgIndex = 0;
            isTransitioning = false;
            
            // Clear content references
            lightboxImg.src = '';
            lightboxCaseStudy.innerHTML = '';
        }, 400);
    };

    lightboxClose.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isTransitioning && currentImages.length > 1) {
                isTransitioning = true;
                updateLightbox(currentImgIndex - 1, 'prev');
            }
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isTransitioning && currentImages.length > 1) {
                isTransitioning = true;
                updateLightbox(currentImgIndex + 1, 'next');
            }
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose || e.target.classList.contains('lightbox-img-wrapper')) {
            closeLightbox();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show') || isTransitioning) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            if (currentImages.length > 1) {
                isTransitioning = true;
                updateLightbox(currentImgIndex + 1, 'next');
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            if (currentImages.length > 1) {
                isTransitioning = true;
                updateLightbox(currentImgIndex - 1, 'prev');
            }
        }
    });
}

