/**
 * Alert Block
 * Displays contextual messages with different types (info, success, warning, error)
 * Uses theme system for consistent styling and icons
 * @author AEM EDS Expert
 */

import { getIcons, createThemedIcon, getColors } from '../../scripts/theme.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Creates the alert header with icon and title
 * @param {string} type - Alert type (info, success, warning, error)
 * @param {string} title - Alert title
 * @returns {HTMLElement} Alert header element
 */
function createAlertHeader(type, title) {
  const header = document.createElement('div');
  header.className = 'alert-header';

  // Get appropriate icon based on alert type
  const iconMap = {
    info: 'ui.info',
    success: 'ui.success',
    warning: 'ui.warning',
    error: 'ui.error'
  };

  const icon = createThemedIcon(iconMap[type] || 'ui.info', {
    className: `alert-icon alert-icon--${type}`,
    size: 'lg',
    ariaLabel: `${type} alert`
  });

  const titleElement = document.createElement('h3');
  titleElement.className = 'alert-title';
  titleElement.textContent = title || getDefaultTitle(type);

  header.appendChild(icon);
  header.appendChild(titleElement);

  return header;
}

/**
 * Creates the alert body content
 * @param {string} message - Alert message content
 * @returns {HTMLElement} Alert body element
 */
function createAlertBody(message) {
  const body = document.createElement('div');
  body.className = 'alert-body';

  if (message) {
    body.innerHTML = message;
  }

  return body;
}

/**
 * Creates the dismissible button
 * @param {Function} onDismiss - Callback for dismiss action
 * @returns {HTMLElement} Dismiss button element
 */
function createDismissButton(onDismiss) {
  const button = document.createElement('button');
  button.className = 'alert-dismiss';
  button.setAttribute('aria-label', 'Dismiss alert');

  const closeIcon = createThemedIcon('ui.close', {
    size: 'base',
    ariaLabel: 'Close'
  });

  button.appendChild(closeIcon);
  button.addEventListener('click', onDismiss);

  return button;
}

/**
 * Gets default title for alert type
 * @param {string} type - Alert type
 * @returns {string} Default title
 */
function getDefaultTitle(type) {
  const titles = {
    info: 'Information',
    success: 'Success',
    warning: 'Warning',
    error: 'Error'
  };
  return titles[type] || 'Alert';
}

/**
 * Parses block content to extract alert configuration
 * @param {HTMLElement} block - The block element
 * @returns {Object} Alert configuration
 */
function parseAlertConfig(block) {
  const rows = [...block.children];
  const config = {
    type: 'info',
    title: '',
    message: '',
    dismissible: false
  };

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();

      switch (key) {
        case 'type':
          if (['info', 'success', 'warning', 'error'].includes(value)) {
            config.type = value;
          }
          break;
        case 'title':
          config.title = value;
          break;
        case 'message':
          config.message = cells[1].innerHTML.trim();
          break;
        case 'dismissible':
          config.dismissible = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
          break;
      }
    }
  });

  // If only one row, treat as message with default settings
  if (rows.length === 1 && rows[0].children.length === 1) {
    config.message = rows[0].innerHTML.trim();
  }

  return config;
}

/**
 * Animates alert appearance
 * @param {HTMLElement} alertElement - The alert element
 */
function animateAlert(alertElement) {
  alertElement.style.opacity = '0';
  alertElement.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    alertElement.style.transition = 'all 300ms ease-out';
    alertElement.style.opacity = '1';
    alertElement.style.transform = 'translateY(0)';
  }, 50);
}

/**
 * Dismisses the alert with animation
 * @param {HTMLElement} alertElement - The alert element
 */
function dismissAlert(alertElement) {
  alertElement.style.transition = 'all 200ms ease-in';
  alertElement.style.opacity = '0';
  alertElement.style.transform = 'translateY(-10px)';
  alertElement.style.maxHeight = alertElement.offsetHeight + 'px';
  
  setTimeout(() => {
    alertElement.style.maxHeight = '0';
    alertElement.style.paddingTop = '0';
    alertElement.style.paddingBottom = '0';
    alertElement.style.marginTop = '0';
    alertElement.style.marginBottom = '0';
  }, 200);
  
  setTimeout(() => {
    alertElement.remove();
  }, 400);
}

/**
 * Main decoration function for the alert block
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Parse configuration from block content
  const config = parseAlertConfig(block);
  
  // Clear original content
  block.innerHTML = '';
  
  // Create alert container
  const alert = document.createElement('div');
  alert.className = `alert-container alert-container--${config.type}`;
  
  // Apply theme-based styling
  alert.style.setProperty('--alert-color', getColors()[config.type] || getColors().info);
  
  // Create alert header
  const header = createAlertHeader(config.type, config.title);
  alert.appendChild(header);
  
  // Create alert body if message exists
  if (config.message) {
    const body = createAlertBody(config.message);
    alert.appendChild(body);
  }
  
  // Add dismiss button if dismissible
  if (config.dismissible) {
    const dismissButton = createDismissButton(() => dismissAlert(alert));
    alert.appendChild(dismissButton);
    alert.classList.add('alert-container--dismissible');
  }
  
  // Move instrumentation for Franklin tracking
  if (block.children.length > 0) {
    moveInstrumentation(block, alert);
  }
  
  // Add to block
  block.appendChild(alert);
  block.className = `${block.className} theme-component`.trim();
  
  // Animate appearance
  requestAnimationFrame(() => animateAlert(alert));
  
  // Auto-dismiss for success alerts after 5 seconds
  if (config.type === 'success' && config.dismissible) {
    setTimeout(() => {
      if (alert.parentNode) {
        dismissAlert(alert);
      }
    }, 5000);
  }
}