function getPageProperty(property) {
  // Try different meta tag formats
  const selectors = [
    `meta[property="${property}"]`,
    `meta[name="${property}"]`,
    `meta[itemprop="${property}"]`
  ];
  
  for (const selector of selectors) {
    const meta = document.querySelector(selector);
    if (meta) return meta.getAttribute('content');
  }
  
  return null;
}

function getPageData() {
  const data = {
    title: document.title || getPageProperty('og:title') || getPageProperty('title') || 'Untitled Page',
    description: getPageProperty('description') || getPageProperty('og:description') || 'No description available',
    author: getPageProperty('author') || getPageProperty('article:author') || 'Unknown Author',
    publishDate: getPageProperty('article:published_time') || getPageProperty('datePublished') || new Date().toISOString(),
    modifiedDate: getPageProperty('article:modified_time') || getPageProperty('dateModified') || new Date().toISOString(),
    keywords: getPageProperty('keywords') || getPageProperty('article:tag') || '',
    url: window.location.href,
    type: getPageProperty('og:type') || 'webpage',
    siteName: getPageProperty('og:site_name') || getPageProperty('application-name') || document.domain,
    locale: getPageProperty('og:locale') || document.documentElement.lang || 'en-US',
    image: getPageProperty('og:image') || getPageProperty('image') || null
  };
  
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
  
  if (data.image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'page-info-image';
    
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.title;
    img.loading = 'lazy';
    
    imageContainer.appendChild(img);
    header.appendChild(imageContainer);
  }
  
  const textContent = document.createElement('div');
  textContent.className = 'page-info-header-text';
  
  const title = document.createElement('h2');
  title.className = 'page-info-title';
  title.textContent = data.title;
  
  const description = document.createElement('p');
  description.className = 'page-info-description';
  description.textContent = data.description;
  
  const meta = document.createElement('div');
  meta.className = 'page-info-meta';
  meta.innerHTML = `
    <span class="page-type">${data.type}</span>
    <span class="page-site">${data.siteName}</span>
    <span class="page-locale">${data.locale}</span>
  `;
  
  textContent.appendChild(title);
  textContent.appendChild(description);
  textContent.appendChild(meta);
  
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
  
  // Define property cards
  const properties = [
    { icon: '👤', label: 'Author', value: pageData.author, type: 'text' },
    { icon: '📅', label: 'Published', value: pageData.publishDate, type: 'date' },
    { icon: '✏️', label: 'Modified', value: pageData.modifiedDate, type: 'date' },
    { icon: '🔗', label: 'URL', value: pageData.url, type: 'url' },
    { icon: '🏷️', label: 'Keywords', value: pageData.keywords, type: 'keywords' },
  ];
  
  properties.forEach(prop => {
    const card = createInfoCard(prop.icon, prop.label, prop.value, prop.type);
    grid.appendChild(card);
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