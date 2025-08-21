# AEM EDS Themed Blocks Documentation

This document describes the 5 new AEM EDS blocks created with integrated theme system support.

## Theme System Overview

The theme system provides centralized access to:
- **Colors**: Primary, secondary, status colors, and gradients
- **Fonts**: Typography scale and font families
- **Icons**: Unicode icons organized by category (UI, Content, Social)
- **Spacing**: Consistent spacing scale based on 8px grid
- **Shadows**: Box shadow system for depth
- **Animation**: Duration and easing presets

### Theme Files
- `scripts/theme.js` - Core theme configuration and utilities
- `styles/theme.css` - Base CSS for themed components

## Block 1: Alert Block

**Purpose**: Display contextual messages with different severity levels.

### Usage
```
| Type        | info                           |
| Title       | Information                    |
| Message     | This is an informational alert |
| Dismissible | true                          |
```

### Configuration Options
- **Type**: `info`, `success`, `warning`, `error`
- **Title**: Custom title (optional, defaults based on type)
- **Message**: HTML content for the alert body
- **Dismissible**: Boolean to show/hide dismiss button

### Features
- Auto-dismiss for success alerts after 5 seconds
- Smooth animations with fade-in/out effects
- Theme-consistent colors and icons
- Accessibility support with ARIA labels
- Responsive design with mobile optimizations

### Files
- `blocks/alert/alert.js`
- `blocks/alert/alert.css`
- `blocks/alert/_alert.json`

## Block 2: Stats Block

**Purpose**: Display statistical information with animated numbers and visual appeal.

### Usage
```
| grid|true|default |                    |
| 1250              | Happy Customers     |
| 95%               | Satisfaction Rate   |
| 47                | Projects Completed  |
| 12                | Years Experience    |
```

### Configuration Options
- **Layout**: `grid`, `horizontal`, `vertical`
- **Animated**: Boolean for number animations
- **Style**: `default`, `gradient`, `minimal`

### Features
- Animated counting from 0 to target number
- Intersection Observer for scroll-triggered animations
- Automatic number formatting (1K, 1.2M)
- Theme-consistent icons and styling
- Staggered animations for visual appeal
- Responsive grid layouts

### Files
- `blocks/stats/stats.js`
- `blocks/stats/stats.css`
- `blocks/stats/_stats.json`

## Block 3: Testimonial Block

**Purpose**: Display customer testimonials and quotes with author information.

### Usage
```
| Quote   | This is an amazing service that exceeded our expectations! |
| Author  | John Smith                                                |
| Title   | CEO                                                       |
| Company | Tech Innovations Inc                                      |
| Rating  | 5                                                         |
| Style   | card                                                      |
```

### Configuration Options
- **Quote**: HTML content for the testimonial text
- **Author**: Author name
- **Title**: Author job title
- **Company**: Author company
- **Image**: Author photo (picture element)
- **Rating**: 1-5 star rating
- **Style**: `default`, `centered`, `card`, `minimal`

### Features
- Star rating display with theme icons
- Elegant quote marks styling
- Author image optimization
- Multiple layout styles
- Smooth entrance animations
- Responsive design

### Files
- `blocks/testimonial/testimonial.js`
- `blocks/testimonial/testimonial.css`
- `blocks/testimonial/_testimonial.json`

## Block 4: CTA (Call to Action) Block

**Purpose**: Create compelling call-to-action sections with buttons and background images.

### Usage
```
| Title           | Ready to Get Started?                    |
| Description     | Join thousands of satisfied customers    |
| Primary         | Get Started Now                         |
| PrimaryLink     | /signup                                 |
| Secondary       | Learn More                              |
| SecondaryLink   | /about                                  |
| Style           | gradient                                |
```

### Configuration Options
- **Title**: Main headline
- **Description**: HTML description content
- **Primary/PrimaryLink**: Primary button text and URL
- **Secondary/SecondaryLink**: Secondary button text and URL
- **Style**: `default`, `gradient`, `centered`, `banner`
- **Background**: Background image (picture element)

### Features
- Themed button system integration
- Background image support with overlay
- Multiple layout variants
- Intersection Observer animations
- Responsive button stacking
- Accessibility support

### Files
- `blocks/cta/cta.js`
- `blocks/cta/cta.css`
- `blocks/cta/_cta.json`

