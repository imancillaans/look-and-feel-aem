export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'list-items';
  
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = row.innerHTML;
    ul.appendChild(li);
  });
  
  block.textContent = '';
  block.appendChild(ul);
}