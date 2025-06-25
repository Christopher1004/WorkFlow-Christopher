import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, update, get, child, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let firebaseApp;
try {
    firebaseApp = getApp();
} catch (e) {
    firebaseApp = initializeApp(firebaseConfig);
}

const params = new URLSearchParams(window.location.search);
const perfilUserId = params.get('id');

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const containerCard = document.querySelector('.card-zone');
const contadorProjetos = document.getElementById('quantidadeProjetos');
const tabButtons = document.querySelectorAll('.tab-button');
const textoProjetos = document.querySelector('.projetos-realizados p');

const abas = {
    projetos: [],
    curtidos: [],
    favoritos: []
};

let tipoUsuario = null;

function criarCardProjeto(id, projeto, aba = 'projetos', currentUserId = null, isProjectLikedByViewer = false) {
    const card = document.createElement('div');
    card.className = 'card_projeto';
    card.dataset.projetoId = id;
    card.style.display = 'none';

    const autorTexto = projeto.userId === perfilUserId ? 'você' : 'outra pessoa';
    const mostrarEdit = projeto.userId === perfilUserId && auth.currentUser && auth.currentUser.uid === perfilUserId && aba === 'projetos';

    let isLikedForDisplay = isProjectLikedByViewer;

    if (aba === 'curtidos' && currentUserId === perfilUserId) {
        isLikedForDisplay = true;
    }

    card.innerHTML = `
        <div class="capa">
            <figure>
                <img src="${projeto.capaUrl}" alt="" class="thumbnail">
            </figure>
            <div class="thumbnail-overlay">
                <div class="project-overlay-content">
                    <div class="icons-column">
                        <div class="like ${isLikedForDisplay ? 'curtido' : ''}" title="${isLikedForDisplay ? 'Descurtir' : 'Curtir'}" style="cursor:pointer;" data-projeto-id="${id}" data-liked="${isLikedForDisplay ? 'true' : 'false'}">
                            ${isLikedForDisplay ? `
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            ` : `
                                <svg width="25" height="25" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg" class="feather feather-heart">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731Z"
                                        fill="none" stroke="black" />
                                </svg>
                            `}
                        </div>
                        ${mostrarEdit ? `
                            <div class="edit" title="Editar" style="cursor:pointer;">
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                                </svg>
                            </div>
                            <div class="delete" title="Excluir" style="cursor:pointer;">
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 0 0 1-2-2L5 6"></path>
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                                </svg>
                            </div>
                        ` : ''}
                    </div>
                    <div class="project-title">
                        <h1>${projeto.titulo}</h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="autor">
            <h2 class="username">Criado por ${autorTexto}</h2>
        </div>
    `;

    containerCard.appendChild(card);
    abas[aba].push(card);
}


function criarCardProposta(p, aba = 'projetos') {
    const tagsHtml = Array.isArray(p.tags) ? p.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const fotoUrl = p.fotoAutorUrl || 'https://via.placeholder.com/40';
    const nomeAutor = p.nomeAutor || 'Nome não informado';
    const isDonoDoPerfil = perfilUserId === auth.currentUser?.uid;

    const card = document.createElement('div');
    card.className = 'proposta-card';
    card.style.display = 'none';

    card.innerHTML = `
        <div class="head">
            <h3>${p.titulo || 'Sem título'}</h3>
            <div class="price">R$${p.precoMin || '-'} - R$${p.precoMax || '-'}</div>
        </div>
        <p class="criadoEm">Criado em ${formatarData(p.datacriacao)}</p>
        <div class="tags">${tagsHtml}</div>
        <p class="description">${p.descricao || ''}</p>
        <div class="client-footer">
            <div class="client">
                <img class="profilePic" src="${fotoUrl}" alt="${nomeAutor}">
                <span class="client-name">${nomeAutor}</span>
            </div>
            <div class="buttons">
                ${isDonoDoPerfil
                    ? `<button class="candidatos">Candidatos</button>`
                    : `<button class="enviar">Se candidatar</button>`
                }
            </div>
        </div>
    `;

    containerCard.appendChild(card);
    abas[aba].push(card);
}

