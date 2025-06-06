import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


//const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
//const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

//const supabase = createClient(supabaseURL, supabaseChave)

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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (userControls) userControls.style.display = 'flex';

        if (userPhoto) {
            const db = getDatabase();
            const uid = user.uid

            const freelancerRef = ref(db, 'Freelancer/' + uid);
            const contratanteRef = ref(db, 'Contratante/' + uid);
            try {
                let userData = null
                let snapshot = await get(freelancerRef);

                if(snapshot.exists()){
                    userData = snapshot.val()
                }
                else{
                    snapshot = await get(contratanteRef)
                    if(snapshot.exists()){
                        userData = snapshot.val()
                    }
                }
                const photoUrl = userData?.foto_perfil || DEFAULT_USER_PHOTO
                
                userPhoto.style.backgroundImage = `url('${photoUrl}')`
                userPhoto.style.display = 'block'

                if(userPhotoDrop) userPhotoDrop.src = photoUrl
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


    } else {
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnRegister) btnRegister.style.display = 'inline-block';
        if (userControls) userControls.style.display = 'none';

        if (userPhoto) {
            userPhoto.style.backgroundImage = `url('${DEFAULT_USER_PHOTO}')`;
            userPhoto.style.display = 'none';
        }


    }
    const fileInput = document.getElementById('imageInput')
    const uploadBtn = document.getElementById('uploadButton')

    uploadBtn.addEventListener('click', async () => {
        const file = fileInput.files[0]
        if (!file) {
            alert('Selecione uma imagem')
            return
        }

        // Usa o nome original do arquivo
        const filePath = `avatars/${file.name}`

        // Envia o arquivo
        const { error: uploadError } = await supabase.storage
            .from('freelancer-photos')
            .upload(filePath, file)

        if (uploadError) {
            alert('Erro ao enviar imagem: ' + uploadError.message)
            return
        }
        const { data } = supabase.storage.from('freelancer-photos').getPublicUrl(filePath)
        const publicUrl = data.publicUrl

        alert('Imagem enviada com sucesso!')

        const userRef = ref(db, 'Freelancer/' + user.uid)
        try {
            await update(userRef, {
                foto_perfil: publicUrl
            })
            alert('Perfil atualizado')
        }
        catch (error) {
            alert('Erro ao atualizar perfil' + error.message)
        }
    })
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

// Fechar popup
closeBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});








