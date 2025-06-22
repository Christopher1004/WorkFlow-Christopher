import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
const db = getDatabase();

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

window.usuarioLogado = null

onAuthStateChanged(auth, (user) => {
    if(user){
        window.usuarioLogado = {
            id: user.uid
        }
    }
    else{
        window.usuarioLogado = null
    }
})
function salvarComentario(idProjeto, userId, textoComentario) {
    const comentariosRef = ref(db, 'Comentarios/' + idProjeto)
    const novoComentarioRef = push(comentariosRef)

    return set(novoComentarioRef, {
        userId,
        texto: textoComentario,
        data: new Date().toISOString()
    })
}
function formatarTempo(dataISO) {
    const data = new Date(dataISO)
    const agora = new Date()
    const diff = agora - data

    const minutos = Math.floor(diff / (1000 * 60))
    const horas = Math.floor(diff / (1000 * 60 * 60))
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (dias > 0) return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
}
async function carregarComentario(idProjeto) {
    const comentariosRef = ref(db)
    const snapshot = await get(child(comentariosRef, `Comentarios/${idProjeto}`))

    const container = document.getElementById('containerComentarios')
    container.innerHTML = ''

    if (snapshot.exists()) {
        const comentarios = snapshot.val()
        for (const id in comentarios) {
            const c = comentarios[id]

            let nome = ''
            let foto = ''

            let userSnapshot = await get(ref(db, `Freelancer/${c.userId}`))

            if(!userSnapshot.exists()){
                userSnapshot = await get(ref(db, `Contratante/${c.userId}`))
            }

            if(userSnapshot.exists()){
                const usuario = userSnapshot.val()
                nome = usuario.nome || nome
                foto = usuario.foto_perfil || foto
            }
            const div = document.createElement('div')
            div.className = 'message-card'
            div.innerHTML = `
                <div class="user-info">
                    <img src="${foto}" alt="Usuário">
                    <div class="user-details">
                        <span class="user-name">${nome}</span>
                        <span class="message-time">${formatarTempo(c.data)}</span>
                    </div>
                </div>
                <div class="message-text">${c.texto}</div>
            `;
            container.appendChild(div)
        }
    }
    else{
        container.innerHTML = '<p>Nenhum comentário ainda.</p>'
    }
}
document.addEventListener('modalProjetoAberto', (e) => {
    const idProjeto = e.detail.idProjeto
    carregarComentario(idProjeto)
})

document.getElementById('btnEnviarComentario').addEventListener('click', async() => {
    const input = document.getElementById('commentInput')
    const texto = input.value.trim()

    if(texto === '' || !window.idProjetoAtual) return

    const userId = window.usuarioLogado.id
    await salvarComentario(
        window.idProjetoAtual,
        userId,
        texto
    )
    input.value = ''
    carregarComentario(window.idProjetoAtual)
})