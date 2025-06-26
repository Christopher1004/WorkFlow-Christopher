import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

const supabase = createClient(supabaseURL, supabaseChave)

document.addEventListener('DOMContentLoaded', () => {
    const textoButton = document.querySelector('.texto');
    const imagemButton = document.querySelector('.imagem');
    const areaComponentes = document.querySelector('.content');
    const areaCamada = document.querySelector('.camadaArea');

    let idCounter = 0;  // Contador para ids únicos

    // Função para adicionar elementos
    function addElemento(tipo) {
        idCounter++;

        // Criar div do componente
        const componente = document.createElement('div');
        componente.dataset.id = idCounter;
        componente.dataset.tipo = tipo;

        // Adicionar estilos e conteúdo conforme o tipo
        if (tipo === 'texto') {
            componente.contentEditable = true;
            componente.innerText = 'Digite seu texto aqui';
            componente.classList.add('componenteTexto');
            componente.style.width = "100%";
            componente.style.padding = "12px 16px";
            componente.style.border = "1.5px solid #444";
            componente.style.borderRadius = "8px";
            componente.style.backgroundColor = "#1e1e1e";
            componente.style.color = "#fff";
            componente.style.fontSize = "16px";
            componente.style.fontFamily = "sans-serif";
            componente.style.outline = "none";
            componente.style.minHeight = "40px";
            componente.style.marginBottom = "1px";
            componente.contentEditable = 'true'

        } else if (tipo === 'imagem') {

            const inputImagem = document.createElement('input');
            inputImagem.type = 'file';
            inputImagem.accept = 'image/*';
            inputImagem.style.display = "none";

            const divUpload = document.createElement("div");
            divUpload.style.width = "100%";
            divUpload.style.padding = "15px";
            divUpload.style.border = "2px solid #555";
            divUpload.style.borderRadius = "10px";
            divUpload.style.backgroundColor = "#1e1e1e";
            divUpload.style.color = "#bbb";
            divUpload.style.textAlign = "center";
            divUpload.style.cursor = "pointer";
            divUpload.style.fontFamily = "sans-serif";
            divUpload.textContent = "Clique para adicionar uma imagem";
            divUpload.style.marginBottom = "1px";

            divUpload.addEventListener("click", () => {
                inputImagem.click();
            });

            inputImagem.addEventListener("change", async () => {
                if (inputImagem.files.length > 0) {
                    const file = inputImagem.files[0];

                    const filename = `${Date.now()}_${file.name}`

                    const { data, error } = await supabase.storage
                        .from('imagensprojeto')
                        .upload(filename, file, {
                            cacheControl: '3600',
                            upsert: false

                        })

                    if (error) {
                        console.error('Erro ao fazer upload no firebase:', error.message)
                        return
                    }

                    const publicUrl = supabase.storage
                        .from('imagensprojeto')
                        .getPublicUrl(filename).data.publicUrl

                    divUpload.innerHTML = ''
                    const img = document.createElement('img')
                    img.src = publicUrl
                    img.style.maxHeight = '1000px'
                    img.style.width = '100%'
                    img.style.borderRadius = '8px'
                    img.style.marginTop = '10px'
                    divUpload.appendChild(img)

                    componente.dataset.imgUrl = publicUrl
                    componente.dataset.filename = filename
                }
            });
            componente.classList.add('componente');
            componente.appendChild(inputImagem);
            componente.appendChild(divUpload);
            componente._divUpload = divUpload;
            componente._inputImagem = inputImagem;
        }

        areaComponentes.appendChild(componente);

        const camada = document.createElement('div');
        camada.dataset.id = idCounter;
        camada.textContent = tipo;
        camada.classList.add('camada');
        camada.style.height = '40px';
        camada.style.width = '100%';
        camada.style.backgroundColor = '#1e1e1e';
        camada.style.margin = '2px';
        camada.style.border = '1px solid rgb(87, 87, 87)';
        camada.style.display = 'flex';
        camada.style.borderRadius = '10px';
        camada.style.justifyContent = 'center';
        camada.style.alignItems = 'center';

        // Evento de clique para selecionar camada
        camada.addEventListener('click', () => {
            selectComponente(camada, componente);
        });
        areaCamada.appendChild(camada);
    }

    // Evento para adicionar um componente de texto
    textoButton.addEventListener('click', () => {
        addElemento('texto');
    });

    // Evento para adicionar um componente de imagem
    imagemButton.addEventListener('click', () => {
        addElemento('imagem');
    });




    function selectComponente(camada, componente) {
        const componentesSelecionados = document.querySelectorAll('.componente.selecionado');
        componentesSelecionados.forEach(item => {
            item.classList.remove('selecionado');
            item.style.borderColor = '#555'; // Cor padrão de borda
            item.style.backgroundColor = '#1e1e1e'; // Cor padrão de fundo
        });

        const camadasSelecionadas = document.querySelectorAll('.camada.selecionado');
        camadasSelecionadas.forEach(item => {
            item.classList.remove('selecionado');
            item.style.borderColor = '#555';
            item.style.backgroundColor = '#1e1e1e';
        });

        componente.style.borderColor = '#726fd2';
        componente.style.backgroundColor = '#333';
        componente.classList.add('componente')
        camada.style.borderColor = '#726fd2';
        camada.style.backgroundColor = '#333';
        camada.classList.add('selecionado');


        if (componente) {
            componente.style.borderColor = '#726fd2';
            componente.style.backgroundColor = '#333';
            componente.classList.add('selecionado');
        }
        if (componente.contentEditable === "true") {
            document.getSelection().removeAllRanges();
            componente.focus();
        }
        if (componente.dataset.tipo === "imagem") {
            const divUpload = componente._divUpload;
            const inputImagem = componente._inputImagem;

            if (divUpload && inputImagem) {

                divUpload.style.borderColor = '#726fd2';
                divUpload.style.backgroundColor = '#333';
                divUpload.classList.add('componente', 'selecionado');

                inputImagem.classList.add('componente', 'selecionado');
            }
        }

    }
    new Sortable(areaCamada, {
        animation: 150,
        onEnd: () => {
            const novaOrdem = [...areaCamada.children].map(div => div.dataset.id);

            // Para cada id na nova ordem, movemos o componente correspondente para o final da área
            novaOrdem.forEach(id => {
                const comp = areaComponentes.querySelector(`[data-id="${id}"]`);
                if (comp) {
                    areaComponentes.appendChild(comp);
                } else {
                    console.warn(`Componente com id ${id} não encontrado.`);
                }
            });
        }
    });

    new Sortable(areaComponentes, {
        animation: 150,
        onEnd: () => {
            const novaOrdem = [...areaComponentes.children].map(div => div.dataset.id);

            novaOrdem.forEach(id => {
                const camada = areaCamada.querySelector(`[data-id="${id}"]`);
                if (camada) {
                    areaCamada.appendChild(camada);
                } else {
                    console.warn(`Camada com id ${id} não encontrada.`);
                }
            });
        }
    });

});

