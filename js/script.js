// Constants
const MOBILE_BREAKPOINT = 768;
const SCROLL_THRESHOLD = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mobile menu
(function initMobileMenu() {
    const elements = {
        toggle: document.querySelector('.mobile-menu-toggle'),
        nav: document.querySelector('.main-nav'),
        icon: null,
        body: document.body
    };
    
    // bail out if missing
    if (!elements.toggle || !elements.nav) return;
    
    elements.icon = elements.toggle.querySelector('i');
    if (!elements.icon) return;
    
    // track open/closed state
    const menuState = {
        isOpen: false
    };
    
    // open / close / toggle
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
    
    // events
    elements.toggle.addEventListener('click', toggleMenu);
    
    // close when nav link clicked
    elements.nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // close when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuState.isOpen) return;
        
        const isClickInside = elements.nav.contains(e.target) || 
                             elements.toggle.contains(e.target);
        
        if (!isClickInside) closeMenu();
    });
    
    // ESC key closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuState.isOpen) {
            closeMenu();
        }
    });
})();

// cta email form
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
        
        alert(`Thank you! We'll send updates to ${email}`);
        input.value = '';
        
        // TODO: Send to backend API
        // submitToBackend(email);
    }
    
    // highlight border on focus
    input.addEventListener('focus', () => {
        input.style.borderColor = '#a855f7';
        input.style.outline = 'none';
    });
    
    input.addEventListener('blur', () => {
        input.style.borderColor = 'rgba(255,255,255,0.2)';
    });
    
    form.addEventListener('submit', handleSubmit);
})();

// Smooth scroll
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

// Scroll animations
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
    
   // Set initial styles
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
})();

// Header shadow on scroll
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

// dev message
if (console && console.log) {
    console.log(
        '%cFurCare 🐾',
        'font-size: 20px; font-weight: bold; color: #a855f7;'
    );
}

// Paste this inside your existing IIFE in script.js, replacing your previous sitter preview block

// Number of sitter cards to show on the preview
var PREVIEW_COUNT = 8;

// Path to mock sitter data — swap for a Firestore call later
var SITTERS_DATA_URL = 'data/sitters.json';

// Price filter ceilings in ₱/hr — null means no ceiling (show all)
var PRICE_LIMITS = {
  'all': null,
  '200': 200,
  '350': 350,
  '500': 500
};

// Holds the full sitter array after fetch — used by filter functions
var allSitters = [];

// Null guard: only run if the preview grid exists on this page
var sitterPreviewGrid = document.getElementById('sitterPreviewGrid');
var serviceFilter = document.getElementById('serviceFilter');
var priceFilter = document.getElementById('priceFilter');
var distanceFilter = document.getElementById('distanceFilter');

if (sitterPreviewGrid) {
  fetch(SITTERS_DATA_URL)
    .then(function (res) {
      // fetch() only rejects on network failure, not 404s
      // Checking res.ok catches a missing file with a real error
      if (!res.ok) {
        throw new Error('Could not load sitters data. Status: ' + res.status);
      }
      return res.json();
    })
    .then(function (sitters) {
      // Store the full list so filters can always work from the complete dataset
      allSitters = sitters;
      renderSitterCards(getFilteredSitters(), sitterPreviewGrid);
    })
    .catch(function (err) {
      // Fail silently on the page — a missing JSON file shouldn't break the layout
      console.error('Sitter preview error:', err);
    });

  // Attach filter change listeners — each re-runs the filter against the full dataset
  if (serviceFilter) {
    serviceFilter.addEventListener('change', function () {
      renderSitterCards(getFilteredSitters(), sitterPreviewGrid);
    });
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', function () {
      renderSitterCards(getFilteredSitters(), sitterPreviewGrid);
    });
  }

  // Distance filter: renders but does not actually filter
  // Requires Geolocation API + real coordinates on each sitter record
  // Stubbed intentionally — will be wired on sitters.html with real Firestore data
  if (distanceFilter) {
    distanceFilter.addEventListener('change', function () {
      renderSitterCards(getFilteredSitters(), sitterPreviewGrid);
    });
  }
}

// Returns a filtered + sliced subset of allSitters based on current dropdown values
function getFilteredSitters() {
  var selectedService = serviceFilter ? serviceFilter.value : 'all';
  var selectedPrice = priceFilter ? priceFilter.value : 'all';

  var filtered = allSitters.filter(function (sitter) {
    // Service filter: pass if "All Services" selected, or sitter offers the selected service
    var passesService =
      selectedService === 'all' ||
      sitter.services.indexOf(selectedService) !== -1;

    // Price filter: pass if "Any" selected, or sitter's rate is within the ceiling
    var priceLimit = PRICE_LIMITS[selectedPrice];
    var passesPrice =
      priceLimit === null ||
      sitter.pricePerHour <= priceLimit;

    // Distance: always passes — stubbed, no real geo data available yet
    var passesDistance = true;

    return passesService && passesPrice && passesDistance;
  });

  // Cap preview at PREVIEW_COUNT even after filtering
  return filtered.slice(0, PREVIEW_COUNT);
}

// Builds an HTML string for one sitter card
function buildSitterCard(sitter) {
  // Only render badge if a value exists — null means intentionally absent
  var badgeHTML = sitter.badge
    ? '<span class="sitter-card__badge">' + sitter.badge + '</span>'
    : '';

  // Join services array into a readable string: "Dog Walking · Pet Sitting"
  var servicesText = sitter.services.join(' · ');

  return (
    '<article class="sitter-card">' +
      '<div class="sitter-card__photo-wrap">' +
        badgeHTML +
        '<img ' +
          'src="' + sitter.photo + '" ' +
          'alt="' + sitter.name + ' with a pet" ' +
          'class="sitter-card__photo" ' +
          'loading="lazy"' +
        '>' +
      '</div>' +
      '<div class="sitter-card__body">' +
        '<div class="sitter-card__top">' +
          '<span class="sitter-card__name">' + sitter.name + '</span>' +
          '<span class="sitter-card__rating">' +
            '★ ' + sitter.rating +
            ' <span class="sitter-card__reviews">(' + sitter.reviewCount + ')</span>' +
          '</span>' +
        '</div>' +
        '<div class="sitter-card__location">◎ ' + sitter.location + '</div>' +
        '<div class="sitter-card__experience">' +
          sitter.experience + ' year' + (sitter.experience === 1 ? '' : 's') +
          ' experience · ' + servicesText +
        '</div>' +
        '<div class="sitter-card__price">' +
          '₱' + sitter.pricePerHour +
          ' <span class="sitter-card__per-hour">/ hour</span>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

// Renders cards into the container in one DOM write
function renderSitterCards(sitters, container) {
  if (sitters.length === 0) {
    // Show an empty state instead of a blank grid
    container.innerHTML = '<p class="sitter-grid__empty">No sitters match your filters. Try adjusting your search.</p>';
    return;
  }
  // map builds an array of HTML strings, join merges into one string
  // One innerHTML write = one DOM reflow, not one per card
  var html = sitters.map(buildSitterCard).join('');
  container.innerHTML = html;
}