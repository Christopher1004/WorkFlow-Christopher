import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
const db = getDatabase();


function salvarComentario(idProjeto, usuario, textoComentario, fotoUsuario = '') {
    const comentariosRef = ref(db, 'Comentarios/' + idProjeto)
    const novoComentarioRef = push(comentariosRef)

    return set(novoComentarioRef, {
        usuario,
        texto: textoComentario,
        foto: fotoUsuario,
        data: new Date().toISOString()
    })
}
function formatarTempo(dataISO) {
    const data = new Date(dataISO)
    const agora = new Date()
    const diff = agora - data

    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(diff / 60)
    const dias = Math.floor(horas / 24)

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

            const div = document.createElement('div')
            div.className = 'message-card'
            div.innerHTML = `
                <div class="user-info">
                    <img src="${c.foto || 'https://via.placeholder.com/50'}" alt="Usuário">
                    <div class="user-details">
                        <span class="user-name">${c.usuario}</span>
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

    await salvarComentario(
        window.idProjetoAtual,
        'Christopher',
        texto,
        'https://uvvquwlgbkdcnchiyqzs.supabase.co/storage/v1/object/public/freelancer-photos/avatars/image.jfif'

    )
    input.value = ''
    carregarComentario(window.idProjetoAtual)
})