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

function criarCardProjeto(id, { titulo, descricao, datacriacao, capaUrl, userId }) {
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

    if(userId){
        const autorRef = ref(db, `Freelancer/${userId}`)
        get(autorRef)
        .then((snapshot) => {
            if(snapshot.exists()){
                const autor = snapshot.val()

                const nome = autor.nome
                const foto = autor.foto_perfil

                const imgCard = card.querySelector('.autor-img')
                const nomeCard = card.querySelector('.username')

                imgCard.src = foto
                nomeCard.textContent = nome
            }
        })
    }
    card.addEventListener("click", () => abrirModalProjeto(id, titulo, descricao, datacriacao, userId));
    container.appendChild(card);
}

function abrirModalProjeto(idProjeto, titulo, descricao, dataCriacao, userId) {

    const modal = document.getElementById("modal");
    const containerComponentes = document.getElementById('modal-componentes');
    const modalTitulo = modal.querySelector(".modal-titulo h1");
    const modalDescricao = modal.querySelector(".modal-description.center");
    const modalCreator = modal.querySelector('.modal-creator p')

    const modalUserPhoto = document.getElementById('modalUserPhoto')
    const modalAutor = document.getElementById('modalAutor')
    const modalTag = document.getElementById('modalTag')

    const btnVerperfil = document.getElementById('btnVerPerfil')
    // Atualiza conteúdo do modal
    modalTitulo.textContent = titulo || 'Sem título';

    // Limpa container dos componentes
    containerComponentes.innerHTML = '';

    // Mostra modal
    modal.style.display = 'flex';

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
                        img.style.width = '100%'
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
    if(userId){
        get(child(dbRef, `Freelancer/${userId}`))
        .then((snapshot) => {
            if(snapshot.exists()){
                const autor = snapshot.val()
                const nomeAutor = autor.nome
                const userPhoto = autor.foto_perfil
                const tagAutor = autor.tag

                modalCreator.innerHTML = `Projeto criado por <a href="/perfil?id=${userId}" class="user-name-modal">${nomeAutor}</a>.`
                modalAutor.textContent = nomeAutor
                btnVerperfil.addEventListener('click', () => {
                    window.location.href = `/perfil?id=${userId}`
                })
                modalUserPhoto.src = userPhoto
                modalTag.textContent = tagAutor
                
            }
        })
    }
    
}


function carregarProjetos() {
    const dbRef = ref(db);
    get(child(dbRef, `Projetos`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const projetos = snapshot.val();
                console.log("Projetos carregados:", projetos);
                Object.entries(projetos).forEach(([id, dados]) => {
                    criarCardProjeto(id, dados);
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