export function getEstadoElementos() {
    const componentes = document.querySelectorAll('.content > div');
    const estado = [];

    componentes.forEach((elemento, index) => {
        const tipo = elemento.dataset.tipo;

        let conteudo = null;

        if (tipo === 'texto') {
            conteudo = elemento.innerHTML || "";
        }
        else if (tipo === 'imagem') {
            conteudo = elemento.dataset.imgUrl || null
        }
        else {
            conteudo = elemento.textContent || "";
        }

        estado.push({
            id: elemento.dataset.id,
            tipo,
            conteudo,
            ordem: index,
            projectId: elemento.dataset.projectId || null,
        });
    });

    return estado;
}
export function renderizarComponente({ id, tipo, conteudo }) {
    const componente = document.createElement('div');
    componente.dataset.id = id;
    componente.dataset.tipo = tipo;

    if (tipo === 'texto') {
        componente.classList.add('componenteTexto');
        componente.innerHTML = conteudo;
        componente.style.width = "100%";
        componente.style.padding = "12px 16px";
        componente.style.border = "1.5px solid #444";
        componente.style.borderRadius = "8px";
        componente.style.backgroundColor = "#1e1e1e";
        componente.style.color = "#fff";
        componente.style.fontSize = "16px";
        componente.style.fontFamily = "sans-serif";
        componente.style.minHeight = "40px";
    } else if (tipo === 'imagem') {
        const img = document.createElement('img');
        img.src = conteudo;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '300px';
        img.style.borderRadius = '8px';
        img.style.maxHeight = '1000px'
        img.style.width = '100%'
        img.style.borderRadius = '8px'
        img.style.marginTop = '10px'

        componente.appendChild(img);
    }

    return componente;
}

const inputCapa = document.getElementById('capa')
const divCapaPreview = document.getElementById('capaPreview')

divCapaPreview.addEventListener('click', () => inputCapa.click())

inputCapa.addEventListener('change', async () => {
    if (inputCapa.files.length > 0) {
        const file = inputCapa.files[0]
        const filename = `${Date.now()}_${file.name}`

        const { data, error } = await supabase.storage
            .from('imagensprojeto')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            console.error('Erro ao fazer upload no supabase ', error.message)
            return
        }
        const publicUrl = supabase.storage
            .from('imagensprojeto')
            .getPublicUrl(filename).data.publicUrl

        divCapaPreview.innerHTML = ''
        const img = document.createElement('img')
        img.src = publicUrl
        img.style.width = '100%'
        img.style.maxWidth = '500px'
        img.style.height = '350px'
        divCapaPreview.appendChild(img)

        divCapaPreview.dataset.imgUrl = publicUrl


    }
})

