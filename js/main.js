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

// Fetch and display article previews from Open Graph metadata
document.addEventListener('DOMContentLoaded', function() {
    const newsArticles = document.querySelectorAll('.news-article[data-url]');
    
    newsArticles.forEach(function(article) {
        const url = article.getAttribute('data-url');
        if (!url) return;
        
        fetchArticlePreview(url, article);
    });
});

async function fetchArticlePreview(url, articleElement) {
    try {
        // Use a CORS proxy to fetch the page
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (!data.contents) {
            throw new Error('Failed to fetch article');
        }
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Extract Open Graph metadata
        const getMetaTag = (property) => {
            const tag = doc.querySelector(`meta[property="${property}"]`) || 
                       doc.querySelector(`meta[name="${property}"]`);
            return tag ? tag.getAttribute('content') : null;
        };
        
        const title = getMetaTag('og:title') || 
                     doc.querySelector('title')?.textContent || 
                     'Article';
        const description = getMetaTag('og:description') || 
                          getMetaTag('description') || 
                          '';
        const image = getMetaTag('og:image') || '';
        const siteName = getMetaTag('og:site_name') || 
                        new URL(url).hostname.replace('www.', '');
        
        // Try to extract date from article
        let date = '';
        const dateMeta = doc.querySelector('meta[property="article:published_time"]') || 
                        doc.querySelector('time[datetime]');
        if (dateMeta) {
            const dateValue = dateMeta.getAttribute('content') || dateMeta.getAttribute('datetime');
            if (dateValue) {
                const dateObj = new Date(dateValue);
                date = dateObj.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
        }
        
        // Update the article element
        const titleElement = articleElement.querySelector('.news-article-title');
        const metaElement = articleElement.querySelector('.news-article-meta');
        const descriptionElement = articleElement.querySelector('.news-article-description');
        const imageElement = articleElement.querySelector('.news-preview-image');
        const imagePlaceholder = articleElement.querySelector('.news-image-placeholder');
        const linkElement = articleElement.querySelector('.news-article-url');
        
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        if (metaElement) {
            metaElement.textContent = siteName + (date ? ' · ' + date : '');
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = description || 'Click to read the full article.';
        }
        
        if (image && imageElement) {
            imageElement.src = image;
            imageElement.alt = title;
            imageElement.style.display = 'block';
            
            // Handle image load errors
            imageElement.onerror = function() {
                this.style.display = 'none';
                if (imagePlaceholder) {
                    imagePlaceholder.style.display = 'flex';
                    imagePlaceholder.textContent = 'Image not available';
                }
            };
            
            imageElement.onload = function() {
                if (imagePlaceholder) {
                    imagePlaceholder.style.display = 'none';
                }
            };
        } else if (imagePlaceholder) {
            imagePlaceholder.textContent = 'No preview available';
        }
        
        if (linkElement) {
            linkElement.href = url;
        }
        
    } catch (error) {
        console.error('Error fetching article preview:', error);
        const articleElement = articleElement || document.querySelector('.news-article[data-url]');
        if (articleElement) {
            const titleElement = articleElement.querySelector('.news-article-title');
            const metaElement = articleElement.querySelector('.news-article-meta');
            const descriptionElement = articleElement.querySelector('.news-article-description');
            const linkElement = articleElement.querySelector('.news-article-url');
            
            if (titleElement) titleElement.textContent = 'Error loading preview';
            if (metaElement) metaElement.textContent = '';
            if (descriptionElement) descriptionElement.textContent = 'Unable to load article preview. Click the link to view the article.';
            if (linkElement) linkElement.href = url;
        }
    }
}


