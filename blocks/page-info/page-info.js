function getPageData() {
  const data = {};
  
  // Get all meta tags
  const metaTags = document.querySelectorAll('meta');
  
  metaTags.forEach(meta => {
    let key = null;
    let value = null;
    
    // Check different meta tag formats
    if (meta.getAttribute('property')) {
      key = meta.getAttribute('property');
      value = meta.getAttribute('content');
    } else if (meta.getAttribute('name')) {
      key = meta.getAttribute('name');
      value = meta.getAttribute('content');
    } else if (meta.getAttribute('itemprop')) {
      key = meta.getAttribute('itemprop');
      value = meta.getAttribute('content');
    }
    
    // Only add if both key and value exist
    if (key && value) {
      data[key] = value;
    }
  });
  
  // Add document properties
  if (document.title) {
    data['document.title'] = document.title;
  }
  
  data['page.url'] = window.location.href;
  data['page.hostname'] = window.location.hostname;
  data['page.pathname'] = window.location.pathname;
  data['document.language'] = document.documentElement.lang || 'en-US';
  data['page.referrer'] = document.referrer || 'Direct';
  data['document.lastModified'] = document.lastModified;
  data['page.protocol'] = window.location.protocol;
  
  // Add any data attributes from body or html
  const bodyDataAttrs = document.body ? document.body.dataset : {};
  Object.keys(bodyDataAttrs).forEach(key => {
    data[`body.data-${key}`] = bodyDataAttrs[key];
  });
  
  const htmlDataAttrs = document.documentElement.dataset;
  Object.keys(htmlDataAttrs).forEach(key => {
    data[`html.data-${key}`] = htmlDataAttrs[key];
  });
  
  return data;
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

function getPropertyInfo(key, value) {
  const lowerKey = key.toLowerCase();
  
  // Determine type
  let type = 'text';
  if (lowerKey.includes('url') || lowerKey.includes('href') || value.toString().startsWith('http')) {
    type = 'url';
  } else if (lowerKey.includes('date') || lowerKey.includes('time') || lowerKey === 'document.lastmodified') {
    type = 'date';
  } else if (lowerKey.includes('keyword') || lowerKey.includes('tag') || lowerKey === 'article:tag') {
    type = 'keywords';
  }
  
  // Determine icon and label
  let icon = '📄';
  let label = key;
  
  // Common property mappings
  const propertyMappings = {
    'og:title': { icon: '📝', label: 'Title' },
    'document.title': { icon: '📝', label: 'Document Title' },
    'title': { icon: '📝', label: 'Title' },
    'og:description': { icon: '📄', label: 'Description' },
    'description': { icon: '📄', label: 'Description' },
    'twitter:description': { icon: '🐦', label: 'Twitter Description' },
    'author': { icon: '👤', label: 'Author' },
    'article:author': { icon: '👤', label: 'Article Author' },
    'og:image': { icon: '🖼️', label: 'Image' },
    'twitter:image': { icon: '🐦', label: 'Twitter Image' },
    'image': { icon: '🖼️', label: 'Image' },
    'keywords': { icon: '🏷️', label: 'Keywords' },
    'article:tag': { icon: '🏷️', label: 'Tags' },
    'og:type': { icon: '📋', label: 'Content Type' },
    'og:site_name': { icon: '🌐', label: 'Site Name' },
    'og:locale': { icon: '🌍', label: 'Locale' },
    'document.language': { icon: '🌍', label: 'Language' },
    'page.url': { icon: '🔗', label: 'URL' },
    'page.hostname': { icon: '🏠', label: 'Hostname' },
    'page.pathname': { icon: '📂', label: 'Path' },
    'page.referrer': { icon: '⬅️', label: 'Referrer' },
    'page.protocol': { icon: '🔒', label: 'Protocol' },
    'document.lastmodified': { icon: '📅', label: 'Last Modified' },
    'article:published_time': { icon: '📅', label: 'Published' },
    'article:modified_time': { icon: '✏️', label: 'Modified' },
    'twitter:card': { icon: '🐦', label: 'Twitter Card' },
    'twitter:site': { icon: '🐦', label: 'Twitter Site' },
    'twitter:creator': { icon: '🐦', label: 'Twitter Creator' },
    'viewport': { icon: '📱', label: 'Viewport' },
    'theme-color': { icon: '🎨', label: 'Theme Color' },
    'robots': { icon: '🤖', label: 'Robots' },
    'canonical': { icon: '🔗', label: 'Canonical URL' }
  };
  
  // Check for data attributes
  if (lowerKey.startsWith('body.data-') || lowerKey.startsWith('html.data-')) {
    icon = '🏷️';
    label = key.replace(/^(body|html)\.data-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  if (propertyMappings[lowerKey]) {
    icon = propertyMappings[lowerKey].icon;
    label = propertyMappings[lowerKey].label;
  } else {
    // Format generic labels
    label = key.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return { icon, label, type };
}

function createInfoCard(icon, label, value, type = 'text') {
  const card = document.createElement('div');
  card.className = 'page-info-card';
  
  const iconElement = document.createElement('div');
  iconElement.className = 'page-info-icon';
  iconElement.innerHTML = icon;
  
  const content = document.createElement('div');
  content.className = 'page-info-content';
  
  const labelElement = document.createElement('div');
  labelElement.className = 'page-info-label';
  labelElement.textContent = label;
  
  const valueElement = document.createElement('div');
  valueElement.className = `page-info-value ${type}`;
  
  if (type === 'date') {
    valueElement.textContent = formatDate(value);
  } else if (type === 'url') {
    const link = document.createElement('a');
    link.href = value;
    link.textContent = value;
    link.target = '_blank';
    link.rel = 'noopener';
    valueElement.appendChild(link);
  } else if (type === 'keywords') {
    if (value) {
      const keywords = value.split(',').map(k => k.trim()).filter(k => k);
      keywords.forEach((keyword, index) => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        valueElement.appendChild(tag);
        if (index < keywords.length - 1) {
          valueElement.appendChild(document.createTextNode(' '));
        }
      });
    } else {
      valueElement.textContent = 'No keywords';
    }
  } else {
    valueElement.textContent = value || 'Not specified';
  }
  
  content.appendChild(labelElement);
  content.appendChild(valueElement);
  
  card.appendChild(iconElement);
  card.appendChild(content);
  
  return card;
}

function createHeaderSection(data) {
  const header = document.createElement('div');
  header.className = 'page-info-header';
  
  // Check for various image properties
  const imageUrl = data['og:image'] || data['image'] || data['twitter:image'] || null;
  
  if (imageUrl) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'page-info-image';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = data['document.title'] || data['og:title'] || 'Page Image';
    img.loading = 'lazy';
    
    imageContainer.appendChild(img);
    header.appendChild(imageContainer);
  }
  
  const textContent = document.createElement('div');
  textContent.className = 'page-info-header-text';
  
  const title = document.createElement('h2');
  title.className = 'page-info-title';
  title.textContent = data['document.title'] || data['og:title'] || data['title'] || 'Untitled Page';
  
  const description = document.createElement('p');
  description.className = 'page-info-description';
  description.textContent = data['description'] || data['og:description'] || data['twitter:description'] || 'No description available';
  
  const meta = document.createElement('div');
  meta.className = 'page-info-meta';
  
  // Display key meta properties if available
  const metaItems = [];
  if (data['og:type']) metaItems.push(`<span class="page-type">${data['og:type']}</span>`);
  if (data['og:site_name'] || data['page.hostname']) metaItems.push(`<span class="page-site">${data['og:site_name'] || data['page.hostname']}</span>`);
  if (data['og:locale'] || data['document.language']) metaItems.push(`<span class="page-locale">${data['og:locale'] || data['document.language']}</span>`);
  
  meta.innerHTML = metaItems.join('');
  
  textContent.appendChild(title);
  textContent.appendChild(description);
  if (metaItems.length > 0) {
    textContent.appendChild(meta);
  }
  
  header.appendChild(textContent);
  
  return header;
}

export default function decorate(block) {
  // Get page properties
  const pageData = getPageData();
  
  // Clear block
  block.innerHTML = '';
  
  // Create container
  const container = document.createElement('div');
  container.className = 'page-info-container';
  
  // Create header section
  const header = createHeaderSection(pageData);
  container.appendChild(header);
  
  // Create properties grid
  const grid = document.createElement('div');
  grid.className = 'page-info-grid';
  
  // Create property cards for all found data
  Object.entries(pageData).forEach(([key, value]) => {
    if (value && value.toString().trim()) {
      const { icon, label, type } = getPropertyInfo(key, value);
      const card = createInfoCard(icon, label, value, type);
      grid.appendChild(card);
    }
  });
  
  container.appendChild(grid);
  
  // Add refresh button
  const actions = document.createElement('div');
  actions.className = 'page-info-actions';
  
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'page-info-refresh';
  refreshBtn.innerHTML = '🔄 Refresh Page Info';
  refreshBtn.addEventListener('click', () => {
    decorate(block); // Re-run the decoration
  });
  
  actions.appendChild(refreshBtn);
  container.appendChild(actions);
  
  block.appendChild(container);
  
  // Add animation
  setTimeout(() => {
    container.classList.add('animate-in');
    
    // Stagger card animations
    const cards = container.querySelectorAll('.page-info-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 100);
    });
  }, 100);
}