/**
 * Theme Configuration System for AEM EDS
 * Provides centralized access to colors, fonts, and icons across all blocks
 * @author AEM EDS Expert
 */

// Theme configuration object containing all design tokens
const THEME_CONFIG = {
  // Color palette - extends existing CSS custom properties
  colors: {
    // Primary colors
    primary: '#3b63fb',
    primaryHover: '#1d3ecf',
    secondary: '#667eea',
    secondaryHover: '#764ba2',
    
    // Neutral colors
    background: '#ffffff',
    surface: '#f8f8f8',
    text: '#131313',
    textLight: '#505050',
    border: '#e5e7eb',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Gradient definitions
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #3b63fb 0%, #1d3ecf 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    }
  },

  // Typography system - extends existing font definitions
  fonts: {
    // Font families
    families: {
      body: 'roboto, roboto-fallback, sans-serif',
      heading: 'roboto-condensed, roboto-condensed-fallback, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
    },
    
    // Font weights
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    
    // Font sizes (responsive)
    sizes: {
      xs: { mobile: '14px', desktop: '12px' },
      sm: { mobile: '16px', desktop: '14px' },
      base: { mobile: '18px', desktop: '16px' },
      lg: { mobile: '20px', desktop: '18px' },
      xl: { mobile: '24px', desktop: '20px' },
      '2xl': { mobile: '30px', desktop: '24px' },
      '3xl': { mobile: '36px', desktop: '30px' },
      '4xl': { mobile: '44px', desktop: '36px' },
      '5xl': { mobile: '55px', desktop: '45px' }
    }
  },

  // Icon system using Unicode and custom icons
  icons: {
    // Common UI icons
    ui: {
      close: '✕',
      check: '✓',
      arrow_right: '→',
      arrow_left: '←',
      arrow_up: '↑',
      arrow_down: '↓',
      chevron_right: '›',
      chevron_left: '‹',
      chevron_up: '^',
      chevron_down: 'v',
      plus: '+',
      minus: '−',
      search: '🔍',
      menu: '☰',
      home: '🏠',
      user: '👤',
      settings: '⚙️',
      help: '❓',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    },
    
    // Content icons
    content: {
      document: '📄',
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      download: '⬇️',
      upload: '⬆️',
      link: '🔗',
      email: '📧',
      phone: '📞',
      location: '📍',
      calendar: '📅',
      clock: '🕐',
      tag: '🏷️',
      star: '⭐',
      heart: '❤️',
      bookmark: '🔖'
    },
    
    // Social icons
    social: {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼',
      youtube: '📺',
      github: '🐱'
    }
  },

  // Spacing system (8px base unit)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    base: '1rem',    // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem'    // 128px
  },

  // Border radius system
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px'
  },

  // Shadow system
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // Animation system
  animation: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  }
};

/**
 * Get a theme value by path
 * @param {string} path - Dot notation path (e.g., 'colors.primary', 'fonts.sizes.lg.mobile')
 * @returns {*} The theme value or undefined if not found
 */
export function getThemeValue(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], THEME_CONFIG);
}

/**
 * Get all colors from the theme
 * @returns {object} Color configuration object
 */
export function getColors() {
  return THEME_CONFIG.colors;
}

/**
 * Get all fonts from the theme
 * @returns {object} Font configuration object
 */
export function getFonts() {
  return THEME_CONFIG.fonts;
}

/**
 * Get all icons from the theme
 * @returns {object} Icon configuration object
 */
export function getIcons() {
  return THEME_CONFIG.icons;
}

/**
 * Get responsive font size for current viewport
 * @param {string} size - Size key (xs, sm, base, lg, etc.)
 * @returns {string} Font size value
 */
export function getResponsiveFontSize(size) {
  const sizeConfig = THEME_CONFIG.fonts.sizes[size];
  if (!sizeConfig) return THEME_CONFIG.fonts.sizes.base.mobile;
  
  // Return mobile size by default, desktop can be handled via CSS media queries
  return sizeConfig.mobile;
}

