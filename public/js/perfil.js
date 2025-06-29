import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, update, get, child, push, set, remove, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

async function obterDadosUsuario(userId) {
    let userData = null;
    let userType = null;

    const freelancerSnap = await get(ref(db, `Freelancer/${userId}`));
    if (freelancerSnap.exists()) {
        userData = freelancerSnap.val();
        userType = 'Freelancer';
    } else {
        const contratanteSnap = await get(ref(db, `Contratante/${userId}`));
        if (contratanteSnap.exists()) {
            userData = contratanteSnap.val();
            userType = 'Contratante';
        }
    }
    return { data: userData, type: userType };
}

async function incrementarVisualizacaoUnica(projetoId) {
    if (!auth.currentUser) {
        return;
    }

    const userId = auth.currentUser.uid;
    const visualizacaoUnicaRef = ref(db, `VisualizacoesUnicas/${projetoId}/${userId}`);
    const visualizacoesTotaisRef = ref(db, `Projetos/${projetoId}/visualizacoes`);

    try {
        const uniqueViewSnap = await get(visualizacaoUnicaRef);

        if (!uniqueViewSnap.exists()) {
            await set(visualizacaoUnicaRef, true);

            await runTransaction(visualizacoesTotaisRef, (currentVisualizacoes) => {
                const newVisualizacoes = (currentVisualizacoes || 0) + 1;
                return newVisualizacoes;
            });
        }
    } catch (error) {
        console.error("Erro ao registrar ou incrementar visualização única:", error);
    }
}


