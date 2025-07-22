export default function decorate(block) {
  // Get page title from various sources
  const pageTitle = document.title || 
                   document.querySelector('meta[property="og:title"]')?.content ||
                   document.querySelector('meta[name="title"]')?.content ||
                   'Untitled Page';
  
  // Clear block
  block.innerHTML = '';
  
  // Create title element
  const titleElement = document.createElement('h1');
  titleElement.className = 'page-title-display';
  titleElement.textContent = pageTitle;
  
  // Add to block
  block.appendChild(titleElement);
}