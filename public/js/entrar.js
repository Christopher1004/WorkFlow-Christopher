import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

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
const database = getDatabase(app);

const form = document.getElementById('login-form');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('password');
const mensagemErro = document.getElementById('form-error');
const erroLogin = document.getElementById('login-error');
const labelLogin = document.querySelectorAll('.labelLogin');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = inputEmail.value.trim();
  const senha = inputSenha.value.trim();

  if (!email || !senha) {
    mensagemErro.style.display = 'block';
    inputEmail.style.borderColor = '#ea3154';
    inputSenha.style.borderColor = '#ea3154';
    labelLogin.forEach(label => label.style.color = '#ea3154');
    inputEmail.focus();
    return;
  } else {
    mensagemErro.style.display = 'none';
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    const dbRef = ref(database);
    const userId = user.uid;

    const freelancerSnap = await get(child(dbRef, `Freelancer/${userId}`));
    const contratanteSnap = await get(child(dbRef, `Contratante/${userId}`));

    if (freelancerSnap.exists()) {
      const data = freelancerSnap.val();
      if (data.nome && data.bio && data.tag && data.foto_perfil) {
        window.location.href = '/'; 
      } else {
        window.location.href = `freeInfo?userId=${userId}`; 
      }
    } else if (contratanteSnap.exists()) {
      const data = contratanteSnap.val();
      if (data.nome && data.bio && data.tag && data.foto_perfil) {
        window.location.href = '/'; 
      } else {
        window.location.href = `freeInfo?userId=${userId}`; 
      }
    }
  } catch (error) {
    erroLogin.style.display = 'block';
  }
});

[inputEmail, inputSenha].forEach(input => {
  input.addEventListener('input', () => {
    if (mensagemErro.style.display === 'block') {
      mensagemErro.style.display = 'none';
      inputEmail.style.borderColor = '#404040';
      inputSenha.style.borderColor = '#404040';
      labelLogin.forEach(label => label.style.color = '#D9D9D9');
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

// --- Login social Google e GitHub ---

const googleBtn = document.querySelector('.auth-link.google');
const githubBtn = document.querySelector('.auth-link.github');

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

async function loginSocial(provider) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userId = user.uid;

    const dbRef = ref(database);

    const freelancerSnap = await get(child(dbRef, `Freelancer/${userId}`));
    const contratanteSnap = await get(child(dbRef, `Contratante/${userId}`));

    if (freelancerSnap.exists() || contratanteSnap.exists()) {
      window.location.href = '/';
    } else {
      await signOut(auth);
      alert("Conta não cadastrada. Por favor, faça seu cadastro primeiro.");
      window.location.href = '/register';
    }
  } catch (error) {
    console.error("Erro no login social:", error);
    alert("Erro no login social. Tente novamente.");
  }
}

googleBtn.addEventListener('click', () => loginSocial(googleProvider));
githubBtn.addEventListener('click', () => loginSocial(githubProvider));
