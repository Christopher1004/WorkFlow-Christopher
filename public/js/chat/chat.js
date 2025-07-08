import {
    getDatabase, ref, get, onChildAdded, push, set, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import {
    getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { censurarTexto } from "/js/chat/censurarPalavroes.js";
import { projetosCarregados } from "./anexosChat.js";
const db = getDatabase();
const auth = getAuth();

let destinatarioId = null;
let userIdLogado = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        userIdLogado = user.uid;
        iniciarChat(user);
    } else {
        userIdLogado = null;
        document.querySelector('.sidebar').innerHTML = '';
        limparChat();
    }
});

async function iniciarChat(user) {
    const userId = user.uid;
    const conversasRef = ref(db, `Conversas/${userId}`);
    const sidebar = document.querySelector('.sidebar');

    onChildAdded(conversasRef, async (snapshot) => {
        const outroUid = snapshot.key;
        const dados = snapshot.val();

        if (sidebar.querySelector(`.chat-user[data-id="${outroUid}"]`)) return;

        if (!dados.nome || !dados.avatar) {
            const snapFreelancer = await get(ref(db, `Freelancer/${outroUid}`));
            const snapContratante = await get(ref(db, `Contratante/${outroUid}`));

            if (snapFreelancer.exists()) {
                const info = snapFreelancer.val();
                dados.nome = info.nome || "Usuário";
                dados.avatar = info.foto_perfil || "https://via.placeholder.com/30";
            } else if (snapContratante.exists()) {
                const info = snapContratante.val();
                dados.nome = info.nome || "Usuário";
                dados.avatar = info.foto_perfil || "https://via.placeholder.com/30";
            } else {
                dados.nome = "Usuário";
                dados.avatar = "https://via.placeholder.com/30";
            }
        }

        const chatUser = document.createElement('div');
        chatUser.dataset.id = outroUid;
        chatUser.className = 'chat-user';
        chatUser.innerHTML = `
      <img src="${dados.avatar}" alt="avatar" />
      <div class="chat-user-info">
        <div>${dados.nome}</div>
        <small>Clique para abrir</small>
      </div>
    `;

        chatUser.addEventListener("click", () => {
            selecionarChatUser(chatUser, dados, userId, outroUid);
        });

        sidebar.appendChild(chatUser);
    });
}

