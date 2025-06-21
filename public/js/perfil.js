import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, update, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const perfilUserId = params.get('id');

const auth = getAuth();
const db = getDatabase();
const containerCard = document.querySelector('.card-zone');
const contadorProjetos = document.getElementById('quantidadeProjetos');
const tabButtons = document.querySelectorAll('.tab-button');

const abas = {
    projetos: [],
    curtidos: [],
    favoritos: []
};

let tipoUsuario = null;

function criarCardProjeto(id, { titulo, descricao, capaUrl, dataCriacao, userId }, aba = 'projetos') {
    const card = document.createElement('div');
    card.className = 'card_projeto';
    card.dataset.projetoId = id;
    card.style.display = 'none';

    const autorTexto = userId === perfilUserId ? 'você' : 'outra pessoa';

    card.innerHTML = `
        <div class="capa">
            <figure>
                <img src="${capaUrl}" alt="" class="thumbnail">
            </figure>
            <div class="thumbnail-overlay">
                <div class="project-overlay-content">
                    <div class="like">
                        <svg width="25" height="25" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M10.2366 18.4731L18.35 10.3598L18.483 10.2267L18.4809 10.2246C20.6263 7.93881 20.5826 4.34605 18.35 2.11339C16.1173 -0.11928 12.5245 -0.16292 10.2387 1.98247L10.2366 1.98036L10.2366 1.98039L10.2366 1.98037L10.2345 1.98247C7.94862 -0.162927 4.35586 -0.119289 2.12319 2.11338C-0.109476 4.34605 -0.153114 7.93881 1.99228 10.2246L1.99017 10.2268L10.2365 18.4731L10.2366 18.4731Z"
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
          ${
            isDonoDoPerfil
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

    containerCard.querySelectorAll('.card_projeto, .proposta-card').forEach(card => card.style.display = 'none');
    containerCard.querySelectorAll('.mensagem-aba').forEach(el => el.remove());

    const cards = abas[tipo];
    if (!cards || cards.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'mensagem-aba';
        msg.textContent = 'Ainda não há conteúdo nesta aba.';
        containerCard.appendChild(msg);
    } else {
        cards.forEach(card => card.style.display = 'block');
    }

    contadorProjetos.textContent = cards.length;
}

async function detectarTipoUsuario(uid) {
    if (!uid) return null;
    const freelancerSnap = await get(ref(db, `Freelancer/${uid}`));
    if (freelancerSnap.exists()) return 'Freelancer';
    const contratanteSnap = await get(ref(db, `Contratante/${uid}`));
    if (contratanteSnap.exists()) return 'Contratante';
    return null;
}

onAuthStateChanged(auth, async (user) => {
    if (!perfilUserId) return;

    const currentUserId = user?.uid || null;
    containerCard.innerHTML = '';
    abas.projetos = [];
    abas.curtidos = [];
    abas.favoritos = [];

    tipoUsuario = await detectarTipoUsuario(perfilUserId);
    if (!tipoUsuario) {
        containerCard.innerHTML = '<p>Tipo de usuário não encontrado.</p>';
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

    if (tipoUsuario === 'Contratante') {
        if (propostasSnap.exists()) {
            const propostas = propostasSnap.val();
            Object.values(propostas).forEach(p => {
                if (p.autorId === perfilUserId) {
                    criarCardProposta(p);
                }
            });
        }

        if (curtidasSnap.exists() && projetosSnap.exists()) {
            const curtidas = curtidasSnap.val();
            const projetos = projetosSnap.val();
            Object.entries(curtidas).forEach(([projetoId, usuarios]) => {
                if (usuarios[perfilUserId]) {
                    const projeto = projetos[projetoId];
                    if (projeto) {
                        criarCardProjeto(projetoId, projeto, 'curtidos');
                    }
                }
            });
        }
    } else if (tipoUsuario === 'Freelancer') {
        if (projetosSnap.exists()) {
            const projetos = projetosSnap.val();
            Object.entries(projetos).forEach(([id, dados]) => {
                if (dados.userId === perfilUserId) {
                    criarCardProjeto(id, dados);
                }
            });
        }

        if (curtidasSnap.exists() && projetosSnap.exists()) {
            const curtidas = curtidasSnap.val();
            const projetos = projetosSnap.val();
            Object.entries(curtidas).forEach(([projetoId, usuarios]) => {
                if (usuarios[perfilUserId]) {
                    const projeto = projetos[projetoId];
                    if (projeto) {
                        criarCardProjeto(projetoId, projeto, 'curtidos');
                    }
                }
            });
        }
    }

    mostrarCards('projetos');
});

window.mostrarCards = mostrarCards;
