import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createVideoElement(src, poster) {
  const video = document.createElement('video');
  video.src = src;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  
  if (poster) {
    video.poster = poster;
  }
  
  // Add loading states
  video.addEventListener('loadstart', () => {
    video.closest('.hero-banner').classList.add('video-loading');
  });
  
  video.addEventListener('canplay', () => {
    video.closest('.hero-banner').classList.remove('video-loading');
    video.closest('.hero-banner').classList.add('video-ready');
  });
  
  return video;
}

function createCTAButtons(ctaContainer) {
  const buttons = ctaContainer.querySelectorAll('a');
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'hero-banner-ctas';
  
  buttons.forEach((button, index) => {
    button.className = `cta-button ${index === 0 ? 'primary' : 'secondary'}`;
    buttonContainer.appendChild(button);
  });
  
  return buttonContainer;
}

function setupScrollIndicator(block) {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = `
    <div class="scroll-arrow"></div>
    <span>Scroll</span>
  `;
  
  // Hide indicator on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      indicator.style.opacity = entry.isIntersecting ? '1' : '0';
    });
  });
  
  observer.observe(block);
  return indicator;
}

function setupAnimations(block) {
  const content = block.querySelector('.hero-banner-content');
  if (!content) return;
  
  // Intersection Observer for fade-in animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(content);
  
  // Stagger animation for child elements
  const animatedElements = content.querySelectorAll('.hero-banner-eyebrow, .hero-banner-heading, .hero-banner-subtitle, .hero-banner-ctas');
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
  });
}

export default function decorate(block) {
  const children = [...block.children];
  
  // Clear the block
  block.innerHTML = '';
  
  // Create main structure
  const background = document.createElement('div');
  background.className = 'hero-banner-background';
  
  const overlay = document.createElement('div');
  overlay.className = 'hero-banner-overlay';
  
  const content = document.createElement('div');
  content.className = 'hero-banner-content';
  
  // Process content based on structure
  children.forEach((row, index) => {
    const cells = [...row.children];
    
    if (index === 0 && cells.length > 0) {
      // First row: background media
      const mediaCell = cells[0];
      const mediaContent = mediaCell.textContent.trim();
      
      if (mediaContent.includes('.mp4') || mediaContent.includes('.webm')) {
        // Video background
        const videoSrc = mediaContent;
        const posterSrc = cells[1]?.textContent.trim() || '';
        const video = createVideoElement(videoSrc, posterSrc);
        background.appendChild(video);
      } else {
        // Image background
        const img = mediaCell.querySelector('img');
        if (img) {
          const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
          background.appendChild(optimizedPicture);
          moveInstrumentation(img, optimizedPicture.querySelector('img'));
        }
      }
    } else {
      // Content rows
      cells.forEach((cell, cellIndex) => {
        const cellContent = cell.textContent.trim();
        
        if (cellIndex === 0 && cellContent) {
          // Eyebrow text
          const eyebrow = document.createElement('p');
          eyebrow.className = 'hero-banner-eyebrow';
          eyebrow.textContent = cellContent;
          content.appendChild(eyebrow);
        } else if (cellIndex === 1 && cellContent) {
          // Main heading
          const heading = document.createElement('h1');
          heading.className = 'hero-banner-heading';
          heading.innerHTML = cell.innerHTML;
          content.appendChild(heading);
          moveInstrumentation(cell, heading);
        } else if (cellIndex === 2 && cellContent) {
          // Subtitle
          const subtitle = document.createElement('p');
          subtitle.className = 'hero-banner-subtitle';
          subtitle.innerHTML = cell.innerHTML;
          content.appendChild(subtitle);
          moveInstrumentation(cell, subtitle);
        } else if (cellIndex === 3 && cell.querySelector('a')) {
          // CTA buttons
          const ctaButtons = createCTAButtons(cell);
          content.appendChild(ctaButtons);
          moveInstrumentation(cell, ctaButtons);
        }
      });
    }
  });
  
  // Assemble the block
  block.appendChild(background);
  block.appendChild(overlay);
  block.appendChild(content);
  
  // Add scroll indicator if content exists
  if (content.children.length > 0) {
    const scrollIndicator = setupScrollIndicator(block);
    block.appendChild(scrollIndicator);
  }
  
  // Setup animations
  setupAnimations(block);
  
  // Add loaded class for CSS transitions
  setTimeout(() => {
    block.classList.add('hero-banner-loaded');
  }, 100);
}