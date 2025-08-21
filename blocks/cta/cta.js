/**
 * CTA (Call to Action) Block
 * Displays compelling call-to-action sections with themed styling
 * Uses theme system for consistent buttons, colors, and typography
 * @author AEM EDS Expert
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { createThemedButton, createThemedIcon } from '../../scripts/theme.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Creates the CTA content section
 * @param {Object} config - CTA configuration
 * @returns {HTMLElement} Content element
 */
function createCTAContent(config) {
  const content = document.createElement('div');
  content.className = 'cta-content';
  
  // Create title
  if (config.title) {
    const title = document.createElement('h2');
    title.className = 'cta-title';
    title.textContent = config.title;
    content.appendChild(title);
  }
  
  // Create description
  if (config.description) {
    const description = document.createElement('div');
    description.className = 'cta-description';
    description.innerHTML = config.description;
    content.appendChild(description);
  }
  
  return content;
}

/**
 * Creates the CTA actions section with buttons
 * @param {Object} config - CTA configuration
 * @returns {HTMLElement} Actions element
 */
function createCTAActions(config) {
  const actions = document.createElement('div');
  actions.className = 'cta-actions';
  
  // Primary button
  if (config.primaryButton && config.primaryLink) {
    const primaryBtn = createThemedButton(config.primaryButton, {
      variant: 'primary',
      size: 'lg',
      icon: 'ui.arrow_right',
      className: 'cta-button-primary'
    });
    
    // Convert to link if needed
    const primaryLink = document.createElement('a');
    primaryLink.href = config.primaryLink;
    primaryLink.className = primaryBtn.className;
    primaryLink.innerHTML = primaryBtn.innerHTML;
    primaryLink.setAttribute('role', 'button');
    
    actions.appendChild(primaryLink);
  }
  
  // Secondary button
  if (config.secondaryButton && config.secondaryLink) {
    const secondaryBtn = createThemedButton(config.secondaryButton, {
      variant: 'outline',
      size: 'lg',
      className: 'cta-button-secondary'
    });
    
    // Convert to link if needed
    const secondaryLink = document.createElement('a');
    secondaryLink.href = config.secondaryLink;
    secondaryLink.className = secondaryBtn.className;
    secondaryLink.innerHTML = secondaryBtn.innerHTML;
    secondaryLink.setAttribute('role', 'button');
    
    actions.appendChild(secondaryLink);
  }
  
  return actions;
}

/**
 * Creates background image element
 * @param {HTMLElement} picture - Picture element from content
 * @returns {HTMLElement} Background image element
 */
function createBackgroundImage(picture) {
  const bgContainer = document.createElement('div');
  bgContainer.className = 'cta-background';
  
  const img = picture.querySelector('img');
  if (img) {
    const optimizedPicture = createOptimizedPicture(
      img.src,
      img.alt || 'CTA Background',
      false,
      [{ width: '1200' }]
    );
    
    const bgImage = optimizedPicture.querySelector('img');
    bgImage.className = 'cta-bg-image';
    bgContainer.appendChild(optimizedPicture);
  }
  
  // Add overlay
  const overlay = document.createElement('div');
  overlay.className = 'cta-overlay';
  bgContainer.appendChild(overlay);
  
  return bgContainer;
}

/**
 * Parses block content to extract CTA configuration
 * @param {HTMLElement} block - The block element
 * @returns {Object} CTA configuration
 */
function parseCTAConfig(block) {
  const config = {
    title: '',
    description: '',
    primaryButton: '',
    primaryLink: '',
    secondaryButton: '',
    secondaryLink: '',
    style: 'default',
    backgroundImage: null
  };
  
  const rows = [...block.children];
  
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1];
      
      switch (key) {
        case 'title':
        case 'headline':
          config.title = value.textContent.trim();
          break;
        case 'description':
        case 'text':
          config.description = value.innerHTML.trim();
          break;
        case 'primary':
        case 'primarybutton':
        case 'button':
          const primaryText = value.textContent.trim();
          const primaryLink = value.querySelector('a');
          if (primaryLink) {
            config.primaryButton = primaryText;
            config.primaryLink = primaryLink.href;
          } else {
            config.primaryButton = primaryText;
          }
          break;
        case 'primarylink':
          config.primaryLink = value.textContent.trim();
          break;
        case 'secondary':
        case 'secondarybutton':
          const secondaryText = value.textContent.trim();
          const secondaryLink = value.querySelector('a');
          if (secondaryLink) {
            config.secondaryButton = secondaryText;
            config.secondaryLink = secondaryLink.href;
          } else {
            config.secondaryButton = secondaryText;
          }
          break;
        case 'secondarylink':
          config.secondaryLink = value.textContent.trim();
          break;
        case 'style':
          config.style = value.textContent.trim() || 'default';
          break;
        case 'background':
        case 'backgroundimage':
        case 'image':
          const picture = value.querySelector('picture');
          if (picture) {
            config.backgroundImage = picture;
          }
          break;
      }
    }
  });
  
  // Simple parsing if no structured data
  if (!config.title && rows.length > 0) {
    // First row as title
    config.title = rows[0].textContent.trim();
    
    // Second row as description
    if (rows.length > 1) {
      config.description = rows[1].innerHTML.trim();
    }
    
    // Third row as buttons
    if (rows.length > 2) {
      const buttonRow = rows[2];
      const buttons = buttonRow.querySelectorAll('a');
      if (buttons.length > 0) {
        config.primaryButton = buttons[0].textContent.trim();
        config.primaryLink = buttons[0].href;
      }
      if (buttons.length > 1) {
        config.secondaryButton = buttons[1].textContent.trim();
        config.secondaryLink = buttons[1].href;
      }
    }
  }
  
  return config;
}

/**
 * Animates CTA appearance with staggered effects
 * @param {HTMLElement} container - CTA container
 */
function animateCTA(container) {
  const elements = [
    container.querySelector('.cta-content'),
    container.querySelector('.cta-actions')
  ];
  
  container.style.opacity = '0';
  container.style.transform = 'translateY(40px)';
  
  setTimeout(() => {
    container.style.transition = 'all 800ms ease-out';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    
    // Animate content elements
    elements.forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
          element.style.transition = 'all 600ms ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
      }
    });
  }, 150);
}

/**
 * Main decoration function for the CTA block
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Parse configuration from block content
  const config = parseCTAConfig(block);
  
  // Clear original content
  block.innerHTML = '';
  
  // Create main container
  const container = document.createElement('div');
  container.className = `cta-container cta-container--${config.style}`;
  
  // Add background image if provided
  if (config.backgroundImage) {
    const background = createBackgroundImage(config.backgroundImage);
    container.appendChild(background);
    container.classList.add('cta-container--with-bg');
  }
  
  // Create wrapper for content positioning
  const wrapper = document.createElement('div');
  wrapper.className = 'cta-wrapper';
  
  // Create content section
  const content = createCTAContent(config);
  wrapper.appendChild(content);
  
  // Create actions section
  const actions = createCTAActions(config);
  if (actions.children.length > 0) {
    wrapper.appendChild(actions);
  }
  
  container.appendChild(wrapper);
  
  // Move instrumentation for Franklin tracking
  moveInstrumentation(block, container);
  
  // Add to block
  block.appendChild(container);
  block.className = `${block.className} theme-component`.trim();
  
  // Add intersection observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !container.classList.contains('animated')) {
        container.classList.add('animated');
        animateCTA(container);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  observer.observe(container);
}