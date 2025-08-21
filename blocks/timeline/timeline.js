/**
 * Timeline Block
 * Displays chronological events with themed styling and animations
 * Uses theme system for consistent icons, colors, and typography
 * @author AEM EDS Expert
 */

import { createThemedIcon, getColors } from '../../scripts/theme.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Creates a timeline item
 * @param {Object} itemData - Timeline item configuration
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} Timeline item element
 */
function createTimelineItem(itemData, options = {}) {
  const { style = 'default', orientation = 'vertical' } = options;
  
  const item = document.createElement('div');
  item.className = `timeline-item timeline-item--${style}`;
  
  // Create timeline marker
  const marker = document.createElement('div');
  marker.className = 'timeline-marker';
  
  // Add icon or default marker
  if (itemData.icon) {
    const iconElement = createThemedIcon(itemData.icon, {
      className: 'timeline-icon',
      size: 'base',
      ariaLabel: `${itemData.title} icon`
    });
    marker.appendChild(iconElement);
  } else {
    const dot = document.createElement('div');
    dot.className = 'timeline-dot';
    marker.appendChild(dot);
  }
  
  item.appendChild(marker);
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'timeline-content';
  
  // Create date/time if provided
  if (itemData.date) {
    const date = document.createElement('div');
    date.className = 'timeline-date';
    date.textContent = itemData.date;
    content.appendChild(date);
  }
  
  // Create title
  if (itemData.title) {
    const title = document.createElement('h3');
    title.className = 'timeline-title';
    title.textContent = itemData.title;
    content.appendChild(title);
  }
  
  // Create description
  if (itemData.description) {
    const description = document.createElement('div');
    description.className = 'timeline-description';
    description.innerHTML = itemData.description;
    content.appendChild(description);
  }
  
  // Create link if provided
  if (itemData.link && itemData.linkText) {
    const link = document.createElement('a');
    link.className = 'timeline-link';
    link.href = itemData.link;
    link.textContent = itemData.linkText;
    
    const linkIcon = createThemedIcon('ui.arrow_right', {
      size: 'sm',
      className: 'timeline-link-icon'
    });
    link.appendChild(linkIcon);
    
    content.appendChild(link);
  }
  
  item.appendChild(content);
  
  return item;
}

/**
 * Creates timeline connector line
 * @param {string} orientation - Timeline orientation
 * @returns {HTMLElement} Connector element
 */
function createTimelineConnector(orientation) {
  const connector = document.createElement('div');
  connector.className = `timeline-connector timeline-connector--${orientation}`;
  
  return connector;
}

/**
 * Parses block content to extract timeline configuration
 * @param {HTMLElement} block - The block element
 * @returns {Object} Timeline configuration
 */
function parseTimelineConfig(block) {
  const config = {
    title: '',
    orientation: 'vertical',
    style: 'default',
    animated: true,
    items: []
  };
  
  const rows = [...block.children];
  
  // Check if first row contains configuration
  if (rows.length > 0 && rows[0].children.length === 1) {
    const configText = rows[0].textContent.trim();
    if (configText.includes('|')) {
      // Configuration format: title|orientation|style|animated
      const configParts = configText.split('|');
      config.title = configParts[0]?.trim() || '';
      config.orientation = configParts[1]?.trim() || 'vertical';
      config.style = configParts[2]?.trim() || 'default';
      config.animated = configParts[3]?.trim().toLowerCase() !== 'false';
      rows.shift(); // Remove config row
    }
  }
  
  // Parse timeline items
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const item = {
        date: cells[0].textContent.trim(),
        title: cells[1].textContent.trim(),
        description: cells[2]?.innerHTML.trim() || '',
        icon: cells[3]?.textContent.trim() || null,
        link: cells[4]?.querySelector('a')?.href || cells[4]?.textContent.trim() || '',
        linkText: cells[4]?.textContent.trim() || ''
      };
      
      // If link cell contains an anchor tag, extract text and href
      const linkAnchor = cells[4]?.querySelector('a');
      if (linkAnchor) {
        item.link = linkAnchor.href;
        item.linkText = linkAnchor.textContent.trim();
      }
      
      config.items.push(item);
    }
  });
  
  // Default timeline items if none provided
  if (config.items.length === 0) {
    config.items = [
      {
        date: '2020',
        title: 'Company Founded',
        description: 'Started our journey with a vision to transform digital experiences.',
        icon: 'content.star'
      },
      {
        date: '2021',
        title: 'First Major Release',
        description: 'Launched our flagship product to great success.',
        icon: 'ui.success'
      },
      {
        date: '2022',
        title: 'Team Expansion',
        description: 'Grew our team to 50+ talented professionals.',
        icon: 'ui.user'
      },
      {
        date: '2023',
        title: 'Global Reach',
        description: 'Expanded operations to serve customers worldwide.',
        icon: 'content.location'
      }
    ];
  }
  
  return config;
}

/**
 * Sets up scroll animation for timeline items
 * @param {HTMLElement} container - Timeline container
 * @param {boolean} animated - Whether to animate
 */
function setupScrollAnimation(container, animated) {
  if (!animated) {
    // Show all items immediately
    container.querySelectorAll('.timeline-item').forEach(item => {
      item.classList.add('timeline-item--visible');
    });
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('timeline-item--visible');
        
        // Animate connector if it exists
        const connector = entry.target.querySelector('.timeline-connector');
        if (connector) {
          setTimeout(() => {
            connector.classList.add('timeline-connector--visible');
          }, 300);
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });
  
  container.querySelectorAll('.timeline-item').forEach((item) => {
    observer.observe(item);
  });
}

/**
 * Main decoration function for the timeline block
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Parse configuration from block content
  const config = parseTimelineConfig(block);
  
  // Clear original content
  block.innerHTML = '';
  
  // Create main container
  const container = document.createElement('div');
  container.className = `timeline-container timeline-container--${config.orientation} timeline-container--${config.style}`;
  
  // Add title if provided
  if (config.title) {
    const title = document.createElement('h2');
    title.className = 'timeline-main-title';
    title.textContent = config.title;
    container.appendChild(title);
  }
  
  // Create timeline wrapper
  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  
  // Create timeline items
  config.items.forEach((itemData, index) => {
    const item = createTimelineItem(itemData, {
      style: config.style,
      orientation: config.orientation
    });
    
    // Add connector line (except for last item in vertical mode)
    if (config.orientation === 'vertical' && index < config.items.length - 1) {
      const connector = createTimelineConnector(config.orientation);
      item.appendChild(connector);
    }
    
    timeline.appendChild(item);
  });
  
  container.appendChild(timeline);
  
  // Move instrumentation for Franklin tracking
  moveInstrumentation(block, container);
  
  // Add to block
  block.appendChild(container);
  block.className = `${block.className} theme-component`.trim();
  
  // Set up scroll animations
  setTimeout(() => {
    setupScrollAnimation(container, config.animated);
  }, 100);
}