/**
 * Apply theme CSS custom properties to an element
 * @param {HTMLElement} element - Element to apply theme to
 * @param {object} customProperties - Object with CSS custom property names and values
 */
export function applyThemeProperties(element, customProperties = {}) {
  // Apply base theme properties
  element.style.setProperty('--theme-primary', THEME_CONFIG.colors.primary);
  element.style.setProperty('--theme-secondary', THEME_CONFIG.colors.secondary);
  element.style.setProperty('--theme-background', THEME_CONFIG.colors.background);
  element.style.setProperty('--theme-text', THEME_CONFIG.colors.text);
  element.style.setProperty('--theme-gradient-primary', THEME_CONFIG.colors.gradients.primary);
  
  // Apply custom properties
  Object.entries(customProperties).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
}

/**
 * Create an icon element with theme styling
 * @param {string} iconKey - Icon key from theme (e.g., 'ui.check', 'content.document')
 * @param {object} options - Icon options (size, color, className)
 * @returns {HTMLElement} Configured icon element
 */
export function createThemedIcon(iconKey, options = {}) {
  const {
    size = 'base',
    color = 'currentColor',
    className = '',
    ariaLabel = ''
  } = options;
  
  const iconValue = getThemeValue(`icons.${iconKey}`);
  if (!iconValue) {
    console.warn(`Icon not found: ${iconKey}`);
    return document.createElement('span');
  }
  
  const icon = document.createElement('span');
  icon.className = `theme-icon ${className}`.trim();
  icon.textContent = iconValue;
  icon.style.color = color;
  icon.style.fontSize = getResponsiveFontSize(size);
  icon.style.display = 'inline-block';
  icon.style.lineHeight = '1';
  
  if (ariaLabel) {
    icon.setAttribute('aria-label', ariaLabel);
    icon.setAttribute('role', 'img');
  } else {
    icon.setAttribute('aria-hidden', 'true');
  }
  
  return icon;
}

/**
 * Create a themed button with consistent styling
 * @param {string} text - Button text
 * @param {object} options - Button options
 * @returns {HTMLElement} Configured button element
 */
export function createThemedButton(text, options = {}) {
  const {
    variant = 'primary',
    size = 'base',
    icon = null,
    onClick = null,
    className = '',
    disabled = false
  } = options;
  
  const button = document.createElement('button');
  button.className = `theme-button theme-button--${variant} theme-button--${size} ${className}`.trim();
  button.disabled = disabled;
  
  // Add icon if provided
  if (icon) {
    const iconEl = createThemedIcon(icon, { size: size === 'sm' ? 'sm' : 'base' });
    iconEl.style.marginRight = THEME_CONFIG.spacing.sm;
    button.appendChild(iconEl);
  }
  
  const textSpan = document.createElement('span');
  textSpan.textContent = text;
  button.appendChild(textSpan);
  
  // Add click handler
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Initialize theme system - should be called once during app initialization
 */
export function initializeTheme() {
  // Add theme CSS custom properties to root
  const root = document.documentElement;
  
  // Add color variables
  Object.entries(THEME_CONFIG.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      root.style.setProperty(`--theme-color-${key}`, value);
    }
  });
  
  // Add gradient variables
  Object.entries(THEME_CONFIG.colors.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--theme-gradient-${key}`, value);
  });
  
  // Add spacing variables
  Object.entries(THEME_CONFIG.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--theme-spacing-${key}`, value);
  });
  
  // Add radius variables
  Object.entries(THEME_CONFIG.radius).forEach(([key, value]) => {
    root.style.setProperty(`--theme-radius-${key}`, value);
  });
  
  // Add shadow variables
  Object.entries(THEME_CONFIG.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--theme-shadow-${key}`, value);
  });
}

// Export the complete theme configuration for advanced use cases
export { THEME_CONFIG };

// Auto-initialize theme when module is imported
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }
}