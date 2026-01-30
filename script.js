// Countdown Timer
function updateCountdown() {
    // Set target date (example: 2 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(21, 0, 0, 0);

    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tickets carousel
    const ticketsCarousel = document.querySelector('.tickets-carousel');
    if (ticketsCarousel) {
        const ticketsGrid = ticketsCarousel.querySelector('.tickets-grid');
        const prevBtn = ticketsCarousel.querySelector('.prev');
        const nextBtn = ticketsCarousel.querySelector('.next');
        
        let scrollPosition = 0;
        const scrollAmount = 300;

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollPosition += scrollAmount;
                ticketsGrid.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                scrollPosition -= scrollAmount;
                if (scrollPosition < 0) scrollPosition = 0;
                ticketsGrid.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Players carousel
    const playersCarousel = document.querySelector('.players-carousel');
    if (playersCarousel) {
        const playersGrid = playersCarousel.querySelector('.players-grid');
        const prevBtn = playersCarousel.querySelector('.prev');
        const nextBtn = playersCarousel.querySelector('.next');
        
        let scrollPosition = 0;
        const scrollAmount = 300;

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollPosition += scrollAmount;
                playersGrid.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                scrollPosition -= scrollAmount;
                if (scrollPosition < 0) scrollPosition = 0;
                playersGrid.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Toggle dropdown (simplified - can be enhanced)
                console.log('Dropdown clicked:', link.textContent);
            });
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to news cards
    const newsCards = document.querySelectorAll('.news-card, .news-item-small, .news-item-large');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.classList.toggle('mobile-open');
        }
    });
}

