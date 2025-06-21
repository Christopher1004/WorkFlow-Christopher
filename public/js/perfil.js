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

let itensDoUsuario = []; 
let tipoUsuario = null; 

function criarCardProjeto(id, { titulo, descricao, capaUrl, dataCriacao }) {
    const card = document.createElement('div');
    card.className = 'card_projeto';
    card.dataset.projetoId = id;
    card.style.display = 'none';

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
            <h2 class="username">Criado por ${perfilUserId === auth.currentUser?.uid ? 'você' : 'outra pessoa'}</h2>
        </div>
    `;
    containerCard.appendChild(card);
    itensDoUsuario.push(card);
}

function criarCardProposta(p) {
    const tagsHtml = Array.isArray(p.tags) ? p.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

    const fotoUrl = p.fotoAutorUrl || 'https://via.placeholder.com/40';
    const nomeAutor = p.nomeAutor || 'Nome não informado';

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
        <button class="candidatos">Candidatos</button>
        </div>
      </div>
    `;
    containerCard.appendChild(card);
    itensDoUsuario.push(card);
}

function formatarData(isoString) {
    const data = new Date(isoString);
    return isNaN(data) ? "Data inválida" : data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function mostrarCards(tipo) {
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const botaoAtivo = [...tabButtons].find(btn =>
        btn.textContent.trim().includes(
            tipo === 'projetos' ? (tipoUsuario === 'Contratante' ? 'Propostas' : 'Projetos') :
            tipo === 'curtidos' ? 'Curtidos' :
            'Favoritos'
        )
    );
    if (botaoAtivo) botaoAtivo.classList.add('active');

    itensDoUsuario.forEach(card => card.style.display = 'none');

    const mensagens = containerCard.querySelectorAll('.mensagem-aba');
    mensagens.forEach(el => el.remove());

    if (tipo === 'projetos') {
        if (itensDoUsuario.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.textContent = tipoUsuario === 'Contratante'
                ? 'Esse contratante ainda não criou nenhuma proposta.'
                : 'Esse usuário ainda não criou nenhum projeto.';
            mensagem.classList.add('mensagem-aba');
            containerCard.appendChild(mensagem);
        } else {
            itensDoUsuario.forEach(card => card.style.display = 'block');
        }
    } else {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Ainda não há conteúdo nesta aba.';
        mensagem.classList.add('mensagem-aba');
        containerCard.appendChild(mensagem);
    }
    contadorProjetos.textContent = itensDoUsuario.length;
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
    if (user && perfilUserId) {
        containerCard.innerHTML = '';
        itensDoUsuario = [];

        tipoUsuario = await detectarTipoUsuario(perfilUserId);
        if (tipoUsuario === 'Contratante') {
    const labelProjetos = document.querySelector('.projetos-realizados p');
    if (labelProjetos) labelProjetos.textContent = 'Propostas realizadas';
}


tabButtons.forEach(btn => {
    if (btn.dataset.tab === 'projetos') {
        const span = btn.querySelector('span');
        if (span) {
            span.textContent = tipoUsuario === 'Contratante' ? 'Propostas' : 'Projetos';
        }
    }
});


       if (tipoUsuario === 'Contratante') {
   
    const snapshot = await get(ref(db, 'Propostas'));
    if (snapshot.exists()) {
        const propostas = snapshot.val();
        let count = 0;
        Object.values(propostas).forEach(p => {
            if (p.autorId === perfilUserId) {
                criarCardProposta(p);
                count++;
            }
        });
        mostrarCards('projetos');
        contadorProjetos.textContent = count;
    } else {
        mostrarCards('projetos');
    }
}
 else if (tipoUsuario === 'Freelancer') {
        
            const snapshot = await get(ref(db, 'Projetos'));
            if (snapshot.exists()) {
                const projetos = snapshot.val();
                let count = 0;
                Object.entries(projetos).forEach(([id, dados]) => {
                    if (dados.userId === perfilUserId) {
                        criarCardProjeto(id, dados);
                        count++;
                    }
                });
                mostrarCards('projetos');
                contadorProjetos.textContent = count;
            } else {
                mostrarCards('projetos'); 
            }
        } else {
            containerCard.innerHTML = '<p>Tipo de usuário não encontrado.</p>';
            contadorProjetos.textContent = '0';
        }
    } else {
        containerCard.innerHTML = '<p>Faça login para ver projetos ou propostas.</p>';
        contadorProjetos.textContent = '0';
    }
});

window.mostrarCards = mostrarCards;
