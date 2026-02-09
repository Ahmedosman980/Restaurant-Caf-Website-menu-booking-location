// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const categoryBtns = document.querySelectorAll('.category-btn');
const categorySections = document.querySelectorAll('.category-section');
const reservationForm = document.getElementById('reservation-form');
const modal = document.getElementById('success-modal');
const closeModalBtns = document.querySelectorAll('.close, .close-modal');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for reservation to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Initialize page navigation
    initNavigation();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize menu categories
    initMenuCategories();
    
    // Initialize reservation form
    initReservationForm();
    
    // Initialize modal
    initModal();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
});

// Navigation functionality
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                showPage(targetPage);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Show specific page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Mobile menu functionality
function initMobileMenu() {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Menu categories functionality
function initMenuCategories() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding category section
            categorySections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(targetCategory);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Reservation form functionality
function initReservationForm() {
    if (!reservationForm) return;
    
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success modal
                showModal();
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Store reservation data (in real app, this would be sent to server)
                const formData = new FormData(this);
                const reservationData = Object.fromEntries(formData);
                console.log('Reservation data:', reservationData);
            }, 1500);
        }
    });
    
    // Real-time validation
    const inputs = reservationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Form validation
function validateForm() {
    const form = document.getElementById('reservation-form');
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validation for specific fields
    const email = document.getElementById('email');
    if (email && email.value && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    const phone = document.getElementById('phone');
    if (phone && phone.value && !isValidPhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    const guests = document.getElementById('guests');
    if (guests && guests.value === '8') {
        const message = document.createElement('p');
        message.textContent = 'For parties of 8 or more, please call us directly at (555) 123-4567';
        message.style.color = 'var(--primary-color)';
        message.style.marginTop = '10px';
        message.style.fontWeight = '500';
        
        const existingMessage = guests.parentElement.querySelector('.party-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        message.classList.add('party-message');
        guests.parentElement.appendChild(message);
    }
    
    return isValid;
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showError(field, 'Please enter a valid phone number');
        return false;
    }
    
    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError(field, 'Please select a future date');
            return false;
        }
    }
    
    // Clear error if valid
    clearError(field);
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Show field error
function showError(field, message) {
    clearError(field);
    
    field.classList.add('error');
    field.style.borderColor = 'var(--primary-color)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--primary-color)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentElement.appendChild(errorDiv);
}

// Clear field error
function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    const partyMessage = field.parentElement.querySelector('.party-message');
    if (partyMessage) {
        partyMessage.remove();
    }
}

// Modal functionality
function initModal() {
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Show modal
function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a page navigation link
            if (this.hasAttribute('data-page')) {
                return;
            }
            
            // Handle hash-only links
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'var(--shadow)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility functions
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

// Add CSS for error states
const errorStyles = `
    .error-message {
        color: var(--primary-color);
        font-size: 0.875rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 3px rgba(201, 48, 44, 0.1) !important;
    }
    
    .party-message {
        color: var(--primary-color);
        margin-top: 10px;
        font-weight: 500;
        animation: fadeIn 0.3s ease;
    }
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// Add loading animation styles
const loadingStyles = `
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

// Inject loading styles
const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);

// Initialize page animations
function initPageAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature, .hours-item, .menu-item, .form-group');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Initialize animations when page loads
window.addEventListener('load', initPageAnimations);

// Add touch support for mobile devices
function initTouchSupport() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .category-btn');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize touch support
initTouchSupport();

// Console welcome message
console.log('%c🍽️ Welcome to Bella Vista Restaurant & Café! 🍽️', 'font-size: 20px; color: var(--primary-color); font-weight: bold;');
console.log('%cWebsite loaded successfully. Enjoy browsing our menu and making reservations!', 'font-size: 14px; color: var(--text-light);');