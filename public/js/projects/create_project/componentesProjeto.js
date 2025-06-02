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
        } else if (tipo === 'imagem') {

            const inputImagem = document.createElement('input');
            inputImagem.type = 'file';
            inputImagem.accept = 'image/*';
            inputImagem.style.display = "none";

            const divUpload = document.createElement("div");
            divUpload.style.width = "100%";
            divUpload.style.padding = "30px";
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
                    img.style.maxWidth = '100%'
                    img.style.maxHeight = '300px'
                    img.style.borderRadius = '8px'
                    img.style.marginTop = '10px'
                    divUpload.appendChild(img)

                    componente.dataset.imgUrl = publicUrl
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
            item.style.borderColor = '#555'; // Cor padrão de borda
            item.style.backgroundColor = '#1e1e1e'; // Cor padrão de fundo
        });

        componente.style.borderColor = '#ffcc00';
        componente.style.backgroundColor = '#333';
        componente.classList.add('componente')
        // Destacar a camada selecionada
        camada.style.borderColor = '#ffcc00';
        camada.style.backgroundColor = '#333';
        camada.classList.add('selecionado'); // Marcar camada como selecionada

        // Destacar o componente selecionado e marcá-lo como selecionado
        if (componente) {
            componente.style.borderColor = '#ffcc00';
            componente.style.backgroundColor = '#333';
            componente.classList.add('selecionado');
        }
        if (componente.contentEditable === "true") {
            document.getSelection().removeAllRanges();  // Remove seleção atual
            componente.focus();  // Coloca o foco no componente
        }
        if (componente.dataset.tipo === "imagem") {
            const divUpload = componente._divUpload;
            const inputImagem = componente._inputImagem;

            if (divUpload && inputImagem) {
                console.log("Selecionando componente de imagem");

                divUpload.style.borderColor = '#ffcc00';
                divUpload.style.backgroundColor = '#333';
                divUpload.classList.add('componente', 'selecionado');

                inputImagem.classList.add('componente', 'selecionado');
            }
        }

    }


    // Sincronizando a ordem entre as áreas 
    new Sortable(areaCamada, {
        animation: 150,
        onEnd: () => {
            const novaOrdem = [...areaCamada.children].map(div => div.dataset.id);
            const componentesOrdenados = novaOrdem.map(id =>
                areaComponentes.querySelector(`[data-id="${id}"]`)
            );

            areaComponentes.innerHTML = '';
            componentesOrdenados.forEach(comp => areaComponentes.appendChild(comp));
        }
    });

    // Habilitar arraste também na área de componentes
    new Sortable(areaComponentes, {
        animation: 150,
        onEnd: () => {
            const novaOrdem = [...areaComponentes.children].map(div => div.dataset.id);
            const camadasOrdenadas = novaOrdem.map(id =>
                areaCamada.querySelector(`[data-id="${id}"]`)
            );

            areaCamada.innerHTML = '';
            camadasOrdenadas.forEach(comp => areaCamada.appendChild(comp));
        }
    });
});

function formatarTexto(comando, valor = null) {
    if (valor) {
        document.execCommand(comando, false, valor);
    } else {
        document.execCommand(comando, false, null);
    }
}
export function getEstadoElementos() {
    const areaComponentes = document.querySelector('.content') // <- define aqui

    const componentes = [...areaComponentes.children].map(componente => {
        const id = componente.dataset.id
        const tipo = componente.dataset.tipo

        let conteudo

        if (tipo === 'texto') {
            conteudo = componente.innerHTML.trim()
        }
        else if (tipo === 'imagem') {
            conteudo = componente.dataset.imgUrl || null
        }
        return { id, tipo, conteudo }
    })
    return componentes
}


