
  const selectedTagsContainer = document.querySelector('.selected-tags');
  const searchInput = document.getElementById('search-input');
  const optionsListItems = document.querySelectorAll('.options-list li');
  const clearSearchBtn = document.getElementById('clear-search');

  function addTag(value) {
    if ([...selectedTagsContainer.children].some(tag => tag.dataset.value === value)) return;

    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.dataset.value = value;
    tag.innerHTML = `
      ${value}
      <span class="remover" data-value="${value}">X</span>
    `;
    selectedTagsContainer.appendChild(tag);
  }

  function removeTag(value) {
    const tags = selectedTagsContainer.querySelectorAll('.tag');
    tags.forEach(tag => {
      if (tag.dataset.value === value) tag.remove();
    });

    optionsListItems.forEach(item => {
      if (item.dataset.value === value) item.classList.remove('selected');
    });
  }

  selectedTagsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remover')) {
      const value = e.target.dataset.value;
      removeTag(value);
    }
  });

  optionsListItems.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.dataset.value;
      if (item.classList.contains('selected')) {
        removeTag(value);
      } else {
        addTag(value);
        item.classList.add('selected');
      }
    });
  });

  
  searchInput.addEventListener('input', () => {
    const filterText = searchInput.value.toLowerCase();
    optionsListItems.forEach((item) => {
      const label = item.textContent.toLowerCase();
      if (label.includes(filterText)) {
        item.style.removeProperty('display');
      } else {
        item.style.display = 'none'; 
      }
    });
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  });