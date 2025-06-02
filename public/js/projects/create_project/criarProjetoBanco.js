import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAAtfGyZc3SLzdK10zdq-ALyTyIs1s4qwQ",
    authDomain: "workflow-da28d.firebaseapp.com",
    projectId: "workflow-da28d",
    storageBucket: "workflow-da28d.firebasestorage.app",
    messagingSenderId: "939828605253",
    appId: "1:939828605253:web:0a286fe00f1c29ba614e2c",
    measurementId: "G-3LXB7BR5M1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app)

import { getEstadoElementos } from "./componentesProjeto.js";

function salvarComponentesFirebase(){
    const estado = getEstadoElementos()

    set(ref(db, 'componentesUsuario/'), estado)
    .then(() => {
        console.log('Dados salvos com sucesso!')
    })
    .catch((error) => {
        console.error('Erro ao salvar componentes', error)
    })
    console.log('clicado')
}

document.getElementById('btnFinalizar').addEventListener('click', salvarComponentesFirebase)
