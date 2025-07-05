import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const btnLogin = document.getElementById('btnEntrar');
const btnRegister = document.getElementById('btnCriarConta');
const userControls = document.getElementById('userControls');
const userPhoto = document.getElementById('userPhoto');
const userPhotoDrop = document.getElementById('userPhotoDrop')
const btnAdd = document.getElementById('btnAdd');
const dropDownLogout = document.getElementById('dropDownLogout');
const dropDown = document.getElementById('dropDownMenu');

const perfilLink = document.querySelector("#dropDownMenu a[href='/perfil']")

const cacheUsuario = localStorage.getItem('cacheUsuario')
const tempoCache = localStorage.getItem('cacheUsuarioTempo')

if (cacheUsuario && tempoCache && Date.now() - tempoCache < 5 * 60 * 1000) { 
    try {
        const dados = JSON.parse(cacheUsuario);

        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (userControls) userControls.style.display = 'flex';

        const nome = dados.nome || 'Usuário';
        const foto = dados.foto_perfil || DEFAULT_USER_PHOTO;

        const userNameSpan = document.querySelector(".user-name");
        if (userNameSpan) userNameSpan.textContent = nome;

        if (userPhoto) {
            userPhoto.style.backgroundImage = `url('${foto}')`;
            userPhoto.style.display = 'block';
        }
        if (userPhotoDrop) userPhotoDrop.src = foto;
        if (perfilLink) perfilLink.href = `/perfil?id=${dados.uid}`;

    } catch (e) {
        console.warn('Erro ao carregar cache do usuário:', e);
    }
}
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid

        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (userControls) userControls.style.display = 'flex';

        if (userPhoto) {
            const db = getDatabase();

            const freelancerRef = ref(db, 'Freelancer/' + uid);
            const contratanteRef = ref(db, 'Contratante/' + uid);
            try {
                let userData = null
                let snapshot = await get(freelancerRef);

                if (snapshot.exists()) {
                    userData = snapshot.val()
                }
                else {
                    snapshot = await get(contratanteRef)
                    if (snapshot.exists()) {
                        userData = snapshot.val()
                    }
                }
                const userNameSpan = document.querySelector(".user-name");
                if (userData?.nome && userNameSpan) {
                    userNameSpan.textContent = userData.nome;
                }

                if(userData){
                    localStorage.setItem('cacheUsuario', JSON.stringify({
                        uid,
                        nome: userData?.nome,
                        foto_perfil: userData?.foto_perfil
                    }))
                    localStorage.setItem('cacheUsuarioTempo', Date.now())
                }
                const photoUrl = userData?.foto_perfil || DEFAULT_USER_PHOTO

                userPhoto.style.backgroundImage = `url('${photoUrl}')`
                userPhoto.style.display = 'block'

                if (userPhotoDrop) userPhotoDrop.src = photoUrl
            } catch (error) {
                console.error("Erro ao buscar avatar:", error);
                userPhoto.style.backgroundImage = `url('${DEFAULT_USER_PHOTO}')`;
                userPhoto.style.display = 'block';
            }
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

        if (btnAdd) {
            btnAdd.addEventListener('click', async () => {
                try {
                    const freelancerRef = ref(db, 'Freelancer/' + user.uid);
                    const freelancerSnap = await get(freelancerRef);

                    if (freelancerSnap.exists()) {
                        window.location.href = '/criarProjeto';
                    } else {
                        window.location.href = '/criarProposta';
                    }
                } catch (error) {
                    console.error('Erro ao verificar tipo de usuário:', error);
                    alert('Erro ao verificar tipo de usuário. Tente novamente.');
                }
            });
        }

        if (perfilLink) {
            perfilLink.href = `/perfil?id=${uid}`
        }


    } else {
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnRegister) btnRegister.style.display = 'inline-block';
        if (userControls) userControls.style.display = 'none';

        if (userPhoto) {
            userPhoto.style.backgroundImage = `url('${DEFAULT_USER_PHOTO}')`;
            userPhoto.style.display = 'none';
        }


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

const DEFAULT_USER_PHOTO = '/assets/image/defaultIcon.jpg';

const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closePopup');


userPhoto.addEventListener('click', () => {
    popupOverlay.style.display = 'flex';
});








