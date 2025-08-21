/**
 * Stats Block
 * Displays statistical information with animated numbers and themed styling
 * Uses theme system for consistent icons, colors, and typography
 * @author AEM EDS Expert
 */

import { createThemedIcon, getColors } from '../../scripts/theme.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Animates a number from 0 to target value
 * @param {HTMLElement} element - Element containing the number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);
    
    element.textContent = formatNumber(current);
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = formatNumber(target);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

/**
 * Formats numbers with appropriate separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

/**
 * Creates a single stat item
 * @param {Object} statData - Stat configuration object
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} Stat item element
 */
function createStatItem(statData, options = {}) {
  const { animated = false, style = 'default' } = options;
  
  const item = document.createElement('div');
  item.className = `stats-item stats-item--${style}`;
  
  // Create icon if provided
  if (statData.icon) {
    const iconElement = createThemedIcon(statData.icon, {
      className: 'stats-icon',
      size: 'xl',
      ariaLabel: `${statData.label} icon`
    });
    item.appendChild(iconElement);
  }
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'stats-content';
  
  // Create number element
  const numberElement = document.createElement('div');
  numberElement.className = 'stats-number';
  
  if (animated) {
    // Start with 0 for animation
    numberElement.textContent = '0';
    numberElement.setAttribute('data-target', statData.value);
  } else {
    numberElement.textContent = formatNumber(statData.value);
  }
  
  // Add prefix/suffix if provided
  if (statData.prefix) {
    const prefix = document.createElement('span');
    prefix.className = 'stats-prefix';
    prefix.textContent = statData.prefix;
    numberElement.prepend(prefix);
  }
  
  if (statData.suffix) {
    const suffix = document.createElement('span');
    suffix.className = 'stats-suffix';
    suffix.textContent = statData.suffix;
    numberElement.appendChild(suffix);
  }
  
  content.appendChild(numberElement);
  
  // Create label
  const label = document.createElement('div');
  label.className = 'stats-label';
  label.textContent = statData.label;
  content.appendChild(label);
  
  // Create description if provided
  if (statData.description) {
    const description = document.createElement('div');
    description.className = 'stats-description';
    description.textContent = statData.description;
    content.appendChild(description);
  }
  
  item.appendChild(content);
  
  return item;
}

/**
 * Parses block content to extract stats data
 * @param {HTMLElement} block - The block element
 * @returns {Object} Parsed configuration
 */
function parseStatsConfig(block) {
  const config = {
    layout: 'grid',
    animated: false,
    style: 'default',
    stats: []
  };
  
  const rows = [...block.children];
  
  // Check if first row contains configuration
  if (rows.length > 0) {
    const firstRow = rows[0];
    const firstCell = firstRow.children[0];
    
    if (firstCell && firstCell.textContent.includes('|')) {
      // Configuration row format: layout|animated|style
      const configParts = firstCell.textContent.split('|');
      config.layout = configParts[0]?.trim() || 'grid';
      config.animated = configParts[1]?.trim().toLowerCase() === 'true';
      config.style = configParts[2]?.trim() || 'default';
      rows.shift(); // Remove config row
    }
  }
  
  // Parse stat rows
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const stat = {
        value: parseFloat(cells[0].textContent.replace(/[^0-9.]/g, '')) || 0,
        label: cells[1].textContent.trim(),
        description: cells[2]?.textContent.trim() || '',
        icon: cells[3]?.textContent.trim() || null,
        prefix: '',
        suffix: ''
      };
      
      // Extract prefix/suffix from value cell
      const valueText = cells[0].textContent.trim();
      const numberMatch = valueText.match(/^([^0-9]*)([\d,\.]+)([^0-9]*)$/);
      if (numberMatch) {
        stat.prefix = numberMatch[1];
        stat.suffix = numberMatch[3];
      }
      
      config.stats.push(stat);
    }
  });
  
  // Default stats if none provided
  if (config.stats.length === 0) {
    config.stats = [
      { value: 1250, label: 'Happy Customers', icon: 'content.star' },
      { value: 95, label: 'Satisfaction Rate', suffix: '%', icon: 'ui.success' },
      { value: 47, label: 'Projects Completed', icon: 'content.document' },
      { value: 12, label: 'Years Experience', icon: 'content.calendar' }
    ];
  }
  
  return config;
}

/**
 * Sets up intersection observer for animation trigger
 * @param {HTMLElement} container - Stats container
 * @param {boolean} animated - Whether to animate
 */
function setupAnimationTrigger(container, animated) {
  if (!animated) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numberElements = entry.target.querySelectorAll('.stats-number');
        numberElements.forEach((element) => {
          const target = parseInt(element.getAttribute('data-target'));
          if (target && !element.classList.contains('animated')) {
            element.classList.add('animated');
            animateNumber(element, target);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });
  
  observer.observe(container);
}

/**
 * Main decoration function for the stats block
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Parse configuration from block content
  const config = parseStatsConfig(block);
  
  // Clear original content
  block.innerHTML = '';
  
  // Create main container
  const container = document.createElement('div');
  container.className = `stats-container stats-container--${config.layout} stats-container--${config.style}`;
  
  // Create stats grid
  const grid = document.createElement('div');
  grid.className = 'stats-grid';
  
  // Create stat items
  config.stats.forEach((stat) => {
    const item = createStatItem(stat, {
      animated: config.animated,
      style: config.style
    });
    grid.appendChild(item);
  });
  
  container.appendChild(grid);
  
  // Move instrumentation for Franklin tracking
  if (block.children.length > 0) {
    moveInstrumentation(block, container);
  }
  
  // Add to block
  block.appendChild(container);
  block.className = `${block.className} theme-component`.trim();
  
  // Set up animation if enabled
  setupAnimationTrigger(container, config.animated);
  
  // Add staggered animation for appearance
  setTimeout(() => {
    container.classList.add('stats-animate-in');
    const items = container.querySelectorAll('.stats-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('stats-item-animate-in');
      }, index * 100);
    });
  }, 100);
}