import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

export function iconeCurtida(projetoId, svg) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const curtidaRef = ref(db, `Curtidas/${projetoId}/${userId}`);

            get(curtidaRef).then(snapshot => {
                const path = svg.querySelector('path'); // <- aqui está o alvo real
                if (snapshot.exists()) {
                    remove(curtidaRef);
                    path.classList.remove('curtido');
                    svg.classList.add('animar-descurtida')
                    setTimeout(() => {
                        svg.classList.remove('animar-descurtida')
                    }, 400)
                } else {
                    set(curtidaRef, true);
                    path.classList.add('curtido');
                    svg.classList.add('animar-curtida')

                    setTimeout(() => {
                        svg.classList.remove('animar-curtida')
                    }, 400)
                }
            });
        } else {
            console.log('Você precisa estar logado para curtir');
        }
    });
}
