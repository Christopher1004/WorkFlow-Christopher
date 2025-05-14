import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
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

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)

const form = document.getElementById('formfreelancer')
const inputEmail = document.getElementById('txtEmail')
const inputSenha = document.getElementById('txtSenha')
const inputConfirmarSenha = document.getElementById('tConfirmarSenha')
const inputDataNascimento = document.getElementById('txtData')

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();
    const confirmarSenha = inputConfirmarSenha.value.trim();
    const dataNascimento = inputDataNascimento.value;

    if (!email || !senha || !confirmarSenha || !dataNascimento) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
        const firebaseUser = userCredential.user
        const uid = firebaseUser.uid

        const userData = {
            email: email,
            dataNascimento: dataNascimento,
            dataCadastro: new Date().toISOString(),
            emailVerificado: false,
            tipoUsuario: 'freelancer',
            CPF: null,
            Nome_usuario: null,
            Telefone: null,
            Biografia: null,
            Foto_perfil: null
        };
        await set(ref(database, `Freelancer/${uid}`), userData);

        const { data, error } = await supabase
            .from('freelancer')
            .insert([{
                uid_firebase: uid,        // Aqui entra o UID do Firebase entre 'id' e 'cpf'
                cpf: null,
                nome_usuario: null,
                email: email,
                senha: senha,             // (Se desejar, pode remover este campo futuramente)
                data_cadastro: new Date().toISOString(),
                telefone: null,
                biografia: null,
                foto_perfil: null,
                datanascimento: dataNascimento
            }]);
        if (error) {
            console.error('Erro ao inserir no Supabase:', error.message);
            alert('Erro ao salvar no Supabase. Tente novamente.');
            return;
        }

        alert('Cadastro realizado com sucesso!');
        form.reset();
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
                errorMessage += error.message;
        }
        alert(errorMessage);

    }
})
