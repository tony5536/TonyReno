// ============================================
// GSAP ANIMATIONS & INTERACTIONS
// ============================================

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initNavigation();
    initStatsCounter();
    initContactForm();
    initSmoothScroll();
    initProjectCards();
});

// ============================================
// HERO ANIMATIONS
// ============================================

function initAnimations() {
    // Hero section animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');

    if (heroTitle) {
        const heroLines = heroTitle.querySelectorAll('.hero-line');
        
        // Create timeline for hero animations
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        heroTl
            .from(heroLines, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2
            })
            .from(heroSubtitle, {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.6')
            .from(heroCta, {
                y: 20,
                opacity: 0,
                duration: 0.6
            }, '-=0.4');
    }

    // Page hero animations
    if (pageTitle) {
        gsap.from(pageTitle, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        if (pageSubtitle) {
            gsap.from(pageSubtitle, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out'
            });
        }
    }

    // Section title animations
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

// ============================================
// PROJECT CARDS ANIMATIONS
// ============================================

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Initial state
        gsap.set(card, { opacity: 0, y: 60 });

        // Animate on scroll
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });

        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerHTML: isDecimal ? 0.1 : 1 },
                    onUpdate: function() {
                        const current = parseFloat(this.targets()[0].innerHTML);
                        stat.innerHTML = isDecimal ? current.toFixed(1) : Math.floor(current);
                    }
                });
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinkElements = navLinks.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    navLinkItems.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Nav scroll effect
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
            const scrollY = self.scroll();
            
            if (scrollY > 100) {
                gsap.to(nav, {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(20px)',
                    duration: 0.3
                });
            } else {
                gsap.to(nav, {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    duration: 0.3
                });
            }
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const nav = document.querySelector('.nav');
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                // Smooth scroll using GSAP timeline
                const scrollObj = { y: window.pageYOffset };
                gsap.to(scrollObj, {
                    y: targetPosition,
                    duration: 1,
                    ease: 'power3.inOut',
                    onUpdate: () => {
                        window.scrollTo(0, scrollObj.y);
                    }
                });
            }
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Animate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            gsap.to(submitBtn, {
                opacity: 0.5,
                duration: 0.2
            });
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset button
                gsap.to(submitBtn, {
                    opacity: 1,
                    duration: 0.2
                });
                
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = '#10b981';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
            }, 1500);
        });

        // Form input animations
        const formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            input.addEventListener('blur', () => {
                gsap.to(input, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// ============================================
// EXPERTISE GRID ANIMATIONS
// ============================================

const expertiseItems = document.querySelectorAll('.expertise-item');
expertiseItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// ============================================
// TECH STACK ANIMATIONS
// ============================================

const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none'
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        delay: index * 0.03,
        ease: 'back.out(1.7)'
    });
});

// ============================================
// FOOTER ANIMATION
// ============================================

const footer = document.querySelector('.footer');
if (footer) {
    gsap.from(footer, {
        scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transform: translateX(100px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.to(notification, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
    });
    
    // Animate out and remove
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            x: 100,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// ============================================
// PAGE TRANSITIONS
// ============================================

// Fade out on page navigation
document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Only apply to internal links
        if (this.hostname === window.location.hostname || !this.hostname) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                // Optional: Add fade out animation
                // gsap.to('body', {
                //     opacity: 0,
                //     duration: 0.3,
                //     ease: 'power2.in'
                // });
            }
        }
    });
});

// ============================================
// SCROLL TO TOP BUTTON (Optional)
// ============================================

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    z-index: 999;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
`;

document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
ScrollTrigger.create({
    start: 'top -400',
    onEnter: () => {
        gsap.to(scrollTopBtn, {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.3
        });
    },
    onLeaveBack: () => {
        gsap.to(scrollTopBtn, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.3
        });
    }
});

// Scroll to top on click
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hover effect
scrollTopBtn.addEventListener('mouseenter', () => {
    gsap.to(scrollTopBtn, {
        scale: 1.1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        duration: 0.2
    });
});

scrollTopBtn.addEventListener('mouseleave', () => {
    gsap.to(scrollTopBtn, {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        duration: 0.2
    });
});

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

// Adjust animations for mobile
function handleResize() {
    const isMobile = window.innerWidth < 640;
    
    // Reduce animation delays on mobile
    if (isMobile) {
        gsap.defaults({ duration: 0.6 });
    } else {
        gsap.defaults({ duration: 1 });
    }
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
}

window.addEventListener('resize', handleResize);
handleResize();

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Use will-change for animated elements
const animatedElements = document.querySelectorAll('.project-card, .expertise-item, .tech-item');
animatedElements.forEach(el => {
    el.style.willChange = 'transform, opacity';
});

// Clean up will-change after animations
setTimeout(() => {
    animatedElements.forEach(el => {
        el.style.willChange = 'auto';
    });
}, 3000);

// ============================================
// END OF SCRIPT
// ============================================

