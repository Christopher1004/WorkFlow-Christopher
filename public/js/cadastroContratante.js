import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

//const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
//const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

//const  supabase = createClient(supabaseURL, supabaseChave)

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
const database = getDatabase(app)


const documentoInput = document.getElementById('documento');

// Máscara automática durante a digitação
documentoInput.addEventListener('input', function (e) {
    let value = this.value.replace(/\D/g, '');

    // Limitar máximo de 14 dígitos
    if (value.length > 14) {
        value = value.substring(0, 14);
    }

    if (value.length <= 11) {
        // Máscara CPF 000.000.000-00
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // Máscara CNPJ 00.000.000/0000-00
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    this.value = value;
});



const form = document.getElementById('formcontratante')
const inputEmailContratante = document.getElementById('txtEmailContra')
const inputSenhaContrantante = document.getElementById('txtSenhaContra')
const inputConfirmarSenhaContratante = document.getElementById('txtConfirmarSenhaContra')
const inputDataNascimentoContratante = document.getElementById('txtDataContra')
const mensagemErro = document.getElementById('form-error')

function mostrarPopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('popup-hidden');

    setTimeout(() => {
        popup.classList.add('popup-hidden');
        window.location.href = '/login';
    }, 2000);  // 2 segundos
}

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = inputEmailContratante.value.trim();
    const senha = inputSenhaContrantante.value.trim();
    const confirmarSenha = inputConfirmarSenhaContratante.value.trim();
    const dataNascimento = inputDataNascimentoContratante.value;
    const documento = documentoInput.value.replace(/\D/g, ''); // Remove máscara

    if (!email || !senha || !confirmarSenha || !dataNascimento) {
        mensagemErro.style.display = 'block'
        return;
    }
    if (senha !== confirmarSenha) {
        mensagemErro.style.display = 'block'
        mensagemErro.textContent = 'A senhas não coincidem'
        return;
    }

    if (!documento || (documento.length !== 11 && documento.length !== 14)) {
        mensagemErro.style.display = 'block'
        mensagemErro.textContent = 'Documento inválido. CPF deve ter 11 dígitos, CNPJ 14.'
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const firebaseUser = userCredential.user;
        const uid = firebaseUser.uid;

        const userData = {
            email: email,
            dataNascimento: dataNascimento,
            dataCadastro: new Date().toISOString(),
            emailVerificado: false,
            tipoUsuario: 'contratante',
            documento: documento,
            Nome_usuario: null,
            Telefone: null,
            Biografia: null,
            Foto_perfil: null
        };
        await set(ref(database, `Contratante/${uid}`), userData)

        mostrarPopup()


    }
    catch (error) {
        let errorMessage = 'Erro no cadastro: ';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Este email já está em uso.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Email inválido.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Senha muito fraca (mínimo 6 caracteres).';
                break;
            default:
                errorMessage += error.message || error;
        }
        alert(errorMessage);
    }
})


const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const googleBtn = document.querySelector('.auth-link.google');
const githubBtn = document.querySelector('.auth-link.github');

async function cadastroSocialContratante(provider) {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userId = user.uid;

        const dbRef = ref(database);
        const contratanteSnap = await get(child(dbRef, `Contratante/${userId}`));

        if (contratanteSnap.exists()) {
            alert("Conta já cadastrada. Por favor, faça login.");
            await signOut(auth);
            window.location.href = '/login';
            return;
        }

        const userData = {
            email: user.email,
            dataCadastro: new Date().toISOString(),
            emailVerificado: user.emailVerified || false,
            tipoUsuario: 'contratante',
            documento: null,
            Nome_usuario: null,
            Telefone: null,
            Biografia: null,
            Foto_perfil: user.photoURL || null
        };
        await set(ref(database, `Contratante/${userId}`), userData);

        window.location.href = '/';

    } catch (error) {
        console.error("Erro no cadastro social contratante:", error);
        alert("Erro ao cadastrar com login social. Tente novamente.");
    }
}

googleBtn.addEventListener('click', () => cadastroSocialContratante(googleProvider));
githubBtn.addEventListener('click', () => cadastroSocialContratante(githubProvider));
