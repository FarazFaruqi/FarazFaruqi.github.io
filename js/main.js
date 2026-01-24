// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Update current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Toggle topic sections
function toggleTopic(element) {
    const topicSection = element.closest('.publication-topic-section');
    const content = topicSection.querySelector('.topic-content');
    
    element.classList.toggle('collapsed');
    content.classList.toggle('collapsed');
}

// Toggle exhibition sections
function toggleExhibition(element) {
    const exhibition = element.closest('.exhibition');
    const content = exhibition.querySelector('.exhibition-content');
    
    element.classList.toggle('active');
    content.classList.toggle('collapsed');
}

// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-image');

    // Open lightbox when clicking on gallery images
    galleryImages.forEach(function(image) {
        image.addEventListener('click', function() {
            lightbox.classList.add('active');
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightboxCaption.textContent = this.alt;
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox when clicking the close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            closeLightbox();
        });
    }

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
});


