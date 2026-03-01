/* =====================================================
   FURCARE MARKETPLACE - MAIN JAVASCRIPT
   ===================================================== */

// ===== CONSTANTS =====
const MOBILE_BREAKPOINT = 768;
const SCROLL_THRESHOLD = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== MOBILE MENU MODULE =====
(function initMobileMenu() {
    const elements = {
        toggle: document.querySelector('.mobile-menu-toggle'),
        nav: document.querySelector('.main-nav'),
        icon: null,
        body: document.body
    };
    
    // Early return if elements don't exist
    if (!elements.toggle || !elements.nav) return;
    
    elements.icon = elements.toggle.querySelector('i');
    if (!elements.icon) return;
    
    // State management
    const menuState = {
        isOpen: false
    };
    
    // Menu control functions
    function openMenu() {
        menuState.isOpen = true;
        elements.nav.classList.add('is-open');
        elements.toggle.classList.add('active');
        elements.body.classList.add('menu-open');
        elements.icon.className = 'fas fa-times';
    }
    
    function closeMenu() {
        menuState.isOpen = false;
        elements.nav.classList.remove('is-open');
        elements.toggle.classList.remove('active');
        elements.body.classList.remove('menu-open');
        elements.icon.className = 'fas fa-bars';
    }
    
    function toggleMenu() {
        menuState.isOpen ? closeMenu() : openMenu();
    }
    
    // Event handlers
    elements.toggle.addEventListener('click', toggleMenu);
    
    // Close on link click
    elements.nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menuState.isOpen) return;
        
        const isClickInside = elements.nav.contains(e.target) || 
                             elements.toggle.contains(e.target);
        
        if (!isClickInside) closeMenu();
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuState.isOpen) {
            closeMenu();
        }
    });
})();

// ===== EMAIL FORM MODULE =====
(function initEmailForm() {
    const form = document.getElementById('emailForm');
    const input = document.getElementById('emailInput');
    
    if (!form || !input) return;
    
    function validateEmail(email) {
        return EMAIL_REGEX.test(email);
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        const email = input.value.trim();
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            input.focus();
            return;
        }
        
        // Success
        alert(`Thank you! We'll send updates to ${email}`);
        input.value = '';
        
        // TODO: Send to backend API
        // submitToBackend(email);
    }
    
    // Focus styles
    input.addEventListener('focus', () => {
        input.style.borderColor = '#a855f7';
        input.style.outline = 'none';
    });
    
    input.addEventListener('blur', () => {
        input.style.borderColor = 'rgba(255,255,255,0.2)';
    });
    
    form.addEventListener('submit', handleSubmit);
})();

// ===== SMOOTH SCROLL MODULE =====
(function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            // Skip empty or just '#'
            if (!href || href === '#') return;
            
            e.preventDefault();
            
            try {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                console.warn(`Invalid selector: ${href}`, error);
            }
        });
    });
})();

// ===== SCROLL ANIMATIONS MODULE =====
(function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .service-card, .step-box'
    );
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initialize
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
})();

// ===== HEADER SCROLL EFFECT MODULE =====
(function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let ticking = false;
    
    function updateHeader(scrollPos) {
        const shadowIntensity = scrollPos > SCROLL_THRESHOLD 
            ? '0 4px 12px rgba(0,0,0,0.1)' 
            : '0 2px 8px rgba(0,0,0,0.05)';
        
        header.style.boxShadow = shadowIntensity;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader(window.pageYOffset);
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ===== DEV CONSOLE MESSAGE =====
if (console && console.log) {
    console.log(
        '%cFurCare 🐾',
        'font-size: 20px; font-weight: bold; color: #a855f7;'
    );
}