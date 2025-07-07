import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

const btnAnexos = document.getElementById("btnAnexos");
const menuAnexos = document.getElementById("menuAnexos");

let projetosCarregados = [];
let cacheCurtidas = {};   // { idProjeto: true }
let cacheFavoritos = {};  // { idProjeto: true }
let authUserId = null;

btnAnexos.addEventListener("click", (e) => {
    e.stopPropagation();
    menuAnexos.classList.toggle("show");
});

document.addEventListener("click", () => {
    menuAnexos.classList.remove("show");
});

const modalLink = document.getElementById("modalLink");
const modalProjeto = document.getElementById("modalProjeto");

document.getElementById("anexarProjeto").addEventListener("click", abrirModalProjeto);
document.getElementById("anexarLink").addEventListener("click", abrirModalLink);

function abrirModalLink() {
    modalLink.classList.add("show");
}

function abrirModalProjeto() {
    modalProjeto.classList.add("show");
    renderizarProjetos("seus");
}

function confirmarAnexarLink() {
    const link = document.getElementById("inputLink").value;
    if (link) {
        alert("Link anexado: " + link);
    }
    modalLink.classList.remove("show");
}

function trocarAbaProjeto(botao) {
    document.querySelectorAll(".modal-tabs button").forEach(b => b.classList.remove("active"));
    botao.classList.add("active");
    const aba = botao.getAttribute("data-tab");
    renderizarProjetos(aba);
}

function renderizarProjetos(tipo) {
    const projetosContainer = document.getElementById("projetosLista");
    projetosContainer.innerHTML = "";

    if (!authUserId) {
        projetosContainer.innerHTML = "<p style='color:white;'>Usuário não autenticado.</p>";
        return;
    }

    let listaFiltrada = [];

    if (tipo === "seus") {
        listaFiltrada = projetosCarregados.filter(p => p.userId === authUserId);
    } else if (tipo === "curtidos") {
        listaFiltrada = projetosCarregados.filter(p => cacheCurtidas[p.idProjeto]);
    } else if (tipo === "favoritos") {
        listaFiltrada = projetosCarregados.filter(p => cacheFavoritos[p.idProjeto]);
    }

    if (listaFiltrada.length === 0) {
        projetosContainer.innerHTML = "<p style='color:white;'>Nenhum projeto encontrado.</p>";
        return;
    }

    listaFiltrada.forEach(p => {
        const card = document.createElement("div");
        card.className = "projeto-card";
        card.innerHTML = `
            <div class='projeto-overlay'>${p.titulo}</div>
            <img src="${p.capaUrl}" alt="Capa" class="projeto-capa">
            <div class="projeto-info">
                <img src="${p.avatarCriador}" alt="Avatar" class="projeto-avatar">
                <span class="projeto-nome">${p.nomeCriador}</span>
            </div>
        `;
        projetosContainer.appendChild(card);
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modalLink) modalLink.classList.remove("show");
    if (e.target === modalProjeto) modalProjeto.classList.remove("show");
});

document.querySelectorAll(".modal-tabs button").forEach(button => {
    button.addEventListener("click", function () {
        trocarAbaProjeto(this);
    });
});

async function carregarTodosOsProjetos() {
    try {
        const projetosSnap = await get(child(ref(db), "Projetos"));
        if (!projetosSnap.exists()) return;

        const todosProjetos = projetosSnap.val();
        const listaFinal = [];
        const cacheUsuarios = {};

        for (const idProjeto in todosProjetos) {
            const projeto = todosProjetos[idProjeto];
            const userId = projeto.userId;

            if (!cacheUsuarios[userId]) {
                const snap = await get(child(ref(db), `Freelancer/${userId}`));
                cacheUsuarios[userId] = snap.exists() ? snap.val() : { nome: "Desconhecido", foto_perfil: "https://via.placeholder.com/24" };
            }

            listaFinal.push({
                ...projeto,
                idProjeto,
                nomeCriador: cacheUsuarios[userId].nome,
                avatarCriador: cacheUsuarios[userId].foto_perfil
            });
        }

        projetosCarregados = listaFinal;
    } catch (err) {
        console.error("Erro ao carregar projetos:", err);
    }
}

async function carregarCurtidasEComentarios() {
    cacheCurtidas = {};
    cacheFavoritos = {};

    if (!authUserId) return;

    try {
        // Carrega curtidas do usuário
        const curtidasSnap = await get(child(ref(db), `Curtidas`));
        if (curtidasSnap.exists()) {
            const todasCurtidas = curtidasSnap.val();
            for (const idProjeto in todasCurtidas) {
                if (todasCurtidas[idProjeto] && todasCurtidas[idProjeto][authUserId]) {
                    cacheCurtidas[idProjeto] = true;
                }
            }
        }

        // Carrega favoritos do usuário
        const favoritosSnap = await get(child(ref(db), `Favoritos`));
        if (favoritosSnap.exists()) {
            const todosFavoritos = favoritosSnap.val();
            for (const idProjeto in todosFavoritos) {
                if (todosFavoritos[idProjeto] && todosFavoritos[idProjeto][authUserId]) {
                    cacheFavoritos[idProjeto] = true;
                }
            }
        }
    } catch (err) {
        console.error("Erro ao carregar curtidas e favoritos:", err);
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        authUserId = user.uid;
        await carregarTodosOsProjetos();
        await carregarCurtidasEComentarios();
        renderizarProjetos("seus");
    } else {
        authUserId = null;
        projetosCarregados = [];
        cacheCurtidas = {};
        cacheFavoritos = {};
    }
});
