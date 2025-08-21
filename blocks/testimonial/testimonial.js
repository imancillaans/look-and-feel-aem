/**
 * Testimonial Block
 * Displays customer testimonials and quotes with themed styling
 * Uses theme system for consistent icons, colors, and typography
 * @author AEM EDS Expert
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { createThemedIcon } from '../../scripts/theme.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Creates star rating display
 * @param {number} rating - Rating from 1 to 5
 * @returns {HTMLElement} Rating element
 */
function createRating(rating) {
  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'testimonial-rating';
  ratingContainer.setAttribute('aria-label', `${rating} out of 5 stars`);
  
  for (let i = 1; i <= 5; i++) {
    const star = createThemedIcon('content.star', {
      className: i <= rating ? 'star-filled' : 'star-empty',
      size: 'base',
      ariaLabel: i <= rating ? 'filled star' : 'empty star'
    });
    ratingContainer.appendChild(star);
  }
  
  return ratingContainer;
}

/**
 * Creates quote content with themed quote marks
 * @param {string} quote - Quote text
 * @returns {HTMLElement} Quote element
 */
function createQuote(quote) {
  const quoteContainer = document.createElement('div');
  quoteContainer.className = 'testimonial-quote';
  
  // Opening quote mark
  const openQuote = document.createElement('span');
  openQuote.className = 'quote-mark quote-mark--open';
  openQuote.textContent = '"';
  openQuote.setAttribute('aria-hidden', 'true');
  
  // Quote content
  const quoteContent = document.createElement('div');
  quoteContent.className = 'quote-content';
  quoteContent.innerHTML = quote;
  
  // Closing quote mark
  const closeQuote = document.createElement('span');
  closeQuote.className = 'quote-mark quote-mark--close';
  closeQuote.textContent = '"';
  closeQuote.setAttribute('aria-hidden', 'true');
  
  quoteContainer.appendChild(openQuote);
  quoteContainer.appendChild(quoteContent);
  quoteContainer.appendChild(closeQuote);
  
  return quoteContainer;
}

/**
 * Creates author information section
 * @param {Object} authorData - Author information
 * @returns {HTMLElement} Author element
 */
function createAuthor(authorData) {
  const authorContainer = document.createElement('div');
  authorContainer.className = 'testimonial-author';
  
  // Author image if available
  if (authorData.image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'author-image';
    
    const img = authorData.image.querySelector('img');
    if (img) {
      const optimizedPicture = createOptimizedPicture(
        img.src,
        img.alt || authorData.name,
        false,
        [{ width: '80' }]
      );
      optimizedPicture.querySelector('img').className = 'author-avatar';
      imageContainer.appendChild(optimizedPicture);
    }
    
    authorContainer.appendChild(imageContainer);
  }
  
  // Author info
  const authorInfo = document.createElement('div');
  authorInfo.className = 'author-info';
  
  if (authorData.name) {
    const authorName = document.createElement('div');
    authorName.className = 'author-name';
    authorName.textContent = authorData.name;
    authorInfo.appendChild(authorName);
  }
  
  if (authorData.title) {
    const authorTitle = document.createElement('div');
    authorTitle.className = 'author-title';
    authorTitle.textContent = authorData.title;
    authorInfo.appendChild(authorTitle);
  }
  
  if (authorData.company) {
    const authorCompany = document.createElement('div');
    authorCompany.className = 'author-company';
    authorCompany.textContent = authorData.company;
    authorInfo.appendChild(authorCompany);
  }
  
  authorContainer.appendChild(authorInfo);
  
  return authorContainer;
}

/**
 * Parses block content to extract testimonial data
 * @param {HTMLElement} block - The block element
 * @returns {Object} Testimonial configuration
 */
function parseTestimonialConfig(block) {
  const config = {
    quote: '',
    author: {
      name: '',
      title: '',
      company: '',
      image: null
    },
    rating: 0,
    style: 'default'
  };
  
  const rows = [...block.children];
  
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1];
      
      switch (key) {
        case 'quote':
        case 'text':
          config.quote = value.innerHTML.trim();
          break;
        case 'author':
        case 'name':
          config.author.name = value.textContent.trim();
          break;
        case 'title':
          config.author.title = value.textContent.trim();
          break;
        case 'company':
          config.author.company = value.textContent.trim();
          break;
        case 'image':
        case 'photo':
          const picture = value.querySelector('picture');
          if (picture) {
            config.author.image = picture;
          }
          break;
        case 'rating':
          const ratingValue = parseInt(value.textContent.trim());
          config.rating = Math.max(0, Math.min(5, ratingValue));
          break;
        case 'style':
          config.style = value.textContent.trim() || 'default';
          break;
      }
    }
  });
  
  // If no structured data, treat first row as quote and second as author info
  if (!config.quote && rows.length > 0) {
    config.quote = rows[0].innerHTML.trim();
    if (rows.length > 1) {
      const authorText = rows[1].textContent.trim();
      // Try to parse "Name, Title at Company" format
      const authorParts = authorText.split(',');
      config.author.name = authorParts[0]?.trim() || '';
      if (authorParts[1]) {
        const titleCompany = authorParts[1].trim();
        const atIndex = titleCompany.toLowerCase().indexOf(' at ');
        if (atIndex > -1) {
          config.author.title = titleCompany.substring(0, atIndex).trim();
          config.author.company = titleCompany.substring(atIndex + 4).trim();
        } else {
          config.author.title = titleCompany;
        }
      }
    }
  }
  
  return config;
}

/**
 * Animates testimonial appearance
 * @param {HTMLElement} testimonial - Testimonial element
 */
function animateTestimonial(testimonial) {
  testimonial.style.opacity = '0';
  testimonial.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    testimonial.style.transition = 'all 600ms ease-out';
    testimonial.style.opacity = '1';
    testimonial.style.transform = 'translateY(0)';
    
    // Stagger quote and author animations
    const quote = testimonial.querySelector('.testimonial-quote');
    const author = testimonial.querySelector('.testimonial-author');
    const rating = testimonial.querySelector('.testimonial-rating');
    
    [quote, author, rating].forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
          element.style.transition = 'all 400ms ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
      }
    });
  }, 100);
}

/**
 * Main decoration function for the testimonial block
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Parse configuration from block content
  const config = parseTestimonialConfig(block);
  
  // Clear original content
  block.innerHTML = '';
  
  // Create main container
  const container = document.createElement('div');
  container.className = `testimonial-container testimonial-container--${config.style}`;
  
  // Create rating if provided
  if (config.rating > 0) {
    const rating = createRating(config.rating);
    container.appendChild(rating);
  }
  
  // Create quote
  if (config.quote) {
    const quote = createQuote(config.quote);
    container.appendChild(quote);
  }
  
  // Create author section
  if (config.author.name || config.author.image) {
    const author = createAuthor(config.author);
    container.appendChild(author);
  }
  
  // Move instrumentation for Franklin tracking
  moveInstrumentation(block, container);
  
  // Add to block
  block.appendChild(container);
  block.className = `${block.className} theme-component`.trim();
  
  // Animate appearance
  setTimeout(() => animateTestimonial(container), 100);
}