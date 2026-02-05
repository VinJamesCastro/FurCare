/* =====================================================
   FURCARE MARKETPLACE - MAIN JAVASCRIPT
   ===================================================== */

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.body;

if (mobileMenuToggle && mainNav) {
    
    // Open/close menu on button click
    mobileMenuToggle.addEventListener('click', () => {
        // 1. Toggle menu visibility
        mainNav.classList.toggle('is-open');

         // 2. Toggle button state
        mobileMenuToggle.classList.toggle('active');

         // 3. Toggle overlay
        body.classList.toggle('menu-open');
        
        // 4. Change icon
        const icon = mobileMenuToggle.querySelector('i');
        if (mainNav.classList.contains('is-open')) {
            icon.className = 'fas fa-times'; // X icon
        } else {
            icon.className = 'fas fa-bars'; // Hamburger icon
        }
    });
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('is-open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });
    
    // Close menu when clicking overlay (outside menu)
    document.addEventListener('click', (event) => {
        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('is-open')) {
            mainNav.classList.remove('is-open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
            mainNav.classList.remove('is-open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
}

// ===== EMAIL FORM VALIDATION =====
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');

if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            emailInput.focus();
            return;
        }
        
        // Success message (in production, this would send to your backend)
        alert(`Thank you! We'll send updates to ${email}`);
        emailInput.value = '';
        
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768 && mainNav) {
                mainNav.style.display = 'none';
            }
        }
    });
});

// ===== SCROLL ANIMATIONS FOR CARDS =====
// This adds a fade-in effect when cards scroll into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in effect to all cards on page load
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .service-card, .step-box, .trust-card'
    );
    
    animatedElements.forEach(element => {
        // Set initial state (invisible and shifted down)
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Start observing
        fadeInObserver.observe(element);
    });
});

// ===== HEADER SCROLL EFFECT (OPTIONAL) =====
// Adds a shadow to header when scrolling down
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    }
    
    lastScroll = currentScroll;
});

// ===== FORM INPUT ENHANCEMENTS =====
// Add focus styling to email input
if (emailInput) {
    emailInput.addEventListener('focus', () => {
        emailInput.style.borderColor = '#a855f7';
        emailInput.style.outline = 'none';
    });
    
    emailInput.addEventListener('blur', () => {
        emailInput.style.borderColor = 'rgba(255,255,255,0.2)';
    });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Scroll to top function (can be triggered by a button)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== CONSOLE MESSAGE =====
// Optional: Let developers know you're hiring or open to collaboration
console.log(
    '%cFurCare 🐾',
    'font-size: 20px; font-weight: bold; color: #a855f7;'
);
console.log(
    '%cInterested in our tech stack? We\'re building with Node.js, PostgreSQL, and React.',
    'font-size: 12px; color: #6b7280;'
);
console.log(
    '%cContact: support@furcare.com',
    'font-size: 12px; color: #6b7280;'
);