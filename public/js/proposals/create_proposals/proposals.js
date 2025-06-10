import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {

  const firebaseConfig = {
    apiKey: "AIzaSyAAtfGyZc3SLzdK10zdq-ALyTyIs1s4qwQ",
    authDomain: "workflow-da28d.firebaseapp.com",
    projectId: "workflow-da28d",
    storageBucket: "workflow-da28d.appspot.com",
    messagingSenderId: "939828605253",
    appId: "1:939828605253:web:0a286fe00f1c29ba614e2c",
    measurementId: "G-3LXB7BR5M1"
  };

  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const db = getDatabase(app);
  const auth = getAuth();

  // onAuthStateChanged deve estar aqui, depois que auth e db estão definidos
  onAuthStateChanged(auth, user => {
    if (user) {
      const uid = user.uid;
      const userRef = ref(db, `Contratante/${uid}`);

      get(userRef).then(snapshot => {
        if (snapshot.exists()) {
          const dados = snapshot.val();
          const previewAutor = document.getElementById('preview-autor');
          const previewFoto = document.getElementById('preview-foto');

          if (previewAutor) {
            previewAutor.textContent = dados.nome || "Nome do Autor";
          }

          if (previewFoto) {
            previewFoto.src = dados.foto_perfil || "https://via.placeholder.com/40";
          }
        }
      }).catch(err => {
        console.error("Erro ao buscar dados do autor:", err);
      });
    }
  });

  // Seletores do DOM e variáveis
  const selectedTagsContainer = document.querySelector('.selected-tags');
  const searchInput = document.getElementById('search-input');
  const optionsListItems = document.querySelectorAll('.options-list li');
  const clearSearchBtn = document.getElementById('clear-search');
  const publicarBtn = document.getElementById('publicar');
  const modalConfirmacao = document.getElementById('modal-confirmacao');
  const btnSim = document.getElementById('btn-sim');
  const btnNao = document.getElementById('btn-nao');

  // Funções para adicionar/remover tags
  function addTag(value) {
    if ([...selectedTagsContainer.children].some(tag => tag.dataset.value === value)) return;

    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.dataset.value = value;
    tag.innerHTML = `${value} <span class="remover" data-value="${value}">X</span>`;
    selectedTagsContainer.appendChild(tag);

    atualizarPreview();
  }

  function removeTag(value) {
    const tags = selectedTagsContainer.querySelectorAll('.tag');
    tags.forEach(tag => {
      if (tag.dataset.value === value) tag.remove();
    });

    optionsListItems.forEach(item => {
      if (item.dataset.value === value) item.classList.remove('selected');
    });

    atualizarPreview();
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
      item.style.display = label.includes(filterText) ? '' : 'none';
    });
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  });

  publicarBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const tituloInput = document.getElementById('tituloProposta');
    const descricaoInput = document.getElementById('descricao');
    const precoMinInput = document.getElementById('precoMin');
    const precoMaxInput = document.getElementById('precoMax');

    if (!tituloInput || !descricaoInput || !precoMinInput || !precoMaxInput) {
      alert('Campos do formulário não encontrados.');
      return;
    }

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const precoMin = precoMinInput.value.trim();
    const precoMax = precoMaxInput.value.trim();

    if (!titulo || !descricao || !precoMin || !precoMax) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const tagsSelecionadas = [...selectedTagsContainer.querySelectorAll('.tag')]
      .map(tag => tag.dataset.value || tag.textContent.trim());

    const user = auth.currentUser;

    if (!user) {
      alert('Você precisa estar logado.');
      return;
    }

    const uid = user.uid;
    const userRef = ref(db, `Contratante/${uid}`);

    get(userRef).then(snapshot => {
      if (!snapshot.exists()) {
        alert('Dados do contratante não encontrados.');
        return;
      }

      const dadosUsuario = snapshot.val();

      const novaProposta = {
        titulo,
        descricao,
        precoMin: parseFloat(precoMin),
        precoMax: parseFloat(precoMax),
        datacriacao: new Date().toISOString(),
        tags: tagsSelecionadas,
        autorId: uid,
        nomeAutor: dadosUsuario.nome || "Nome não informado",
        fotoAutorUrl: dadosUsuario.foto_perfil || ""
      };

      const propostasRef = ref(db, 'Propostas');
      push(propostasRef, novaProposta)
        .then(() => {
          alert('Publicado!');
          publicarBtn.style.backgroundColor = 'white';
          publicarBtn.style.color = 'black';
          publicarBtn.textContent = 'Publicado!';
          if (modalConfirmacao) modalConfirmacao.classList.remove('hidden');
        })
        .catch((error) => {
          console.error("Erro ao salvar proposta:", error);
          alert('Erro ao publicar proposta.');
        });
    }).catch((error) => {
      console.error("Erro ao buscar contratante:", error);
      alert('Erro ao buscar dados do autor.');
    });
  });

  if (btnSim) {
    btnSim.addEventListener('click', () => location.reload());
  }

  if (btnNao) {
    btnNao.addEventListener('click', () => {
      if (modalConfirmacao) modalConfirmacao.classList.add('hidden');
      document.querySelectorAll('input, textarea, button').forEach(el => {
        if (!['btn-sim', 'btn-nao', 'Cancelar'].includes(el.id)) el.disabled = true;
      });
      selectedTagsContainer.classList.add('locked');
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
        btnVoltar.addEventListener('click', () => location.reload());
      }

      btnVoltar.style.display = 'block';
    });
  }

  function atualizarPreview() {
    const tituloInput = document.getElementById('tituloProposta');
    const descricaoInput = document.getElementById('descricao');
    const precoMinInput = document.getElementById('precoMin');
    const precoMaxInput = document.getElementById('precoMax');
    const previewTitulo = document.getElementById('preview-titulo');
    const previewDescricao = document.getElementById('preview-descricao');
    const previewPreco = document.getElementById('preview-preco');
    const previewData = document.getElementById('preview-data');
    const previewTags = document.getElementById('preview-tags');

    if (!tituloInput || !descricaoInput || !precoMinInput || !precoMaxInput || !previewTitulo || !previewDescricao || !previewPreco || !previewData || !previewTags) {
      return;
    }

    const titulo = tituloInput.value;
    const descricao = descricaoInput.value;
    const precoMin = parseFloat(precoMinInput.value) || 0;
    const precoMax = parseFloat(precoMaxInput.value) || 0;

    previewTitulo.textContent = titulo || 'Título da proposta';
    previewDescricao.textContent = descricao || 'A descrição da proposta aparecerá aqui.';
    previewPreco.textContent = `R$${precoMin} - R$${precoMax}`;

    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    previewData.textContent = `Criado em ${dataAtual}`;

    const tags = [...selectedTagsContainer.querySelectorAll('.tag')]
      .map(tag => tag.dataset.value || tag.textContent.trim());

    previewTags.innerHTML = tags.length
      ? tags.map(tag => `<span class="tag">${tag}</span>`).join('')
      : '<span class="tag">Nenhuma tag</span>';
  }

  ['tituloProposta', 'descricao', 'precoMin', 'precoMax'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', atualizarPreview);
  });

  if (selectedTagsContainer) {
    selectedTagsContainer.addEventListener('DOMSubtreeModified', atualizarPreview);
  }

});
