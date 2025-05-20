import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js";


const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

const supabase = createClient(supabaseURL, supabaseChave)

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
const dropDownLogout = document.getElementById('dropDownLogout');
const dropDown = document.getElementById('dropDownMenu');

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (userControls) userControls.style.display = 'flex';

        if (userPhoto) {
            const photoURL = user.photoURL || DEFAULT_USER_PHOTO;
            userPhoto.style.backgroundImage = `url('${photoURL}')`;
            userPhoto.style.display = 'block';
        }

        if (dropDownLogout) {
            dropDownLogout.onclick = () => {
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

        if (userPhoto) {
            userPhoto.style.backgroundImage = `url('${DEFAULT_USER_PHOTO}')`;
            userPhoto.style.display = 'none';
        }

        if (btnLogout) btnLogout.style.display = 'none';
    }
});

userPhoto.addEventListener('click', (e) => {
    e.stopPropagation()
    dropDown.style.display = dropDown.style.display === 'block' ? 'none' : 'block'
})
document.addEventListener('click', () => {
    dropDown.style.display = 'none'
})
dropDown.addEventListener('click', (e) => {
    e.stopPropagation()
})

const DEFAULT_USER_PHOTO = 'https://www.gravatar.com/avatar/?d=mp';




