document.addEventListener('DOMContentLoaded', function() {
    // Get all slides
    const slides = document.querySelectorAll('.slide-container');
    let currentSlideIndex = 0;
    let isScrolling = false;
    const scrollDelay = 700; // ms to prevent rapid scrolling

    // Update slide numbers in the header
    function updateSlideNumbers() {
        slides.forEach((slide, index) => {
            const slideNumberElement = slide.querySelector('.slide-number');
            if (slideNumberElement) {
                slideNumberElement.textContent = `Slide ${index + 1}/${slides.length}`;
            }
        });
    }

    // Set active slide and scroll to it
    function goToSlide(index) {
        if (isScrolling) return;
        
        // Bound index within valid range
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        // Don't do anything if already on this slide
        if (index === currentSlideIndex) return;
        
        isScrolling = true;
        currentSlideIndex = index;
        
        // Scroll to the slide
        slides[index].scrollIntoView({ behavior: 'smooth' });
        
        // Update active state
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
            isScrolling = false;
        }, scrollDelay);
    }

    // Handle navigation
    function nextSlide() {
        goToSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentSlideIndex - 1);
    }

    // Event listeners
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (isScrolling) return;
        
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(slides.length - 1);
                break;
        }
    });

    // Touch support for mobile devices
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: false });

    // Add navigation buttons
    function createNavButtons() {
        const navContainer = document.createElement('div');
        navContainer.className = 'slide-nav-buttons';
        navContainer.innerHTML = `
            <button class="nav-btn prev-btn"><i class="fa-solid fa-chevron-up"></i></button>
            <button class="nav-btn next-btn"><i class="fa-solid fa-chevron-down"></i></button>
        `;
        document.body.appendChild(navContainer);
        
        // Add event listeners to buttons
        document.querySelector('.prev-btn').addEventListener('click', prevSlide);
        document.querySelector('.next-btn').addEventListener('click', nextSlide);
    }

    // Initialize
    function init() {
        updateSlideNumbers();
        createNavButtons();
        
        // Set overflow to hidden on body and html to prevent native scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Set height to 100vh for all slides
        slides.forEach(slide => {
            slide.style.height = '100vh';
        });
        
        // Activate first slide
        slides[0].classList.add('active');
    }

    init();
});
