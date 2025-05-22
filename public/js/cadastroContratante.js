import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
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

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = inputEmailContratante.value.trim();
    const senha = inputSenhaContrantante.value.trim();
    const confirmarSenha = inputConfirmarSenhaContratante.value.trim();
    const dataNascimento = inputDataNascimentoContratante.value;
    const documento = documentoInput.value.replace(/\D/g, ''); // Remove máscara

    let validado = true

    if (!senha || !confirmarSenha) {
        alert('Por vaor preencha a senha e a confirmação')
        validado = false;
    }
    else if (senha !== confirmarSenha) {
        alert('As senhas não coincidem')
        validado = false
    }
    if (!email) {
        alert('Preencha o e-mail.');
        validado = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor insira um e-mail válido.');
        validado = false;
    }

    if (!dataNascimento) {
        alert('Preencha a Data de Nascimento.');
        validado = false;
    }

    if (!documento || (documento.length !== 11 && documento.length !== 14)) {
        alert('Documento inválido. CPF deve ter 11 dígitos, CNPJ 14.');
        validado = false;
    }

    if (!validado) return;

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

        alert('Cadastro realizado com sucesso')
        form.reset()
        window.location.href = '/login';

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