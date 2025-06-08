import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, update, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const perfilUserId = params.get('id')

const auth = getAuth();
const db = getDatabase();
const containerCard = document.querySelector('.card-zone');
const contadorProjetos = document.getElementById('quantidadeProjetos');

function criarCardProjeto(id, { titulo, descricao, capaUrl, dataCriacao }) {
    const card = document.createElement('div');
    card.className = 'card_projeto';
    card.dataset.projetoId = id;

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
            <h2 class="username">Criado por ${perfilUserId === auth.currentUser?.uid ? 'você' : 'outra pessoa'}</h2>
        </div>
    `;
    containerCard.appendChild(card);
}

onAuthStateChanged(auth, (user) => {
    if (user && perfilUserId) {
        get(ref(db, 'Projetos'))
            .then(snapshot => {
                if (snapshot.exists()) {
                    const projetos = snapshot.val();
                    let projetosTotal = 0;

                    Object.entries(projetos).forEach(([id, dados]) => {
                        if (dados.userId === perfilUserId) {
                            criarCardProjeto(id, dados);
                            projetosTotal++;
                        }
                    });

                    contadorProjetos.textContent = projetosTotal;

                    if (projetosTotal === 0) {
                        containerCard.innerHTML = '<p>Esse usuário ainda não criou nenhum projeto.</p>';
                    }
                } else {
                    containerCard.innerHTML = '<p>Nenhum projeto encontrado.</p>';
                }
            })
            .catch(err => {
                console.error("Erro ao carregar projetos do perfil:", err);
            });

            if(perfilUserId){
                get(ref(db, `Freelancer/${perfilUserId}/nome`))
                .then(snapshot => {
                    if(snapshot.exists()){
                        const nomeUsuario = snapshot.val()
                        document.title = 'Perfil de ' + nomeUsuario
                    }
                })
            }
    } else {
        containerCard.innerHTML = '<p>Faça login para ver projetos.</p>';
    }
});
