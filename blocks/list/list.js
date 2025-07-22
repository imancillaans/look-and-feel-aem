function createListHeader(title) {
  if (!title || title.trim() === '') return null;
  
  const header = document.createElement('div');
  header.className = 'list-header';
  
  const titleElement = document.createElement('h3');
  titleElement.className = 'list-title';
  titleElement.textContent = title;
  
  const counter = document.createElement('span');
  counter.className = 'list-counter';
  counter.textContent = '0 / 0';
  
  header.appendChild(titleElement);
  header.appendChild(counter);
  
  return header;
}

function createListItem(content, index) {
  const li = document.createElement('li');
  li.className = 'list-item';
  li.setAttribute('data-index', index);
  
  const bullet = document.createElement('span');
  bullet.className = 'list-bullet';
  bullet.textContent = '•';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'list-content';
  contentDiv.textContent = content;
  
  const checkbox = document.createElement('button');
  checkbox.className = 'list-checkbox';
  checkbox.setAttribute('aria-label', 'Mark as complete');
  checkbox.innerHTML = '✓';
  
  li.appendChild(bullet);
  li.appendChild(contentDiv);
  li.appendChild(checkbox);
  
  // Add click handlers
  checkbox.addEventListener('click', (e) => {
    e.preventDefault();
    li.classList.toggle('completed');
    updateCounter();
  });
  
  return li;
}

function updateCounter() {
  const counter = document.querySelector('.list-counter');
  if (!counter) return;
  
  const totalItems = document.querySelectorAll('.list-item').length;
  const completedItems = document.querySelectorAll('.list-item.completed').length;
  
  counter.textContent = `${completedItems} / ${totalItems}`;
  
  // Update progress bar if exists
  const progressBar = document.querySelector('.list-progress-bar');
  if (progressBar && totalItems > 0) {
    const percentage = (completedItems / totalItems) * 100;
    progressBar.style.width = `${percentage}%`;
  }
}

function createProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'list-progress-container';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'list-progress-bar';
  
  progressContainer.appendChild(progressBar);
  return progressContainer;
}

export default function decorate(block) {
  // Simplified approach - just take all content as list items
  const rows = [...block.children];
  const items = [];
  let title = 'My List';
  
  // Extract content from each row
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const content = cell.textContent.trim();
      if (content) {
        items.push(content);
      }
    });
  });
  
  // If first item looks like a title (short), use it as title
  if (items.length > 0 && items[0].length < 50) {
    title = items.shift();
  }
  
  // Clear block
  block.innerHTML = '';
  
  // Create simple structure first
  const container = document.createElement('div');
  container.className = 'list-container';
  
  // Add header
  const header = createListHeader(title);
  if (header) {
    container.appendChild(header);
    container.appendChild(createProgressBar());
  }
  
  // Create list
  const ul = document.createElement('ul');
  ul.className = 'list-items';
  
  // Add items or default content
  if (items.length === 0) {
    items.push('Sample item 1', 'Sample item 2', 'Sample item 3');
  }
  
  items.forEach((item, index) => {
    const listItem = createListItem(item, index);
    ul.appendChild(listItem);
  });
  
  container.appendChild(ul);
  block.appendChild(container);
  
  // Make visible immediately
  container.classList.add('animate-in');
  setTimeout(() => {
    const listItems = container.querySelectorAll('.list-item');
    listItems.forEach((item) => {
      item.classList.add('fade-in');
    });
    updateCounter();
  }, 100);
}