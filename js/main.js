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
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
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
                document.body.style.overflow = 'auto';
            }, 400);
        }
    }, 1500); // Shorter load time for professional snappy feel
});

// Disable scroll during preloader
document.body.style.overflow = 'hidden';

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

// Fixed Panel & Layer Switching Logic
const contentSections = document.querySelectorAll('.content-section');
const bgLayers = document.querySelectorAll('.bg-layer');
// Select sub-links from BOTH nav variants (mobile inside hero + desktop sticky)
const subLinks = document.querySelectorAll('.sub-links a');

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