function selecionarChatUser(chatUserEl, dadosUsuario, userIdLogadoParam, destinatario) {
    document.querySelectorAll('.chat-user').forEach(el => el.classList.remove('selected'));
    chatUserEl.classList.add('selected');

    const header = document.querySelector(".chat-header");
    const headerImg = header.querySelector("img");
    const headerNome = header.querySelector("span");
    headerImg.src = dadosUsuario.avatar;
    headerNome.textContent = dadosUsuario.nome;

    document.querySelector(".nenhum-contato-selecionado").style.display = "none";
    const input = document.querySelector(".input-area");
    const messages = document.querySelector(".messages");
    header.style.display = "flex";
    input.style.display = "flex";
    messages.style.display = "flex";

    setTimeout(() => {
        header.classList.add("show");
        input.classList.add("show");
        messages.classList.add("show");
    }, 50);

    destinatarioId = destinatario;

    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '';

    const mensagemRef = ref(db, `Conversas/${userIdLogadoParam}/${destinatario}/mensagens`);

    if (window._mensagemListener) {
        window._mensagemListener();
    }

    const unsubscribe = onChildAdded(mensagemRef, (msgSnap) => {
        const msg = msgSnap.val();

        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';

        const div = document.createElement('div');
        div.className = 'message ' + (msg.autor === userIdLogadoParam ? "user" : 'other');

        if (msg.projeto) {
            const projetoCard = document.createElement("div");
            projetoCard.className = "mensagem-projeto2";
            projetoCard.innerHTML = `
        <div class="projeto-img-wrapper2">
            <div class="projeto-overlay2">${msg.projeto.titulo}</div>
            <img src="${msg.projeto.capa}" alt="Capa" class="projeto-capa2">
        </div>
        <div class="projeto-info2">
            <div class="criador-info2">
                <img src="${msg.projeto.avatar}" alt="Avatar" class="projeto-avatar2">
                <span class="projeto-nome2">${msg.projeto.autor}</span>
            </div>
        </div>
    `;
            div.appendChild(projetoCard);
        } else {
            const textoMsg = document.createElement('span');
            textoMsg.textContent = msg.texto;
            div.appendChild(textoMsg);
        }

        const horario = document.createElement('small');
        horario.className = 'hora-msg';
        horario.style.marginBottom ='25px'
        if (msg.timestamp) {
            const hora = new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            horario.textContent = hora;
        } else {
            horario.textContent = '--:--';
        }

        wrapper.appendChild(div);
        wrapper.appendChild(horario);

        messagesContainer.appendChild(wrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    });

    window._mensagemListener = unsubscribe;
}

document.getElementById("btnEnviar").addEventListener("click", async () => {
    const input = document.querySelector('.input-area input');
    const textoOriginal = input.value.trim();
    const texto = censurarTexto(textoOriginal);
    if (!texto || !destinatarioId) return;

    const user = auth.currentUser;
    if (!user) return;

    const remetenteId = user.uid;

    const conversaRemetenteRef = ref(db, `Conversas/${remetenteId}/${destinatarioId}`);
    const conversaSnapshot = await get(conversaRemetenteRef);

    if (!conversaSnapshot.exists()) {
        const snapFreelancer = await get(ref(db, `Freelancer/${destinatarioId}`));
        const snapContratante = await get(ref(db, `Contratante/${destinatarioId}`));

        let nome = "Usuário";
        let avatar = "https://via.placeholder.com/30";

        if (snapFreelancer.exists()) {
            const dados = snapFreelancer.val();
            nome = dados.nome || nome;
            avatar = dados.foto_perfil || avatar;
        } else if (snapContratante.exists()) {
            const dados = snapContratante.val();
            nome = dados.nome || nome;
            avatar = dados.foto_perfil || avatar;
        }

        await set(conversaRemetenteRef, {
            nome,
            avatar,
            ultimoTimestamp: serverTimestamp()
        });
    }

    const novaMsgRef1 = push(ref(db, `Conversas/${remetenteId}/${destinatarioId}/mensagens`));
    const novaMsgRef2 = push(ref(db, `Conversas/${destinatarioId}/${remetenteId}/mensagens`));

    const mensagem = {
        texto,
        autor: remetenteId,
        timestamp: serverTimestamp()
    };

    await set(novaMsgRef1, mensagem);
    await set(novaMsgRef2, mensagem);

    input.value = '';
});

function limparChat() {
    document.querySelector(".chat-header").style.display = "none";
    document.querySelector(".input-area").style.display = "none";
    document.querySelector(".messages").style.display = "none";
    document.querySelector(".nenhum-contato-selecionado").style.display = "flex";
    destinatarioId = null;
}

function enviarProjetoNoChat(projeto) {
    const user = auth.currentUser;
    if (!user || !destinatarioId) return;

    const remetenteId = user.uid;

    const mensagemProjeto = {
        projeto: {
            id: projeto.idProjeto,
            titulo: projeto.titulo,
            capa: projeto.capaUrl,
            autor: projeto.nomeCriador,
            avatar: projeto.avatarCriador
        },
        autor: remetenteId,
        timestamp: serverTimestamp()
    };

    const novaMsgRef1 = push(ref(db, `Conversas/${remetenteId}/${destinatarioId}/mensagens`));
    const novaMsgRef2 = push(ref(db, `Conversas/${destinatarioId}/${remetenteId}/mensagens`));

    set(novaMsgRef1, mensagemProjeto);
    set(novaMsgRef2, mensagemProjeto);
}

window.addEventListener("projetoAnexado", (e) => {
    const idProjeto = e.detail.idProjeto;

    if (typeof projetosCarregados !== "undefined") {
        const projetoSelecionado = projetosCarregados.find(p => p.idProjeto === idProjeto);
        if (projetoSelecionado) {
            enviarProjetoNoChat(projetoSelecionado);
            const modalProjeto = document.getElementById("modalProjeto");
            if (modalProjeto) modalProjeto.classList.remove("show");
        }
    } else {
        console.warn("projetosCarregados não está definido no escopo do chat.js");
    }
});
