import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


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

import { getEstadoElementos } from "./componentesProjeto.js";

const divCapaPreview = document.getElementById('capaPreview');


export async function salvarProjetoBanco() {
    try {
        const auth = auth.currentUser

        if(!user){
            throw new Error('Usuário não autenticado')
        }
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const dataCriacao = new Date().toISOString();

        const capaUrl = divCapaPreview.dataset.imgUrl || null;

        const dadosProjetos = {
            titulo,
            descricao,
            dataCriacao,
            capaUrl,
            userId: user.uid
        };

        const projetoRef = push(ref(db, 'Projetos/'));
        const projetoID = projetoRef.key;

        await set(projetoRef, dadosProjetos);
        console.log('Projeto salvo com sucesso');

        document.querySelectorAll('.content > div').forEach(componente => {
            componente.dataset.projectId = projetoID;
        });

        const estado = getEstadoElementos();
        const componentesComIDProjeto = estado.map((c, index) => ({
            ...c,
            projetoID,
            ordem: index
        }));

        await set(ref(db, `componentesProjeto/${projetoID}`), componentesComIDProjeto);
        console.log('Componentes salvos com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao salvar projeto ou componentes:', error);
        return false
    }
}

document.getElementById('btnFinalizar').addEventListener('click', () => {
    document.getElementById('modal-confirmacao').classList.remove('hidden')
});

document.getElementById('btn-sim').addEventListener('click',  async () => {
    const sucesso = await salvarProjetoBanco()
    const modalSucesso = document.getElementById('modal-sucesso')
    const mensagemModal = document.getElementById('mensagemModal')

    if(sucesso){
        mensagemModal.textContent = 'Projeto salvo com sucesso!'
    }
    else{   
        mensagemModal.textContent = 'Erro ao salvar projeto'
    }
    document.getElementById('modal-confirmacao').classList.add('hidden')
    modalSucesso.classList.remove('hidden')
    
})

document.getElementById('btn-nao').addEventListener('click', () => {
    document.getElementById('modal-confirmacao').classList.add('hidden')
})