## Block 5: Timeline Block

**Purpose**: Display chronological events in a visually appealing timeline format.

### Usage
```
| Company Timeline|vertical|default|true |        |
| 2020            | Founded        | Started our journey | content.star |
| 2021            | First Release  | Launched product    | ui.success   |
| 2022            | Team Growth    | Expanded team       | ui.user      |
| 2023            | Global Reach   | Worldwide service   | content.location |
```

### Configuration Options
- **Orientation**: `vertical`, `horizontal`
- **Style**: `default`, `minimal`, `card`
- **Animated**: Boolean for scroll animations
- **Items**: Date, title, description, icon, link

### Features
- Vertical and horizontal layouts
- Scroll-triggered animations
- Theme-consistent icons and markers
- Connecting lines between items
- Multiple visual styles
- Responsive design with mobile adaptations

### Files
- `blocks/timeline/timeline.js`
- `blocks/timeline/timeline.css`
- `blocks/timeline/_timeline.json`

## Best Practices Implemented

### AEM EDS Standards
1. **Block Structure**: Following standard AEM EDS block patterns
2. **Configuration**: Using `_blockname.json` for block definitions
3. **Instrumentation**: Proper `moveInstrumentation` usage for Franklin tracking
4. **Image Optimization**: Using `createOptimizedPicture` for images
5. **CSS Methodology**: BEM-like naming conventions
6. **Responsive Design**: Mobile-first approach with progressive enhancement

### Theme Integration
1. **Consistent Styling**: All blocks use theme system for colors, fonts, and spacing
2. **Icon System**: Centralized icon management with Unicode fallbacks
3. **Button Components**: Reusable themed button system
4. **Animation System**: Consistent timing and easing functions
5. **Accessibility**: ARIA labels, focus management, and keyboard navigation
6. **Dark Mode**: Automatic dark mode support via media queries

### Performance Optimizations
1. **Lazy Loading**: Images optimized with Franklin's lazy loading
2. **Animation Performance**: Using `transform` and `opacity` for animations
3. **Intersection Observer**: Efficient scroll-based animations
4. **CSS Custom Properties**: Leveraging CSS variables for theming
5. **Minimal Dependencies**: Self-contained blocks with no external libraries

### Accessibility Features
1. **Semantic HTML**: Proper heading hierarchy and semantic elements
2. **ARIA Support**: Labels, roles, and states for screen readers
3. **Keyboard Navigation**: Full keyboard support for interactive elements
4. **Focus Management**: Visible focus indicators and logical tab order
5. **Reduced Motion**: Respecting `prefers-reduced-motion` setting
6. **High Contrast**: Support for `prefers-contrast` setting

## Integration Guide

### Adding Theme CSS
The theme CSS is automatically imported in `styles/styles.css`:
```css
@import 'theme.css';
```

### Theme Initialization
Theme system is initialized in `scripts/scripts.js`:
```javascript
import { initializeTheme } from './theme.js';
// Called during loadEager()
```

### Using Theme in Custom Blocks
```javascript
import { createThemedButton, getColors, createThemedIcon } from '../../scripts/theme.js';

// Create themed button
const button = createThemedButton('Click Me', {
  variant: 'primary',
  size: 'lg',
  icon: 'ui.arrow_right'
});

// Get theme colors
const colors = getColors();

// Create themed icon
const icon = createThemedIcon('content.star', {
  size: 'lg',
  className: 'my-icon'
});
```

## Browser Support

All blocks are tested and support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Features gracefully degrade in older browsers with fallbacks for:
- CSS Grid (flexbox fallback)
- CSS Custom Properties (static values)
- Intersection Observer (immediate visibility)
- Modern CSS features (simplified styling)

## Maintenance

### Adding New Icons
Edit `scripts/theme.js` and add to the appropriate category:
```javascript
icons: {
  ui: {
    newIcon: '🔥'
  }
}
```

### Extending Color Palette
Add colors to `THEME_CONFIG.colors` in `scripts/theme.js`:
```javascript
colors: {
  brand: '#ff6b35',
  brandHover: '#e55a2b'
}
```

### Creating New Themed Components
Follow the pattern established in existing blocks:
1. Import theme utilities
2. Use `createThemedIcon` and `createThemedButton`
3. Apply theme CSS classes
4. Follow responsive and accessibility patterns