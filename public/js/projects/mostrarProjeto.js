import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { iconeCurtida } from "/js/projects/curtirProjeto.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const auth = getAuth();


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
          <div class="containerFavCurtir" style="display: flex; justify-content: space-between; width: 100%;">
                <div class="favoritar" style="padding: 5px; margin: 5px;">
                    <svg width="25" height="25" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                                            </g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M30.051 45.6071L17.851 54.7401C17.2728 55.1729 16.5856 55.4363 15.8662 55.5008C15.1468 55.5652 14.4237 55.4282 13.7778 55.1049C13.1319 54.7817 12.5887 54.2851 12.209 53.6707C11.8293 53.0563 11.6281 52.3483 11.628 51.626V15.306C11.628 13.2423 12.4477 11.2631 13.9069 9.8037C15.3661 8.34432 17.3452 7.52431 19.409 7.52405H45.35C47.4137 7.52431 49.3929 8.34432 50.8521 9.8037C52.3112 11.2631 53.131 13.2423 53.131 15.306V51.625C53.1309 52.3473 52.9297 53.0553 52.55 53.6697C52.1703 54.2841 51.6271 54.7807 50.9812 55.1039C50.3353 55.4272 49.6122 55.5642 48.8928 55.4998C48.1734 55.4353 47.4862 55.1719 46.908 54.739L34.715 45.6071C34.0419 45.1031 33.2238 44.8308 32.383 44.8308C31.5422 44.8308 30.724 45.1031 30.051 45.6071V45.6071Z"
                                                    stroke="#426AB2" stroke-width="4" stroke-linecap="round"
                                                    stroke-linejoin="round"></path>
                                            </g>
                                        </svg>
                                    </div>
                                    <div class="like">
                                        <svg width="25" height="25" viewBox="-2 -2 28 28"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731L10.2366 18.4731Z"
                                                fill="none" stroke="#5274D9" />
                                        </svg>
                                </div>
                            </div>                     
          <div class="project-title" style="position: absolute; left: 0;">
            <h1>${titulo}</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="project-right" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">

  <div class="autor" style="display: flex; align-items: center; gap: 10px;">
    <img class='autor-img' src="https://via.placeholder.com/32" alt="Profile pic" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
    <h2 class="username" title="@Christopher" style="
      margin: 0;
      font-size: 14px;
      color: white;
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    ">
      @Christopher
    </h2>
  </div>

  <div class="project-stats" style="display: flex; gap: 10px; font-size: 14px; color: #fff;">
    <div class="likes" style="display: flex; align-items: center; gap: 3px;">
      <svg width="14" height="14" viewBox="-2 -2 28 28"
            xmlns="http://www.w3.org/2000/svg" >
                <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731L10.2366 18.4731Z"
                                fill="#5274D9" stroke="#5274D9" />
                </svg>
 <span >124</span>
    </div>
    <div class="views" style="display: flex; align-items: center; gap: 3px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="size-6">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="#5274D9" stroke="#5274D9"/>
         <path fill="#5274D9" stroke="#5274D9" fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
    </svg>

       <span>980</span>
    </div>
    <div class="comments" style="display: flex; align-items: center; gap: 3px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill="#5274D9" stroke="#5274D9" fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
        </svg>

       <span>16</span>
    </div>
  </div>

</div>


</div>

    
  `;
    const svgCurtida = card.querySelector('.like svg')
    svgCurtida.addEventListener('click', (event) => {
        event.stopPropagation()
        iconeCurtida(id, svgCurtida)
    })
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid
            const curtidaRef = ref(db, `Curtidas/${id}/${userId}`)

            get(curtidaRef).then((snapshot) => {
                if (snapshot.exists()) {
                    svgCurtida.classList.add('curtido')
                }
                else {
                    svgCurtida.classList.remove('curtido')
                }
            }).catch(err => console.error('Erro ao verificar curtida'))
        }
    })

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

                    const gridProjetos = modal.querySelector('.grid-projetos')
                    if (gridProjetos) {
                        gridProjetos.innerHTML = ''

                        get(child(dbRef, 'Projetos')).then((snapshot) => {
                            if (snapshot.exists()) {
                                const projetos = snapshot.val()

                                Object.entries(projetos).forEach(([id, projeto]) => {
                                    if (projeto.userId === userId && id !== idProjeto) {
                                        const card = criarCardProjetoMiniatura({
                                            ...projeto,
                                            id
                                        })
                                        gridProjetos.appendChild(card)
                                    }
                                })
                            }
                        }).catch((error) => {
                            console.error('Erro ao buscar projeto autor')
                        })
                    }

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

function criarCardProjetoMiniatura(projeto) {
    const card = document.createElement('div')
    card.classList.add('card-projeto')

    card.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    card.style.cursor = 'pointer';
    card.style.position = 'relative';
    card.style.borderRadius = '5px'

    const capa = document.createElement('img')
    capa.style.width = '100%';
    capa.style.height = '100%';
    capa.style.objectFit = 'cover';
    capa.style.display = 'block';
    capa.style.borderRadius = '5px'


    capa.src = projeto.capaUrl || ''
    capa.alt = 'Capa Outros Projetos do Autor'
    card.appendChild(capa)

    card.addEventListener('click', () => {
        abrirModalProjeto(projeto.id, projeto.titulo, projeto.descricao, projeto.dataCriacao, projeto.userId, projeto.tags)
    })

    return card
}
function carregarProjetos(tagFiltro = "tudo") {
    const dbRef = ref(db);
    container.innerHTML = ''
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