function criarCardProjeto(id, projeto, aba = 'projetos', currentUserId = null, isProjectLikedByViewer = false, autorNome = 'Desconhecido', autorFotoUrl = 'https://via.placeholder.com/50', visualizacoes = 0, curtidas = 0, comentarios = 0) {
    const card = document.createElement('div');
    card.className = 'card_projeto';
    card.dataset.projetoId = id;
    card.style.display = 'none';
    const isAutorDoPerfil = auth.currentUser && projeto.userId === auth.currentUser.uid;
    const autorDisplayTexto = isAutorDoPerfil ? 'Criado por você' : autorNome;
    const autorDisplayFoto = autorFotoUrl;
    const mostrarEdit = projeto.userId === perfilUserId && auth.currentUser && auth.currentUser.uid === perfilUserId && aba === 'projetos';
    let isLikedForDisplay = isProjectLikedByViewer;

    if (aba === 'curtidos' && perfilUserId === currentUserId) {
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
                                        d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731L10.2366 18.4731Z"
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
                            <div class="delete" title="Excluir" style="cursor:pointer;" data-projeto-id="${id}">
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 0 0 1 1 1v2"></path>
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
        <a href="/perfil?id=${projeto.userId}" class="autor-link" style="text-decoration: none; color: inherit;">
            <div class="autor" style="display: flex; align-items: center; gap: 10px; padding: 10px;">
                <img src="${autorDisplayFoto}" alt="Foto do Autor" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">
                <h2 class="username">${autorDisplayTexto}</h2>
            </div>
        </a>
        <div class="project-stats" style="display: flex; gap: 10px; font-size: 14px; color: #fff; justify-content: flex-end; padding-right: 10px; padding-bottom: 10px;">
            <div class="likes" style="display: flex; align-items: center; gap: 3px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#5274D9" stroke="#5274D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="like-count">${curtidas}</span>
            </div>
            <div class="views" style="display: flex; align-items: center; gap: 3px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="size-6">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="#5274D9" stroke="#5274D9"/>
                    <path fill="#5274D9" stroke="#5274D9" fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
                </svg>
                <span class="view-count">${visualizacoes}</span>
            </div>
            <div class="comments" style="display: flex; align-items: center; gap: 3px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill="#5274D9" stroke="#5274D9" fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
                </svg>
                <span class="comment-count">${comentarios}</span>
            </div>
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
            <div class="card-projeto" data-projeto-id="${id}" style="cursor: pointer;">
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

async function deletarProjeto(projectId) {
    if (!auth.currentUser || auth.currentUser.uid !== perfilUserId) {
        alert('Você não tem permissão para deletar este projeto.');
        return;
    }

    const confirmacao = confirm('Tem certeza que deseja excluir este projeto? Esta ação é irreversível.');

    if (confirmacao) {
        try {
            await remove(ref(db, `Projetos/${projectId}`));
            await remove(ref(db, `componentesProjeto/${projectId}`));
            await remove(ref(db, `Curtidas/${projectId}`));
            await remove(ref(db, `Comentarios/${projectId}`));
            await remove(ref(db, `VisualizacoesUnicas/${projectId}`));

            const cardParaRemover = document.querySelector(`.card_projeto[data-projeto-id="${projectId}"]`);
            if (cardParaRemover) {
                cardParaRemover.remove();
            }

            abas.projetos = abas.projetos.filter(card => card.dataset.projetoId !== projectId);

            mostrarCards('projetos');

            alert('Projeto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar o projeto:', error);
            alert('Ocorreu um erro ao excluir o projeto. Por favor, tente novamente.');
        }
    }
}

async function abrirModalProjeto(projetoId) {
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

        modalBody.querySelectorAll('.outros-projetos .card-projeto').forEach(otherProjectCard => {
            otherProjectCard.addEventListener('click', async (e) => {
                const otherProjectId = e.currentTarget.dataset.projetoId;
                if (otherProjectId) {
                    await abrirModalProjeto(otherProjectId);
                }
            });
        });

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
                    atualizarContadoresNoCard(projetoId);
                } else {
                    alert('Por favor, escreva um comentário e esteja logado para comentar.');
                }
            });
        }
        
        await incrementarVisualizacaoUnica(projetoId);
        atualizarContadoresNoCard(projetoId);

    } catch (error) {
        modalBody.innerHTML = `<p>Erro ao carregar o projeto: ${error.message}</p>`;
    }
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

        if (isCurrentlyLiked) {
            await set(curtidasRef, null);
            likeButton.dataset.liked = 'false';
            likeButton.classList.remove('curtido');
            likeButton.innerHTML = `
                <svg width="25" height="25" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg" class="feather feather-heart">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731L10.2366 18.4731Z"
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
                    const autorData = (await obterDadosUsuario(projetoData.userId)).data || {};
                    const visualizacoesSnap = await get(ref(db, `Projetos/${projectId}/visualizacoes`));
                    const visualizacoes = visualizacoesSnap.exists() ? visualizacoesSnap.val() : 0;
                    const curtidasCountSnap = await get(ref(db, `Curtidas/${projectId}`));
                    const curtidas = curtidasCountSnap.exists() ? Object.keys(curtidasCountSnap.val()).length : 0;
                    const comentariosCountSnap = await get(ref(db, `Comentarios/${projectId}`));
                    const comentarios = comentariosCountSnap.exists() ? Object.keys(comentariosCountSnap.val()).length : 0;

                    criarCardProjeto(projectId, projetoData, 'curtidos', currentUserId, true, autorData.nome, autorData.foto_perfil, visualizacoes, curtidas, comentarios);
                }
            }
        }
        if (document.querySelector('.tab-button.active')?.dataset.tab === 'curtidos' && perfilUserId === userId) {
            mostrarCards('curtidos');
        }

        atualizarContadoresNoCard(projectId);

        return;
    }
    const editButton = event.target.closest('.edit');
    if (editButton) {
        const cardProjeto = editButton.closest('.card_projeto');
        const projectIdToEdit = cardProjeto ? cardProjeto.dataset.projetoId : null;
        if (projectIdToEdit) {
            window.location.href = `/criarProjeto?editId=${projectIdToEdit}`;
        }
        return;
    }
    const deleteButton = event.target.closest('.delete');
    if (deleteButton) {
        const projectIdToDelete = deleteButton.dataset.projetoId;
        if (projectIdToDelete) {
            await deletarProjeto(projectIdToDelete);
        }
        return;
    }

    const cardProjeto = event.target.closest('.card_projeto');
    if (!cardProjeto) return;

    const projetoId = cardProjeto.dataset.projetoId;
    if (!projetoId) return;

    await abrirModalProjeto(projetoId);
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

async function atualizarContadoresNoCard(projetoId) {
    const card = document.querySelector(`.card_projeto[data-projeto-id="${projetoId}"]`);

    const visualizacoesSnap = await get(ref(db, `Projetos/${projetoId}/visualizacoes`));
    const visualizacoes = visualizacoesSnap.exists() ? visualizacoesSnap.val() : 0;
    if (card) {
        card.querySelector('.view-count').textContent = visualizacoes;
    }
    if (modal.style.display === 'flex' && modal.dataset.currentProjectId === projetoId) {
        const modalViewCount = modalBody.querySelector('.view-count');
        if (modalViewCount) {
            modalViewCount.textContent = visualizacoes;
        }
    }


    const curtidasSnap = await get(ref(db, `Curtidas/${projetoId}`));
    const curtidas = curtidasSnap.exists() ? Object.keys(curtidasSnap.val()).length : 0;
    if (card) {
        card.querySelector('.like-count').textContent = curtidas;
    }
    if (modal.style.display === 'flex' && modal.dataset.currentProjectId === projetoId) {
        const modalLikeCount = modalBody.querySelector('.like-count');
        if (modalLikeCount) {
            modalLikeCount.textContent = curtidas;
        }
    }

    const comentariosSnap = await get(ref(db, `Comentarios/${projetoId}`));
    const comentarios = comentariosSnap.exists() ? Object.keys(comentariosSnap.val()).length : 0;
    if (card) {
        card.querySelector('.comment-count').textContent = comentarios;
    }
    if (modal.style.display === 'flex' && modal.dataset.currentProjectId === projetoId) {
        const modalCommentCount = modalBody.querySelector('.comment-count');
        if (modalCommentCount) {
            modalCommentCount.textContent = comentarios;
        }
    }
}

onAuthStateChanged(auth, async (user) => {
    const currentUserId = user?.uid || null;

    if (!perfilUserId) {
        containerCard.innerHTML = '<p>Nenhum perfil especificado na URL. Por favor, retorne à página inicial ou use um link válido.</p>';
        contadorProjetos.textContent = '0';
        return;
    }

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
    const comentariosGlobaisSnap = await get(ref(db, 'Comentarios'));

    const todosProjetos = projetosSnap.exists() ? projetosSnap.val() : {};
    const todasCurtidas = curtidasSnap.exists() ? curtidasSnap.val() : {};
    const todosComentarios = comentariosGlobaisSnap.exists() ? comentariosGlobaisSnap.val() : {};

    const userIdsToFetch = new Set();
    Object.values(todosProjetos).forEach(proj => userIdsToFetch.add(proj.userId));
    if (perfilUserId) userIdsToFetch.add(perfilUserId);
    if (currentUserId) userIdsToFetch.add(currentUserId);


    const usersData = {};
    for (const userId of userIdsToFetch) {
        const { data, type } = await obterDadosUsuario(userId);
        if (data) {
            usersData[userId] = {
                nome: data.nome || 'Desconhecido',
                foto_perfil: data.foto_perfil || 'https://via.placeholder.com/50',
                tipo: type
            };
        }
    }

    Object.entries(todasCurtidas).forEach(([projetoId, usuariosQueCurtiram]) => {
        if (usuariosQueCurtiram[perfilUserId]) {
            const projeto = todosProjetos[projetoId];
            if (projeto) {
                const isLikedByViewer = todasCurtidas[projetoId] && todasCurtidas[projetoId][currentUserId];
                const autorData = usersData[projeto.userId] || {};
                const visualizacoes = projeto.visualizacoes || 0;
                const curtidas = Object.keys(usuariosQueCurtiram).length;
                const comentarios = todosComentarios[projetoId] ? Object.keys(todosComentarios[projetoId]).length : 0;

                criarCardProjeto(projetoId, projeto, 'curtidos', currentUserId, isLikedByViewer, autorData.nome, autorData.foto_perfil, visualizacoes, curtidas, comentarios);
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
                    const autorData = usersData[dados.userId] || {};
                    const visualizacoes = dados.visualizacoes || 0;
                    const curtidas = todasCurtidas[id] ? Object.keys(todasCurtidas[id]).length : 0;
                    const comentarios = todosComentarios[id] ? Object.keys(todosComentarios[id]).length : 0;

                    criarCardProjeto(id, dados, 'projetos', currentUserId, isLikedByViewer, autorData.nome, autorData.foto_perfil, visualizacoes, curtidas, comentarios);
                }
            });
        }
    }

    mostrarCards('projetos');
});

window.mostrarCards = mostrarCards;
window.abrirModalProjeto = abrirModalProjeto;

document.addEventListener('DOMContentLoaded', () => {
    const modalEditar = document.getElementById('modal-editar');
    if (modalEditar) {
        modalEditar.style.display = 'none';

        if (modalEditar.classList.contains('open') || modalEditar.classList.contains('active')) {
            modalEditar.classList.remove('open', 'active');
        }
    }
});