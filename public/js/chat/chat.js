import { getDatabase, get, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { censurarTexto } from "/js/chat/censurarPalavroes.js"

const db = getDatabase()
const auth = getAuth()

let destinatarioId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        iniciarChat(user)
    }
})
async function iniciarChat(user) {
    const userId = user.uid;
    const conversasRef = ref(db, `Conversas/${userId}`);

    onValue(conversasRef, async (snapshot) => {
        const sidebar = document.querySelector('.sidebar');
        const existentes = sidebar.querySelectorAll('.chat-user');
        existentes.forEach(e => e.remove());

        const children = [];
        snapshot.forEach(childSnap => {
            children.push(childSnap);
        });

        for (const childSnapshot of children) {
            const dados = childSnapshot.val();
            const outroUid = childSnapshot.key;

            // Se não tem nome/avatar, buscar nas outras coleções
            if (!dados.nome || !dados.avatar) {
                const freelancerSnap = await get(ref(db, `Freelancer/${outroUid}`));
                const contratanteSnap = await get(ref(db, `Contratante/${outroUid}`));

                if (freelancerSnap.exists()) {
                    const info = freelancerSnap.val();
                    dados.nome = info.nome || "Usuário";
                    dados.avatar = info.foto_perfil || "https://via.placeholder.com/30";
                } else if (contratanteSnap.exists()) {
                    const info = contratanteSnap.val();
                    dados.nome = info.nome || "Usuário";
                    dados.avatar = info.foto_perfil || "https://via.placeholder.com/30";
                } else {
                    dados.nome = "Usuário";
                    dados.avatar = "https://via.placeholder.com/30";
                }
            }

            // Criar o elemento visual do chat
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

                document.querySelectorAll('.chat-user').forEach(el => el.classList.remove('selected'))

                chatUser.classList.add('selected')
                const header = document.querySelector(".chat-header");
                const messages = document.querySelector(".messages");
                const input = document.querySelector(".input-area");

                const headerImg = header.querySelector("img");
                const headerNome = header.querySelector("span");

                header.classList.remove("show");
                messages.classList.remove("show");
                input.classList.remove("show");

                setTimeout(() => {
                    headerImg.src = dados.avatar;
                    headerNome.textContent = dados.nome;

                    document.querySelector(".nenhum-contato-selecionado").style.display = "none";

                    header.style.display = "flex";
                    input.style.display = "flex";
                    messages.style.display = "flex";

                    void header.offsetWidth;

                    header.classList.add("show");
                    messages.classList.add("show");
                    input.classList.add("show");
                }, 100);

                destinatarioId = outroUid;

                const mensagemRef = ref(db, `Conversas/${user.uid}/${destinatarioId}/mensagens`);
                onValue(mensagemRef, (snapshot) => {
                    const messages = document.querySelector('.messages');
                    messages.innerHTML = '';

                    snapshot.forEach((msgSnap) => {
                        const msg = msgSnap.val();
                        const div = document.createElement('div');
                        div.className = 'message ' + (msg.autor === user.uid ? "user" : 'other');
                        const textoMsg = document.createElement('span');
                        textoMsg.textContent = msg.texto;

                        const horario = document.createElement('small');
                        if (msg.timestamp) {
                            const hora = new Date(msg.timestamp).toLocaleDateString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            horario.textContent = hora;
                        } else {
                            horario.textContent = '--:--';
                        }

                        div.appendChild(textoMsg);
                        div.appendChild(horario);
                        messages.appendChild(div);
                    });

                    messages.scrollTop = messages.scrollHeight;
                });
            });

            sidebar.appendChild(chatUser);
        }
    });
}
document.querySelector(".input-area button:last-child").addEventListener("click", () => {
    const input = document.querySelector('.input-area input')
    const textoOriginal = input.value.trim()
    const texto = censurarTexto(textoOriginal)
    if (!texto || !destinatarioId) return

    const user = auth.currentUser;
    if (!user) return

    const remetenteId = user.uid

    const novaMsgRef1 = push(ref(db, `Conversas/${remetenteId}/${destinatarioId}/mensagens`))
    const novaMsgRef2 = push(ref(db, `Conversas/${destinatarioId}/${remetenteId}/mensagens`));


    const mensagem = {
        texto,
        autor: remetenteId,
        timestamp: serverTimestamp()
    }

    set(novaMsgRef1, mensagem)
    set(novaMsgRef2, mensagem)

    input.value = ''
})