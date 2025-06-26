import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
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
const db = getDatabase(app)

import { getEstadoElementos, renderizarComponente, renderizarComponenteComCamada } from "./componentesProjeto.js";

const divCapaPreview = document.getElementById('capaPreview');

let tags = []



function pegarPrimeiraLetra(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
function renderTags() {
    tags.forEach((tag, index) => {
        const tagElement = document.createElement('span')
        tagElement.classList.add('tag-chip')
        tagElement.innerHTML = `${tag} <button data-index="${index}">&times;</button>`;
    })
}

const tagButtons = document.querySelectorAll('.tag-btn')
tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tagText = pegarPrimeiraLetra(btn.textContent.trim())

        if (tags.includes(tagText)) {
            tags = tags.filter(t => t !== tagText)
            btn.classList.remove('selected')
        }
        else {
            tags.push(tagText)
            btn.classList.add('selected')
        }
        renderTags()
    })
})

const urlParams = new URLSearchParams(window.location.search);
const idProjeto = urlParams.get("editId");

async function carregarProjeto(id) {
    if (!id) return;

    try {
        const projetoRef = ref(db, `Projetos/${id}`);
        const componenteRef = ref(db, `componentesProjeto/${id}`);

        const snapshotProjeto = await get(projetoRef);
        if (snapshotProjeto.exists()) {
            const dados = snapshotProjeto.val();
            document.getElementById('titulo').value = dados.titulo || '';

            if (dados.capaUrl) {
                divCapaPreview.style.backgroundImage = `url(${dados.capaUrl})`;
                divCapaPreview.dataset.imgUrl = dados.capaUrl;
            }

            tags = dados.tags || [];
            tagButtons.forEach(btn => {
                const tagText = pegarPrimeiraLetra(btn.textContent.trim());
                if (tags.includes(tagText)) btn.classList.add('selected');
            });
        }

        const snapshotComponentes = await get(componenteRef);
        if (snapshotComponentes.exists()) {
            const dadosComponentes = snapshotComponentes.val();

            document.querySelector('.content').innerHTML = '';
            document.querySelector('.camadaArea').innerHTML = '';

            dadosComponentes.forEach(comp => {
                renderizarComponenteComCamada(comp);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar projeto:", error);
    }
}

export async function salvarProjetoBanco() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuário não autenticado');

        const titulo = document.getElementById('titulo').value;
        const capaUrl = divCapaPreview.dataset.imgUrl || null;

        const dadosProjeto = {
            titulo,
            capaUrl,
            userId: user.uid,
            tags
        };

        let projetoID = idProjeto;

        if (!projetoID) {
            // Criar novo projeto
            dadosProjeto.dataCriacao = new Date().toISOString();
            const projetoRef = push(ref(db, 'Projetos/'));
            projetoID = projetoRef.key;
            await set(projetoRef, dadosProjeto);
            console.log('Projeto criado com sucesso:', projetoID);
        } else {
            // Atualizar projeto existente
            await update(ref(db, `Projetos/${projetoID}`), dadosProjeto);
            console.log('Projeto atualizado com sucesso:', projetoID);
        }

        // Atualizar projectId em cada componente antes de salvar
        const estado = getEstadoElementos().map((c, index) => ({
            ...c,
            ordem: index,
            projectId: projetoID
        }));

        await set(ref(db, `componentesProjeto/${projetoID}`), estado);
        console.log('Componentes salvos com sucesso');
        return true;

    } catch (error) {
        console.error('Erro ao salvar projeto ou componentes:', error);
        return false;
    }
}

if (idProjeto) {
    carregarProjeto(idProjeto);
}

const btnCancelar = document.getElementById('btnCancelar')
btnCancelar.addEventListener('click', async (e) => {
    e.preventDefault()
    const componentesImagem = document.querySelectorAll('.content > div[data-tipo="imagem"]')
    const arquivosParaExcluir = []

    componentesImagem.forEach(comp => {
        if (comp.dataset.filename) {
            arquivosParaExcluir.push(comp.dataset.filename)
        }
    })
    if (arquivosParaExcluir.length === 0) {
        console.log('Nenhuma imagem para escluir')
        window.location.href = '/'
        return
    }

    const { data, error } = await supabase.storage
        .from('imagensprojeto')
        .remove(arquivosParaExcluir)

    if (error) {
        console.error('Erro ao excluir imagens')
    }
    else {
        console.log('imagens excluidas com sucesso')
    }

    setTimeout(() => {
        window.location.href = '/'
    }, 300)
})
document.getElementById('btnFinalizar').addEventListener('click', () => {
    document.getElementById('modal-confirmacao').classList.remove('hidden')
});

document.getElementById('btn-sim').addEventListener('click', async () => {
    const sucesso = await salvarProjetoBanco()
    const modalSucesso = document.getElementById('modal-sucesso')
    const mensagemModal = document.getElementById('mensagemModal')

    if (sucesso) {
        mensagemModal.textContent = 'Projeto salvo com sucesso!'
        modalSucesso.classList.remove('hidden')

        const user = auth.currentUser

        if (user) {
            setTimeout(() => {
                window.location.href = `/perfil?id=${user.uid}`
            }, 1000)
        }
    }
    else {
        mensagemModal.textContent = 'Erro ao salvar projeto'
    }
    document.getElementById('modal-confirmacao').classList.add('hidden')
    modalSucesso.classList.remove('hidden')

})

document.getElementById('btn-nao').addEventListener('click', () => {
    document.getElementById('modal-confirmacao').classList.add('hidden')
})