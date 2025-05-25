import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

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

const form = document.getElementById('login-form');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('password');
const mensagemErro = document.getElementById('form-error')
const erroLogin = document.getElementById('login-error')

const labelLogin = document.querySelectorAll('.labelLogin')

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = inputEmail.value.trim();
  const senha = inputSenha.value.trim();

  if (!email || !senha) {
    mensagemErro.style.display = 'block'
    inputEmail.style.borderColor = '#ea3154'
    inputSenha.style.borderColor = '#ea3154'
    labelLogin.forEach(label => {
      label.style.color = '#ea3154'
    })
    inputEmail.focus()
    return;
  }
  else {
    mensagemErro.style.display = 'none'
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log('Usuário autenticado:', user);

    // Redirecionar para a página principal ou dashboard
    window.location.href = '/';
  } catch (error) {
    let errorMessage = 'Erro no login: ';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage += 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        errorMessage += 'Senha incorreta.';
        break;
      default:
        errorMessage += error.message;
    }
    erroLogin.style.display = 'block'

  }
});
[inputEmail, inputSenha].forEach(input => {
  input.addEventListener('input', () => {
    if (mensagemErro.style.display === 'block') {
      mensagemErro.style.display = 'none';
      inputEmail.style.borderColor = '#404040'
      inputSenha.style.borderColor = '#404040'
      labelLogin.forEach(label => {
        label.style.color = '#D9D9D9'
      })
    }
  });
});

[inputEmail, inputSenha].forEach(input => {
  input.addEventListener('input', () => {
    if (erroLogin.style.display === 'block') {
      erroLogin.style.display = 'none';
    }
  });
});