export function renderizarComponenteComCamada({ id, tipo, conteudo }) {
    const areaComponentes = document.querySelector('.content');
    const areaCamada = document.querySelector('.camadaArea');

    let componente;

    if (tipo === 'imagem') {
        componente = document.createElement('div');
        componente.dataset.id = id;
        componente.dataset.tipo = tipo;

        // Criar input de upload escondido
        const inputImagem = document.createElement('input');
        inputImagem.type = 'file';
        inputImagem.accept = 'image/*';
        inputImagem.style.display = 'none';

        // Div clicável para upload
        const divUpload = document.createElement('div');
        divUpload.style.width = "100%";
        divUpload.style.padding = "15px";
        divUpload.style.border = "2px solid #555";
        divUpload.style.borderRadius = "10px";
        divUpload.style.backgroundColor = "#1e1e1e";
        divUpload.style.color = "#bbb";
        divUpload.style.textAlign = "center";
        divUpload.style.cursor = "pointer";
        divUpload.style.fontFamily = "sans-serif";
        divUpload.style.marginBottom = "1px";

        // Se tiver URL da imagem, mostrar a imagem dentro da div
        if (conteudo) {
            const img = document.createElement('img');
            img.src = conteudo;
            img.style.maxHeight = '1000px';
            img.style.width = '100%';
            img.style.borderRadius = '8px';
            img.style.marginTop = '10px';
            divUpload.appendChild(img);

            // Salvar no dataset para poder salvar depois
            componente.dataset.imgUrl = conteudo;
            // Você pode salvar o filename também, se quiser gerenciar exclusão
        } else {
            divUpload.textContent = "Clique para adicionar uma imagem";
        }

        // Quando clicar no div, abre input para trocar a imagem
        divUpload.addEventListener('click', () => {
            inputImagem.click();
        });

        // Evento para trocar imagem e fazer upload
        inputImagem.addEventListener('change', async () => {
            if (inputImagem.files.length > 0) {
                const file = inputImagem.files[0];
                const filename = `${Date.now()}_${file.name}`;

                const { data, error } = await supabase.storage
                    .from('imagensprojeto')
                    .upload(filename, file, { cacheControl: '3600', upsert: false });

                if (error) {
                    console.error('Erro no upload da imagem:', error.message);
                    return;
                }

                const publicUrl = supabase.storage
                    .from('imagensprojeto')
                    .getPublicUrl(filename).data.publicUrl;

                // Limpa e atualiza preview da imagem
                divUpload.innerHTML = '';
                const img = document.createElement('img');
                img.src = publicUrl;
                img.style.maxHeight = '1000px';
                img.style.width = '100%';
                img.style.borderRadius = '8px';
                img.style.marginTop = '10px';
                divUpload.appendChild(img);

                // Atualiza dataset para salvar a nova imagem
                componente.dataset.imgUrl = publicUrl;
                componente.dataset.filename = filename;
            }
        });

        componente.appendChild(inputImagem);
        componente.appendChild(divUpload);

        componente.classList.add('componente');
    } else {
        // Seu código atual para outros tipos (texto etc)
        componente = renderizarComponente({ id, tipo, conteudo });
        if (tipo === 'texto') {
            componente.contentEditable = true;
            componente.style.outline = 'none';
        }
        componente.dataset.id = id;
    }

    // Criar camada igual antes
    const camada = document.createElement('div');
    camada.dataset.id = id;
    camada.textContent = tipo;
    camada.classList.add('camada');
    camada.style.height = '40px';
    camada.style.width = '100%';
    camada.style.backgroundColor = '#1e1e1e';
    camada.style.margin = '2px 0';
    camada.style.border = '1px solid rgb(87, 87, 87)';
    camada.style.display = 'flex';
    camada.style.borderRadius = '10px';
    camada.style.justifyContent = 'center';
    camada.style.alignItems = 'center';

    camada.addEventListener('click', () => {
        // Remove seleção anterior
        document.querySelectorAll('.componente.selecionado').forEach(el => {
            el.classList.remove('selecionado');
            el.style.borderColor = '#555';
            el.style.backgroundColor = '#1e1e1e';
        });
        document.querySelectorAll('.camada.selecionado').forEach(el => {
            el.classList.remove('selecionado');
            el.style.borderColor = '#555';
            el.style.backgroundColor = '#1e1e1e';
        });

        componente.style.borderColor = '#726fd2';
        componente.style.backgroundColor = '#333';
        componente.classList.add('selecionado');

        camada.style.borderColor = '#726fd2';
        camada.style.backgroundColor = '#333';
        camada.classList.add('selecionado');

        if (tipo === 'texto') {
            componente.focus();
            document.getSelection().removeAllRanges();
        }
    });

    areaComponentes.appendChild(componente);
    areaCamada.appendChild(camada);

    return { componente, camada };
}

