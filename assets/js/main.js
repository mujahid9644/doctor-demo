// ====================================
// Doctor Demo - Main JavaScript
// Professional Dental Clinic
// ====================================

'use strict';

/**
 * Main Application Object
 */
const DoctorDemo = {
    // ====================================
    // WhatsApp Configuration
    // ====================================
    whatsapp: {
        phoneNumber: '94772256700', // Change this to your clinic's WhatsApp number
        message: 'Hello, I want to book a dental appointment.',
        apiUrl: 'https://wa.me/'
    },

    /**
     * Initialize the application
     */
    init() {
        this.setupMobileMenu();
        this.setupFormHandling();
        this.setupScrollAnimations();
        this.setupSmoothScroll();
        this.setupDropdownMenu();
        this.setupBeforeAfter();
        this.setupWhatsApp();
    },

    /**
     * Mobile Menu Toggle
     */
    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const mainNav = document.querySelector('.main-nav');

        if (!menuToggle || !mainNav || !navMenu) return;

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideNav = mainNav.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInsideNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    },

    /**
     * Dropdown Menu Handling
     */
    setupDropdownMenu() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-link');
            
            if (!toggle) return;

            // For mobile devices (max-width: 768px)
            if (window.innerWidth <= 768) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Re-initialize on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Remove active class for desktop view (hover instead)
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    },

    /**
     * Form Handling and Validation
     */
    setupFormHandling() {
        const appointmentForm = document.querySelector('.appointment-form');
        if (!appointmentForm) return;

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(appointmentForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                date: formData.get('date')
            };

            // Basic validation
            if (!this.validateForm(data)) {
                alert('Please fill all required fields correctly.');
                return;
            }

            // Success message
            alert(`Thank you, ${data.name}! Your appointment request has been received. We'll contact you soon.`);
            appointmentForm.reset();
        });
    },

    /**
     * Form Validation
     */
    validateForm(data) {
        // Check if all fields are filled
        if (!data.name || !data.phone || !data.service || !data.date) {
            return false;
        }

        // Basic phone validation (at least 10 digits)
        const phoneRegex = /^\d{10,}$/;
        const phoneDigitsOnly = data.phone.replace(/\D/g, '');
        if (!phoneRegex.test(phoneDigitsOnly)) {
            alert('Please enter a valid phone number.');
            return false;
        }

        // Check if date is in the future
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert('Please select a future date.');
            return false;
        }

        return true;
    },

    /**
     * Scroll-triggered Animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all service cards, feature items, about content, and slider
        document.querySelectorAll('.service-card, .feature, .about-content, .ba-slider-container').forEach(element => {
            observer.observe(element);
        });
    },

    /**
     * Smooth Scroll Behavior
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    /**
     * Before & After Image Slider - Modern Remini Style
     * Features: pointer events, touch support, smooth drag, double-click toggle
     */
    setupBeforeAfter() {
        const container = document.getElementById('reminiBA');
        const afterWrap = document.getElementById('afterWrap');
        const divider = document.getElementById('baDivider');
        const handle = document.getElementById('baHandle');

        if (!container || !afterWrap || !divider || !handle) return;

        let dragging = false;
        let currentPercent = 50;
        let raf = null;

        /**
         * Update slider position to percentage
         */
        const setPosition = (percent) => {
            percent = Math.max(0, Math.min(100, percent));
            currentPercent = percent;
            afterWrap.style.width = percent + '%';
            divider.style.left = percent + '%';
            handle.style.left = percent + '%';
        };

        // Initialize at 50%
        setPosition(50);

        /**
         * Update from client X position
         */
        const updateFromClientX = (clientX) => {
            const rect = container.getBoundingClientRect();
            const x = clientX - rect.left;
            const p = (x / rect.width) * 100;
            setPosition(p);
        };

        /**
         * Pointer Down - Start dragging
         */
        const onPointerDown = (e) => {
            e.preventDefault();
            dragging = true;
            container.classList.add('is-dragging');
            handle.setAttribute('aria-pressed', 'true');
            if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
        };

        /**
         * Pointer Move - Update during drag
         */
        const onPointerMove = (e) => {
            if (!dragging) return;
            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => updateFromClientX(clientX));
        };

        /**
         * Pointer Up - Stop dragging
         */
        const onPointerUp = (e) => {
            if (!dragging) return;
            dragging = false;
            container.classList.remove('is-dragging');
            handle.setAttribute('aria-pressed', 'false');
            if (raf) cancelAnimationFrame(raf);
            raf = null;
        };

        /**
         * Toggle overlay on double-tap / double-click
         */
        let lastTap = 0;
        const toggleOverlay = () => {
            const isHidden = afterWrap.style.width === '0%';
            const target = isHidden ? 50 : 0;
            afterWrap.style.transition = 'width 400ms cubic-bezier(0.22, 1, 0.36, 1)';
            divider.style.transition = 'left 400ms cubic-bezier(0.22, 1, 0.36, 1)';
            handle.style.transition = 'left 400ms cubic-bezier(0.22, 1, 0.36, 1)';
            requestAnimationFrame(() => setPosition(target));
            setTimeout(() => {
                afterWrap.style.transition = '';
                divider.style.transition = '';
                handle.style.transition = '';
            }, 450);
        };

        // Pointer Events
        if (window.PointerEvent) {
            handle.addEventListener('pointerdown', onPointerDown, { passive: false });
            divider.addEventListener('pointerdown', onPointerDown, { passive: false });
            window.addEventListener('pointermove', onPointerMove, { passive: false });
            window.addEventListener('pointerup', onPointerUp, { passive: true });
            window.addEventListener('pointercancel', onPointerUp, { passive: true });
        } else {
            // Fallback: touch + mouse
            handle.addEventListener('touchstart', (e) => onPointerDown(e), { passive: false });
            divider.addEventListener('touchstart', (e) => onPointerDown(e), { passive: false });
            window.addEventListener('touchmove', (e) => onPointerMove(e), { passive: false });
            window.addEventListener('touchend', (e) => onPointerUp(e), { passive: true });
            handle.addEventListener('mousedown', (e) => onPointerDown(e), { passive: false });
            divider.addEventListener('mousedown', (e) => onPointerDown(e), { passive: false });
            window.addEventListener('mousemove', (e) => onPointerMove(e), { passive: false });
            window.addEventListener('mouseup', (e) => onPointerUp(e), { passive: true });
        }

        // Double-click to toggle
        handle.addEventListener('dblclick', (e) => { toggleOverlay(); });
        divider.addEventListener('dblclick', (e) => { toggleOverlay(); });

        // Click container to move to that position
        container.addEventListener('click', (e) => {
            if (container.classList.contains('is-dragging')) return;
            const now = Date.now();
            if (now - lastTap < 300) { toggleOverlay(); lastTap = 0; return; }
            lastTap = now;
            updateFromClientX(e.clientX);
        });

        // Keyboard support
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { setPosition(currentPercent - 6); e.preventDefault(); }
            if (e.key === 'ArrowRight') { setPosition(currentPercent + 6); e.preventDefault(); }
            if (e.key === 'Home') { setPosition(0); e.preventDefault(); }
            if (e.key === 'End') { setPosition(100); e.preventDefault(); }
        });

        // Prevent image drag
        Array.from(container.querySelectorAll('img')).forEach(img => {
            img.addEventListener('dragstart', (ev) => ev.preventDefault());
        });

        // Handle resize
        window.addEventListener('resize', () => setPosition(currentPercent));
    },

    /**
     * Utility: Format Phone Number
     */
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    /**
     * WhatsApp Integration
     * Handles all WhatsApp button clicks and floating button
     */
    setupWhatsApp() {
        // Get all WhatsApp buttons
        const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
        const whatsappFloat = document.getElementById('whatsappFloat');

        // Build WhatsApp URL
        const getWhatsAppUrl = () => {
            const encoded = encodeURIComponent(this.whatsapp.message);
            return `${this.whatsapp.apiUrl}${this.whatsapp.phoneNumber}?text=${encoded}`;
        };

        // Add click handlers to all buttons
        whatsappButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(getWhatsAppUrl(), '_blank');
            });
        });

        // Setup floating button
        if (whatsappFloat) {
            whatsappFloat.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(getWhatsAppUrl(), '_blank');
            });
        }
    },

    /**
     * Utility: Log Page View Analytics
     */
    trackPageView() {
        console.log('Page viewed:', document.title);
        // Add analytics tracking code here if needed
    }
};

// Initialize on DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DoctorDemo.init());
} else {
    DoctorDemo.init();
}

// ====================================
// Carousel/Slider Support (Optional)
// For carousels, you can add this if needed
// ====================================

const Carousel = {
    /**
     * Initialize carousel if it exists
     */
    init(selector) {
        const carousel = document.querySelector(selector);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let currentIndex = 0;

        if (!prevBtn || !nextBtn) return;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        showSlide(currentIndex);
    }
};

// ====================================
// Utility Functions
// ====================================

/**
 * Debounce function for event handlers
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get URL Parameters
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Scroll to Top Button
 */
const ScrollToTop = {
    init() {
        const button = document.querySelector('.scroll-to-top');
        if (!button) return;

        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        }, 250));

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// ====================================
// Export for use in other files
// ====================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DoctorDemo, Carousel, debounce, throttle };
}
