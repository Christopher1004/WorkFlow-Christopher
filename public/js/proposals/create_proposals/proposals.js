
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

document.getElementById('publicar').addEventListener('click', function (e) {
  e.preventDefault();

  const titulo = document.getElementById('tituloProposta').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const precoMin = document.getElementById('precoMin').value.trim();
  const precoMax = document.getElementById('precoMax').value.trim();

  if (!titulo || !descricao || !precoMin || !precoMax) {
    alert('Por favor, preencha todos os campos obrigatórios antes de publicar.');
    return;
  }

  alert('Publicado!');
  const publicarBtn = document.getElementById('publicar');
  publicarBtn.style.backgroundColor = 'white';
  publicarBtn.style.color = 'black';
  publicarBtn.textContent = 'Publicado!';

  document.getElementById('modal-confirmacao').classList.remove('hidden');

  document.getElementById('btn-sim').addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('btn-nao').addEventListener('click', () => {
  const modal = document.getElementById('modal-confirmacao');
  modal.classList.add('hidden');

  document.querySelectorAll('input, textarea, button').forEach(el => {
    if (el.id !== 'btn-sim' && el.id !== 'btn-nao' && el.id !== 'Cancelar') {
      el.disabled = true;
    }
  });

  const selectedTags = document.querySelector('.selected-tags');
  if (selectedTags) {
    selectedTags.classList.add('locked'); 
  }

  optionsListItems.forEach(item => {
    item.style.pointerEvents = 'none';   
    item.style.opacity = '0.5';          
  });

  searchInput.disabled = true;
  clearSearchBtn.disabled = true;
  clearSearchBtn.style.opacity = '0.5'; 

  let btnVoltar = document.getElementById('btn-voltar');
  if (!btnVoltar) {
    btnVoltar = document.createElement('button');
    btnVoltar.id = 'btn-voltar';
    btnVoltar.textContent = 'Voltar à tela de criação';
    document.body.appendChild(btnVoltar);

    btnVoltar.addEventListener('click', () => {
      location.reload();
    });
  }

  btnVoltar.style.display = 'block';
});

});


