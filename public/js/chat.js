import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const db = getDatabase()
const auth = getAuth()

onAuthStateChanged(auth, (user) => {
    if(user){
        const userId = user.uid
        const conversasRef = ref(db, `Conversas/${userId}`)

        onValue(conversasRef, (snapshot) => {
            const sidebar = document.querySelector('.sidebar')
            const existentes = sidebar.querySelectorAll('.chat-user')
            existentes.forEach(e => e.remove())

            snapshot.forEach(childSnapshot => {
                const dados = childSnapshot.val()

                const chatUser = document.createElement('div')
                chatUser.className = 'chat-user'
                chatUser.innerHTML = `
                    <img src ="${dados.avatar}" alt='avatar' />
                    <div class='chat-user-info'>
                        <div>${dados.nome}</div>
                        <small>Clique para abrir</small>
                    </div>
                `;
                sidebar.appendChild(chatUser)
            })
        })
    }
})