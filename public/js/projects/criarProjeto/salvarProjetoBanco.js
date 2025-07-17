import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { capaUrlGlobal } from "./criarComponente.js";

export async function salvarProjetoFirebase() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        alert('Usuário não autenticado!');
        return;
    }
    const userId = user.uid;

    const titulo = document.getElementById('tituloFinal').value.trim();
    const tags = document.getElementById('tagsFinal').value.trim();

    if (!titulo || !tags || !capaUrlGlobal) {
        alert('Preencha todos os campos e selecione uma imagem de capa!');
        return;
    }

    let capaUrl = capaUrlGlobal;

    const db = getDatabase();
    const projetosRef = ref(db, 'Projetos');
    const novoProjetoRef = push(projetosRef);

    const projectId = novoProjetoRef.key;

    const projetoData = {
        userId,
        titulo,
        tags,
        capaUrl,
        dataCriacao: new Date().toISOString()
    };

    await set(novoProjetoRef, projetoData);

    const componentes = document.querySelectorAll('#contentProject > div');

    let index = 0

    for (const componente of componentes) {
        const tipo = componente.getAttribute('data-tipo');
        console.log(`Processando componente do tipo: ${tipo}`);

        let conteudo;

        try {
            if (tipo === 'texto') {
                const p = componente.querySelector('p');
                conteudo = p?.textContent.trim() || '';
            } else if (tipo === 'titulo') {
                const h1 = componente.querySelector('h1');
                conteudo = h1?.textContent.trim() || '';
            } else if (tipo === 'imagem') {
                const img = componente.querySelector('img');
                const src = img?.src || '';

                conteudo = src;
            } else if (tipo === 'paleta') {
                const cores = componente.querySelectorAll('[data-cor]');
                conteudo = Array.from(cores).map(c => c.getAttribute('data-cor'));
            }

            if (!conteudo || conteudo.length === 0) {
                console.warn('Conteúdo vazio, pulando.');
                continue;
            }

            const componenteData = {
                projectId,
                tipo,
                conteudo
            };

            const componentesRef = ref(db, `componentesProjeto/${projectId}/${index}`);
            await set (componentesRef, componenteData)
            index++
        } catch (error) {
            console.error(`Erro ao processar componente do tipo ${tipo}:`, error);
            continue;
        }
    }
}