function formatarData(isoString) {
    const data = new Date(isoString);
    return isNaN(data) ? "Data inválida" : data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function mostrarCards(tipo) {
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const botaoAtivo = [...tabButtons].find(btn => btn.dataset.tab === tipo);
    if (botaoAtivo) botaoAtivo.classList.add('active');

    containerCard.classList.remove('grid-propostas');

    if (tipo === 'projetos' && tipoUsuario === 'Contratante') {
        containerCard.classList.add('grid-propostas');
    }

    containerCard.querySelectorAll('.card_projeto, .proposta-card').forEach(card => card.style.display = 'none');

    containerCard.querySelectorAll('.mensagem-aba').forEach(el => el.remove());

    const cards = abas[tipo];

    switch (tipo) {
        case 'projetos':
            textoProjetos.textContent = tipoUsuario === 'Contratante' ? 'Propostas realizadas' : 'Projetos realizados';
            break;
        case 'curtidos':
            textoProjetos.textContent = 'Projetos curtidos';
            break;
        case 'favoritos':
            textoProjetos.textContent = 'Projetos favoritados';
            break;
        default:
            textoProjetos.textContent = 'Projetos realizados';
    }

    if (!cards || cards.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'mensagem-aba';
        msg.textContent = 'Ainda não há conteúdo nesta aba.';
        containerCard.appendChild(msg);
        contadorProjetos.textContent = '0';
    } else {
        cards.forEach(card => card.style.display = 'block');
        contadorProjetos.textContent = cards.length;
    }
}


async function detectarTipoUsuario(uid) {
    if (!uid) return null;
    const freelancerSnap = await get(ref(db, `Freelancer/${uid}`));
    if (freelancerSnap.exists()) return 'Freelancer';
    const contratanteSnap = await get(ref(db, `Contratante/${uid}`));
    if (contratanteSnap.exists()) return 'Contratante';
    return null;
}

const modalHTML = `
<div id="modalProjeto" class="modal" style="display:none;">
    <div class="modal-content">
        <span id="modalClose" class="modal-close">&times;</span>
        <div id="modalBody"></div>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('modalProjeto');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function criarCabecalhoProjetoHTML(projeto, autorNome, autorId) {
    return `
        <div class="modal-header">
            <div class="modal-titulo">
                <h1>${projeto.titulo || 'Sem Título'}</h1>
            </div>
            <div class="modal-creator">
                <p>Projeto criado por <a href="/perfil?id=${autorId}" class="user-name-modal">${autorNome || 'Desconhecido'}</a>.</p>
            </div>
        </div>
    `;
}

function criarComentarioHTML(comentario) {
    return `
        <div class="containerComentarios">
            <div class="user-info">
                <img src="${comentario.foto || 'https://via.placeholder.com/50'}" alt="Usuário">
                <div class="user-details">
                    <span class="user-name">${comentario.nome || 'Anônimo'}</span>
                    <span class="message-time">${comentario.tempo || 'há pouco'}</span>
                </div>
            </div>
            <div class="message-text">${comentario.texto || ''}</div>
        </div>
    `;
}

async function obterComentariosDoProjeto(projetoId) {
    const comentariosSnap = await get(ref(db, `Comentarios/${projetoId}`));
    const comentariosData = comentariosSnap.exists() ? comentariosSnap.val() : {};

    const comentariosArray = [];
    for (const comentarioId in comentariosData) {
        const comentario = comentariosData[comentarioId];
        let userSnap;
        let userData = {};

        userSnap = await get(ref(db, `Freelancer/${comentario.userId}`));
        if (userSnap.exists()) {
            userData = userSnap.val();
        } else {
            userSnap = await get(ref(db, `Contratante/${comentario.userId}`));
            if (userSnap.exists()) {
                userData = userSnap.val();
            }
        }

        comentariosArray.push({
            nome: userData.nome || 'Anônimo',
            foto: userData.foto_perfil || 'https://via.placeholder.com/50',
            texto: comentario.texto,
            tempo: formatarTempoComentario(comentario.timestamp)
        });
    }
    return comentariosArray;
}

function formatarTempoComentario(timestamp) {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now - commentDate;
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    if (diffSeconds < 60) {
        return `há ${diffSeconds} segundos`;
    } else if (diffMinutes < 60) {
        return `há ${diffMinutes} minutos`;
    } else if (diffHours < 24) {
        return `há ${diffHours} horas`;
    } else if (diffDays < 30) {
        return `há ${diffDays} dias`;
    } else if (diffMonths < 12) {
        return `há ${diffMonths} meses`;
    } else {
        return `há ${diffYears} anos`;
    }
}


async function criarBlocoExtraProjetoHTML(projeto, autorData, comentarios) {
    const dataCriacao = new Date(projeto.dataCriacao).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const tagsHTML = (projeto.tags && Array.isArray(projeto.tags))
        ? projeto.tags.map(tag => `<span class="tag-span">${tag}</span>`).join('')
        : '';

    const comentariosHTML = comentarios.map(com => criarComentarioHTML(com)).join('');

    let outrosProjetosHTML = '';
    const autorProjetosSnap = await get(ref(db, `Projetos`));
    if (autorProjetosSnap.exists()) {
        const todosProjetos = autorProjetosSnap.val();
        const projetosDoAutor = Object.entries(todosProjetos)
            .filter(([id, proj]) => proj.userId === autorData.id && id !== projeto.id)
            .slice(0, 6);

        outrosProjetosHTML = projetosDoAutor.map(([id, proj]) => `
            <div class="card-projeto">
                <img src="${proj.capaUrl || 'https://via.placeholder.com/150'}" alt="${proj.titulo}" style="width:100%; height:100%; object-fit:cover; border-radius:3px;">
            </div>
        `).join('');
    }

    return `
        <div class="section-infos">
            <div class="titulo-container">
                <h1 id="txtTituloTag">${projeto.titulo || 'Sem Título'}</h1>
            </div>
            <div id="modalTagsContainer" class="tags-container">
                ${tagsHTML}
            </div>
            <div class="data-container">
                <p id="data-criado" class="data-criado">criado em ${dataCriacao}</p>
            </div>
        </div>

        <div class="footer-section">
            <div class="footer-left">
                <div class="input-box">
                    <input type="text" id="commentInput" placeholder="Escreva um comentário...">
                    <button id="btnEnviarComentario">Enviar</button>
                </div>
                <div class="message-card" id="comentariosProjeto" style="margin-top: 20px;">
                    ${comentariosHTML}
                </div>
            </div>

            <div class="footer-right">
                <div class="card-autor">
                    <div class="header-card-autor">
                        <div class="container-1">
                            <div class="header-card-autor-image">
                                <img src="${autorData.foto_perfil || 'https://via.placeholder.com/50'}" id="modalUserPhoto" alt="Profile pic">
                            </div>
                            <div class="header-card-autor-title">
                                <h1 id="modalAutor">${autorData.nome || 'Autor Desconhecido'}</h1>
                                <p id="modalTag">${autorData.tag || 'Não informado'}</p>
                            </div>
                        </div>
                        <div class="container-2">
                            <button class="button-container contactar" id="contactar">Contatar</button>
                            <a id="btnVerPerfil" href="/perfil?id=${autorData.id}"><button class="button-container">Ver Perfil</button></a>
                        </div>
                    </div>
                    <div class="outros-projetos">
                        <h3>Outros projetos de ${autorData.nome || 'Autor'}</h3>
                        <div class="grid-projetos">
                            ${outrosProjetosHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

containerCard.addEventListener('click', async (event) => {
    const likeButton = event.target.closest('.like');
    if (likeButton) {
        if (!auth.currentUser) {
            alert('Você precisa estar logado para curtir projetos!');
            return;
        }

        const projectId = likeButton.dataset.projetoId;
        const userId = auth.currentUser.uid;
        let isCurrentlyLiked = likeButton.dataset.liked === 'true';
        const curtidasRef = ref(db, `Curtidas/${projectId}/${userId}`);

        try {
            if (isCurrentlyLiked) {
                await set(curtidasRef, null);
                likeButton.dataset.liked = 'false';
                likeButton.classList.remove('curtido');
                likeButton.innerHTML = `
                    <svg width="25" height="25" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg" class="feather feather-heart">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731Z"
                            fill="none" stroke="black" />
                    </svg>
                `;
                likeButton.title = 'Curtir';

                const index = abas.curtidos.findIndex(card => card.dataset.projetoId === projectId);
                if (index > -1) {
                    abas.curtidos.splice(index, 1);
                }

            } else {
                await set(curtidasRef, true);
                likeButton.dataset.liked = 'true';
                likeButton.classList.add('curtido');
                likeButton.innerHTML = `
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                `;
                likeButton.title = 'Descurtir';

                const existingCardInLiked = abas.curtidos.find(card => card.dataset.projetoId === projectId);
                if (!existingCardInLiked) {
                    const projetoSnap = await get(ref(db, `Projetos/${projectId}`));
                    if (projetoSnap.exists()) {
                        const projetoData = projetoSnap.val();
                        const tempCard = document.createElement('div');
                        tempCard.dataset.projetoId = projectId;
                        abas.curtidos.push(tempCard);
                    }
                }
            }
            if (document.querySelector('.tab-button.active')?.dataset.tab === 'curtidos' && perfilUserId === userId) {
                mostrarCards('curtidos');
            }
        } catch (error) {
            alert("Ocorreu um erro ao processar sua curtida. Por favor, tente novamente.");
        }
        return;
    }

    const cardProjeto = event.target.closest('.card_projeto');
    if (!cardProjeto) return;

    const projetoId = cardProjeto.dataset.projetoId;
    if (!projetoId) return;

    modalBody.innerHTML = '<p>Carregando componentes...</p>';
    modal.style.display = 'flex';

    try {
        const projetoRef = ref(db, `Projetos/${projetoId}`);
        const projetoSnap = await get(projetoRef);

        if (!projetoSnap.exists()) {
            modalBody.innerHTML = '<p>Projeto não encontrado.</p>';
            return;
        }

        const projetoData = { id: projetoId, ...projetoSnap.val() };
        const autorId = projetoData.userId;

        let autorData = {};
        let autorTipo = await detectarTipoUsuario(autorId);

        if (autorTipo === 'Freelancer') {
            const freelancerSnap = await get(ref(db, `Freelancer/${autorId}`));
            if (freelancerSnap.exists()) {
                autorData = { id: autorId, ...freelancerSnap.val(), tag: freelancerSnap.val().tag || 'Freelancer' };
            }
        } else if (autorTipo === 'Contratante') {
            const contratanteSnap = await get(ref(db, `Contratante/${autorId}`));
            if (contratanteSnap.exists()) {
                autorData = { id: autorId, ...contratanteSnap.val(), tag: contratanteSnap.val().tag || 'Contratante' };
            }
        }

        const comentarios = await obterComentariosDoProjeto(projetoId);

        const cabecalhoHTML = criarCabecalhoProjetoHTML(projetoData, autorData.nome, autorData.id);

        const compRef = ref(db, `componentesProjeto/${projetoId}`);
        const snapshot = await get(compRef);

        let componentesHTML = '';
        if (!snapshot.exists()) {
            componentesHTML = '<p>Sem componentes para este projeto.</p>';
        } else {
            const componentes = Object.values(snapshot.val());
            componentes.sort((a, b) => a.ordem - b.ordem);

            for (const comp of componentes) {
                if (comp.tipo === 'imagem') {
                    componentesHTML += `<img src="${comp.conteudo}" alt="Imagem do projeto" class="componente-img" style="margin-bottom: 15px; border-radius: 6px;">`;
                } else if (comp.tipo === 'texto') {
                    componentesHTML += `<div style="margin-bottom: 15px; color:#ddd;">${comp.conteudo}</div>`;
                }
            }
        }

        const blocoExtraHTML = await criarBlocoExtraProjetoHTML(projetoData, autorData, comentarios);

        modalBody.innerHTML = cabecalhoHTML + componentesHTML + blocoExtraHTML;

        const btnEnviarComentario = document.getElementById('btnEnviarComentario');
        if (btnEnviarComentario) {
            btnEnviarComentario.addEventListener('click', async () => {
                const commentInput = document.getElementById('commentInput');
                const commentText = commentInput.value.trim();

                if (commentText && auth.currentUser) {
                    const newCommentRef = push(ref(db, `Comentarios/${projetoId}`));
                    await set(newCommentRef, {
                        userId: auth.currentUser.uid,
                        texto: commentText,
                        timestamp: Date.now()
                    });
                    commentInput.value = '';

                    const updatedComentarios = await obterComentariosDoProjeto(projetoId);
                    document.getElementById('comentariosProjeto').innerHTML = updatedComentarios.map(com => criarComentarioHTML(com)).join('');
                } else {
                    alert('Por favor, escreva um comentário e esteja logado para comentar.');
                }
            });
        }

    } catch (error) {
        modalBody.innerHTML = `<p>Erro ao carregar o projeto: ${error.message}</p>`;
    }
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

onAuthStateChanged(auth, async (user) => {
    if (!perfilUserId) {
        containerCard.innerHTML = '<p>Nenhum perfil especificado na URL. Por favor, retorne à página inicial ou use um link válido.</p>';
        contadorProjetos.textContent = '0';
        return;
    }

    const currentUserId = user?.uid || null;
    containerCard.innerHTML = '';
    abas.projetos = [];
    abas.curtidos = [];
    abas.favoritos = [];

    tipoUsuario = await detectarTipoUsuario(perfilUserId);
    if (!tipoUsuario) {
        containerCard.innerHTML = '<p>Tipo de usuário não encontrado para este ID.</p>';
        contadorProjetos.textContent = '0';
        return;
    }

    if (tipoUsuario === 'Contratante') {
        const labelProjetos = document.querySelector('.projetos-realizados p');
        if (labelProjetos) labelProjetos.textContent = 'Propostas realizadas';
    }

    tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'projetos') {
            const span = btn.querySelector('span');
            if (span) span.textContent = tipoUsuario === 'Contratante' ? 'Propostas' : 'Projetos';
        }
    });

    const propostasSnap = await get(ref(db, 'Propostas'));
    const projetosSnap = await get(ref(db, 'Projetos'));
    const curtidasSnap = await get(ref(db, 'Curtidas'));

    const todosProjetos = projetosSnap.exists() ? projetosSnap.val() : {};
    const todasCurtidas = curtidasSnap.exists() ? curtidasSnap.val() : {};

    Object.entries(todasCurtidas).forEach(([projetoId, usuariosQueCurtiram]) => {
        if (usuariosQueCurtiram[perfilUserId]) {
            const projeto = todosProjetos[projetoId];
            if (projeto) {
                const isLikedByViewer = todasCurtidas[projetoId] && todasCurtidas[projetoId][currentUserId];
                criarCardProjeto(projetoId, projeto, 'curtidos', currentUserId, isLikedByViewer);
            }
        }
    });

    if (tipoUsuario === 'Contratante') {
        if (propostasSnap.exists()) {
            const propostas = propostasSnap.val();
            Object.values(propostas).forEach(p => {
                if (p.autorId === perfilUserId) {
                    criarCardProposta(p);
                }
            });
        }
    } else if (tipoUsuario === 'Freelancer') {
        if (projetosSnap.exists()) {
            Object.entries(todosProjetos).forEach(([id, dados]) => {
                if (dados.userId === perfilUserId) {
                    const isLikedByViewer = todasCurtidas[id] && todasCurtidas[id][currentUserId];
                    criarCardProjeto(id, dados, 'projetos', currentUserId, isLikedByViewer);
                }
            });
        }
    }

    mostrarCards('projetos');
});

window.mostrarCards = mostrarCards;
document.addEventListener('DOMContentLoaded', () => {
    const modalEditar = document.getElementById('modal-editar');
    if (modalEditar) {
        modalEditar.style.display = 'none';

        if (modalEditar.classList.contains('open') || modalEditar.classList.contains('active')) {
            modalEditar.classList.remove('open', 'active');
        }
    }
});