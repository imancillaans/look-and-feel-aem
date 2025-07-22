function createListHeader(title) {
  if (!title || title.trim() === '') return null;
  
  const header = document.createElement('div');
  header.className = 'list-header';
  
  const titleElement = document.createElement('h3');
  titleElement.className = 'list-title';
  titleElement.textContent = title;
  
  const counter = document.createElement('span');
  counter.className = 'list-counter';
  
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
  contentDiv.innerHTML = content;
  
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
  
  // Add hover effects
  li.addEventListener('mouseenter', () => {
    li.classList.add('hovered');
  });
  
  li.addEventListener('mouseleave', () => {
    li.classList.remove('hovered');
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
  const rows = [...block.children];
  let title = '';
  let items = [];
  
  // Extract title and items from rows
  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (index === 0 && cells.length > 0) {
      title = cells[0].textContent.trim();
      if (cells.length > 1) {
        items.push(cells[1].innerHTML);
      }
    } else if (cells.length > 0) {
      items.push(cells[0].innerHTML);
    }
  });
  
  // Clear block
  block.innerHTML = '';
  
  // Create list container
  const listContainer = document.createElement('div');
  listContainer.className = 'list-container';
  
  // Add header if title exists
  const header = createListHeader(title);
  if (header) {
    listContainer.appendChild(header);
    
    // Add progress bar for interactive lists
    const progressBar = createProgressBar();
    listContainer.appendChild(progressBar);
  }
  
  // Create list
  const ul = document.createElement('ul');
  ul.className = 'list-items';
  
  items.forEach((item, index) => {
    const listItem = createListItem(item, index);
    ul.appendChild(listItem);
  });
  
  listContainer.appendChild(ul);
  block.appendChild(listContainer);
  
  // Initial counter update
  updateCounter();
  
  // Add intersection observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Stagger animation for list items
        const listItems = entry.target.querySelectorAll('.list-item');
        listItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('fade-in');
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(listContainer);
}