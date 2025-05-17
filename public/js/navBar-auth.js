import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAAtfGyZc3SLzdK10zdq-ALyTyIs1s4qwQ",
    authDomain: "workflow-da28d.firebaseapp.com",
    projectId: "workflow-da28d",
    storageBucket: "workflow-da28d.firebasestorage.app",
    messagingSenderId: "939828605253",
    appId: "1:939828605253:web:0a286fe00f1c29ba614e2c",
    measurementId: "G-3LXB7BR5M1"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const btnLogin = document.getElementById('btnEntrar')
const btnRegister = document.getElementById('btnCriarConta')
const userControls = document.getElementById('userControls');
const userPhoto = document.getElementById('userPhoto');
const btnAdd = document.getElementById('btnAdd');

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (btnLogin) btnLogin.style.display = 'none'
        if (btnRegister) btnRegister.style.display = 'none'
        if (userControls) userControls.style.display = 'flex';

    }
    else {
        // Usuário não logado → mostra "Entrar" e "Criar Conta", esconde "Sair"
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnRegister) btnRegister.style.display = 'inline-block';
        if (userControls) userControls.style.display = 'none';

    }
})

