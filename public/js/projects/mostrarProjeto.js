import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Config do Firebase
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
try {
    app = getApp();
} catch {
    app = initializeApp(firebaseConfig);
}

const db = getDatabase(app);

const container = document.querySelector("#card-zone");
const modal = document.getElementById("modal");

function criarCardProjeto(id, { titulo, descricao, dataCriacao, capaUrl, userId }) {
    console.log("Criando card para projeto:", id, titulo);
    const card = document.createElement("div");
    card.className = "card_projeto";
    card.dataset.projetoId = id;

    card.innerHTML = `
    <div class="capa">
      <figure>
        <img src="${capaUrl}" alt="thumbnail" class="thumbnail">
      </figure>
      <div class="thumbnail-overlay">
        <div class="project-overlay-content">
          <div class="like">
            <svg width="25" height="25" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731L10.2366 18.4731Z"
                fill="none" stroke="black" />
            </svg>
          </div>
          <div class="project-title">
            <h1>${titulo}</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="autor">
      <img class='autor-img' src="" alt="Profile pic">
      <h2 class="username">User</h2>
    </div>
  `;

    if (userId) {
        const autorRef = ref(db, `Freelancer/${userId}`);
        get(autorRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const autor = snapshot.val();
                    card.querySelector('.autor-img').src = autor.foto_perfil;
                    card.querySelector('.username').textContent = autor.nome;
                }
            });
    }

    card.addEventListener("click", () => {
        // Busca o projeto completo para pegar as tags
        const dbRef = ref(db);
        get(child(dbRef, `Projetos/${id}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const projeto = snapshot.val();
                    abrirModalProjeto(
                        id,
                        projeto.titulo,
                        projeto.descricao,
                        projeto.dataCriacao,
                        projeto.userId,
                        projeto.tags || []  // passa as tags aqui
                    );
                } else {
                    console.warn("Projeto não encontrado:", id);
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar projeto:", error);
            });
    });

    container.appendChild(card);
}

window.idProjetoAtual = null
function abrirModalProjeto(idProjeto, titulo, descricao, dataCriacao, userId, tags = []) {
    const modal = document.getElementById("modal");
    const containerComponentes = document.getElementById('modal-componentes');
    const modalTitulo = modal.querySelector(".modal-titulo h1");
    const modalCreator = modal.querySelector('.modal-creator p');
    const modalUserPhoto = document.getElementById('modalUserPhoto');
    const modalAutor = document.getElementById('modalAutor');
    const modalTag = document.getElementById('modalTag');
    const txtTituloTag = document.getElementById('txtTituloTag');

    const btnVerperfil = document.getElementById('btnVerPerfil');

    modalTitulo.textContent = titulo || 'Sem título';
    txtTituloTag.textContent = titulo;


    modal.style.display = 'flex';

    const dataCriado = modal.querySelector('#data-criado');
    if (dataCriado && dataCriacao) {
        const data = new Date(dataCriacao);
        if (!isNaN(data)) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dataFormatada = data.toLocaleDateString('pt-BR', options);
            dataCriado.textContent = `Criado em ${dataFormatada}`;
        } else {
            dataCriado.textContent = 'Data inválida';
        }
    } else if (dataCriado) {
        dataCriado.textContent = 'teste adsdadadad';
    }


    containerComponentes.innerHTML = '';

    function renderTags(tagsArray) {
        const tagsContainer = modal.querySelector('.tags-container');
        if (!tagsContainer) return;
        tagsContainer.innerHTML = '';

        tagsArray.forEach(tag => {
            const span = document.createElement('span');
            span.classList.add('tag-span');
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }

    renderTags(tags);

    const dbRef = ref(db);

    get(child(dbRef, `componentesProjeto/${idProjeto}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const componentes = snapshot.val();
                Object.values(componentes).forEach(comp => {
                    const compDiv = document.createElement('div');
                    compDiv.classList.add('componente-item');

                    if (comp.tipo === 'imagem') {
                        const img = document.createElement('img');
                        img.src = comp.conteudo || '';
                        img.alt = 'Imagem do projeto';
                        img.style.width = '100%';
                        img.style.maxWidth = '100%';
                        compDiv.appendChild(img);
                    } else if (comp.tipo === 'texto') {
                        const p = document.createElement('p');
                        p.innerHTML = comp.conteudo || '';
                        compDiv.appendChild(p);
                    } else {
                        compDiv.textContent = `Tipo: ${comp.tipo || 'N/A'} - Conteúdo: ${comp.conteudo || 'Sem conteúdo'}`;
                    }

                    containerComponentes.appendChild(compDiv);
                });
            } else {
                containerComponentes.textContent = 'Nenhum componente encontrado para este projeto.';
            }
        })
        .catch((error) => {
            console.error('Erro ao buscar componentes:', error);
            containerComponentes.textContent = 'Erro ao carregar componentes.';
        });

    if (userId) {
        get(child(dbRef, `Freelancer/${userId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const autor = snapshot.val();
                    const nomeAutor = autor.nome;
                    const userPhoto = autor.foto_perfil;
                    const tagAutor = autor.tag;

                    modalCreator.innerHTML = `Projeto criado por <a href="/perfil?id=${userId}" class="user-name-modal">${nomeAutor}</a>.`;
                    modalAutor.textContent = nomeAutor;
                    modalUserPhoto.src = userPhoto;
                    modalTag.textContent = tagAutor;

                    btnVerperfil.addEventListener('click', () => {
                        window.location.href = `/perfil?id=${userId}`;
                    });
                }
            });
    }
    window.idProjetoAtual = idProjeto;

    document.dispatchEvent(new CustomEvent("modalProjetoAberto", {
        detail: { idProjeto }
    }));
}

function carregarProjetos(tagFiltro = "tudo") {
    const dbRef = ref(db);
    container.innerHTML = "";

    get(child(dbRef, `Projetos`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const projetos = snapshot.val();
                Object.entries(projetos).forEach(([id, dados]) => {
                    const tagsProjeto = dados.tags || [];
                    const incluir = tagFiltro === "tudo" || (Array.isArray(tagsProjeto) && tagsProjeto.some(t => t.toLowerCase() === tagFiltro.toLowerCase()));

                    if (incluir) {
                        criarCardProjeto(id, dados);
                    }
                });
            } else {
                console.log("Nenhum projeto encontrado no banco.");
            }
        })
        .catch((error) => {
            console.error("Erro ao carregar projetos:", error);
        });
}
carregarProjetos();

document.querySelectorAll(".button_categoria").forEach(tagEl => {
    tagEl.addEventListener("click", () => {
        document.querySelectorAll(".button_categoria").forEach(el => el.classList.remove("active"));
        tagEl.classList.add("active");

        const tagSelecionada = tagEl.textContent.trim().toLowerCase();
        carregarProjetos(tagSelecionada);

    });
});


