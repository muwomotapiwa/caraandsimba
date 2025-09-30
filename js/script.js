// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initInvitation();
    initNavigation();
    initCountdown();
    initRSVP();
    initFAQ();
    initCalendar();
    initScrollDown();
    initWeather();
});

// Invitation Overlay
function initInvitation() {
    const invitationOverlay = document.getElementById('invitationOverlay');
    const openInvitationBtn = document.getElementById('openInvitationBtn');
    
    // Check if user has already opened the invitation
    const hasOpenedInvitation = sessionStorage.getItem('invitationOpened');
    
    if (hasOpenedInvitation) {
        invitationOverlay.style.display = 'none';
    }
    
    openInvitationBtn.addEventListener('click', function() {
        invitationOverlay.style.opacity = '0';
        setTimeout(() => {
            invitationOverlay.style.display = 'none';
            sessionStorage.setItem('invitationOpened', 'true');
        }, 800);
    });
}

// Navigation
function initNavigation() {
    const navBar = document.getElementById('navBar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Show navigation on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navBar.classList.add('show');
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navBar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navBar.style.transform = 'translateY(0)';
            }
        } else {
            navBar.classList.remove('show');
            navBar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    hamburgerBtn.addEventListener('click', function() {
        mobileMenu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
    });
    
    // Close mobile menu when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Countdown Timer
function initCountdown() {
    const weddingDate = new Date('December 20, 2025 16:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// RSVP Form
function initRSVP() {
    const rsvpForm = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('success-message');
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulate form submission
        setTimeout(() => {
            // Hide form and show success message
            rsvpForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Show toast notification
            showToast('Thank you for your RSVP! We look forward to celebrating with you.');
            
            // Reset form (for demo purposes)
            setTimeout(() => {
                rsvpForm.reset();
                rsvpForm.style.display = 'block';
                successMessage.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 5000);
        }, 2000);
    });
}

// FAQ Accordion
function initFAQ() {
    // FAQ functionality is handled by the toggleFAQ function
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
        element.setAttribute('aria-expanded', 'true');
    }
}

// Add to Calendar
function initCalendar() {
    const addToCalendarBtn = document.getElementById('addToCalendar');
    
    addToCalendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create calendar event data
        const eventData = {
            title: 'Cara & Simba Wedding',
            description: 'Join us for the wedding celebration of Cara and Simba',
            location: 'Kingfisher in the Park, 61 Prices Avenue, Harare, Zimbabwe',
            startTime: new Date('2025-12-20T16:00:00'),
            endTime: new Date('2025-12-20T23:00:00')
        };
        
        // Create .ics file
        const icsContent = createICSFile(eventData);
        downloadICSFile(icsContent, 'Cara-Simba-Wedding.ics');
        
        showToast('Calendar event downloaded!');
    });
}

function createICSFile(eventData) {
    const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
LOCATION:${eventData.location}
DTSTART:${formatDate(eventData.startTime)}
DTEND:${formatDate(eventData.endTime)}
UID:${Math.random().toString(36).substring(2)}@caraandsimba.com
END:VEVENT
END:VCALENDAR`;
}

function downloadICSFile(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Scroll Down Functionality
function initScrollDown() {
    // Function is called from HTML onclick
}

function scrollToNext() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.pageYOffset;
    
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop - 100;
        
        if (sectionTop > currentScroll) {
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
            break;
        }
    }
}

// Weather Information
function initWeather() {
    // Since we can't access real weather API without keys, we'll show static info
    // In a real implementation, you would use a weather API here
    const weatherInfo = document.getElementById('weather-info');
    
    // You could implement a weather API call here:
    /*
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=Harare&dt=2025-12-20`)
        .then(response => response.json())
        .then(data => {
            const weather = data.forecast.forecastday[0].day;
            weatherInfo.innerHTML = `
                <p>Expected: ${weather.condition.text}</p>
                <p>High: ${weather.maxtemp_c}°C / ${weather.maxtemp_f}°F</p>
                <p>Low: ${weather.mintemp_c}°C / ${weather.mintemp_f}°F</p>
            `;
        })
        .catch(error => {
            console.log('Weather API error:', error);
        });
    */
}

// Toast Notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Keyboard Accessibility
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    }
    
    // Navigate FAQ with keyboard
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('faq-header')) {
            e.preventDefault();
            toggleFAQ(focusedElement);
        }
    }
});

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading state for better UX
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});

// Handle page visibility changes for countdown accuracy
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, update countdown immediately
        if (typeof updateCountdown === 'function') {
            updateCountdown();
        }
    }
});