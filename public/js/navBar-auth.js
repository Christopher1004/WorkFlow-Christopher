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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const btnLogin = document.getElementById('btnEntrar');
const btnRegister = document.getElementById('btnCriarConta');
const userControls = document.getElementById('userControls');
const userPhoto = document.getElementById('userPhoto');
const btnAdd = document.getElementById('btnAdd');
const btnLogout = document.getElementById('btnLogout'); 

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (userControls) userControls.style.display = 'flex';

        // Mostrar foto do usuário, se houver
        if (userPhoto) {
            if (user.photoURL) {
                userPhoto.src = user.photoURL;
                userPhoto.style.display = 'block';
            } else {
                userPhoto.style.display = 'none';
            }
        }

        if (btnLogout) {
            btnLogout.style.display = 'inline-block';
            btnLogout.onclick = () => {
                signOut(auth)
                    .then(() => {
                        console.log("Usuário deslogado.");
                        window.location.reload(); 
                    })
                    .catch((error) => {
                        console.error("Erro ao sair:", error);
                    });
            };
        }

    } else {
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnRegister) btnRegister.style.display = 'inline-block';
        if (userControls) userControls.style.display = 'none';
        if (userPhoto) userPhoto.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
    }
});
