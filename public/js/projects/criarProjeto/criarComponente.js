const cardComponents = document.querySelectorAll('.cardComponent');
const contentProject = document.querySelector('.contentProject');
const modal = document.getElementById('modalComponentes');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('close');
const projetoVazio = document.querySelector('.projetoVazio');
const addButton = document.querySelector('#addComponent button');
const buttonOpen = document.getElementById("addComponent");
const buttonClose = document.getElementById("close");
const overlay = document.getElementById("modalOverlay");

new Sortable(contentProject, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag',
    chosenClass: 'sortable-chosen',
    handle: '.drag-handle'
});


buttonOpen.onclick = function () {
    modal.showModal();
    overlay.classList.add("active");
    setTimeout(() => modal.classList.add("open"), 10);
}

function closeModal() {
    modal.classList.remove("open");
    modal.classList.add("closing");
    overlay.classList.remove("active");
    setTimeout(() => {
        modal.classList.remove("closing");
        modal.close();
    }, 300);
}

buttonClose.onclick = closeModal;
overlay.onclick = closeModal;

modal.addEventListener('cancel', function (event) {
    event.preventDefault();
    closeModal();
});

function verificarProjetoVazio() {
    const temComponentes = contentProject.querySelectorAll('.Ptext, .PTitulo, .Pimage, .Pcores').length > 0;
    projetoVazio.style.display = temComponentes ? 'none' : 'block'
}

cardComponents.forEach(card => {
    card.addEventListener('click', () => {
        const type = card.dataset.component
        let html = ''

        switch (type) {
            case 'texto':
                html = `
                    <div class="Ptext componente-removivel w-full" style="position: relative;">
                        <button class="btn-remover" title="Remover componente">
                            &times;
                        </button>
                        <span class="drag-handle">≡</span>

                        <p class="text-lg">Novo texto adicionado ao projeto.</p>
                    </div>`;
                break;
            case 'titulo':
                html = `
                    <div class="PTitulo pd-y-3 w-full componente-removivel" style="position: relative;">
                    <button class="btn-remover" title="Remover componente">
                        &times;
                    </button>
                    <span class="drag-handle">≡</span>

                    <h1 class="text-3xl text-white mg-0">Novo Título</h1>
                    </div>`;
                break;
            case 'imagem':
                html = `
                    <div class="Pimage w-full componente-removivel" style="position: relative;">
                    <button class="btn-remover" title="Remover componente">
                        &times;
                    </button>
                    <span class="drag-handle">≡</span>

                        <img src="assets/image/createproject/Imagem.jpg" alt="Imagem adicionada" style="width: 100%;">
                    </div>`;
                break;
            case 'paleta':
                html = `
                    <div class="componente-removivel w-full" style="position: relative;">
                        <button class="btn-remover" title="Remover componente">&times;</button>
                        <span class="drag-handle" title="Ordenar componente">≡</span>
                        <div class="PTitulo pd-y-3 w-full">
                        <h1 class="text-3xl text-white mg-0">Cores do Projeto</h1>
                        </div>
                        <div class="Pcores pd-y-3 w-full">
                        <div class="paleta-cores flex flex-row flex-wrap gap-3 mg-b-2">
                            ${gerarBlocoCor('#3498db')}
                            ${gerarBlocoCor('#e74c3c')}
                        </div>
                        <div class="row flex flex-row gap-3 mg-b-2">
                            <button class="btn btn-gray w-full btn-add-cor">Adicionar mais cores</button>
                        </div>
                        </div>
                    </div>
                    `;
        }
        contentProject.insertAdjacentHTML('beforeend', html);
        const componentes = contentProject.querySelectorAll('.componente-removivel')
        const novaComp = componentes[componentes.length - 1]

        novaComp.scrollIntoView({ behavior: 'smooth', block: 'center' })

        novaComp.classList.add('highlight')

        if (type === 'texto') {
            const p = novaComp.querySelector('p')
            configurarEdicaoTexto(p)
        }

        if (type == 'titulo') {
            const h1 = novaComp.querySelector('h1')
            configurarEdicaoTitulo(h1)
        }
        if (type === 'imagem') {
            const img = novaComp.querySelector('img')
            configurarEdicaoImagem(img)
        }
        if (type === 'paleta') {

            const coresContainer = novaComp.querySelector('.paleta-cores');
            coresContainer.querySelectorAll('.cor-editavel').forEach(configurarCorIndividual);

            const blocosCor = novaComp.querySelectorAll('.cor-editavel');
            blocosCor.forEach(bloco => configurarCorIndividual(bloco));

            const btnAddCor = novaComp.querySelector('.btn-add-cor');

            btnAddCor.addEventListener('click', () => {
                const novaCorHTML = gerarBlocoCor('#888888');
                coresContainer.insertAdjacentHTML('beforeend', novaCorHTML);
                const novaCor = coresContainer.lastElementChild;
                configurarCorIndividual(novaCor);
            });
            new Sortable(coresContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                handle: '.drag-handle-cor'
            });
        }
        setTimeout(() => novaComp.classList.remove('highlight'), 2000)
        verificarProjetoVazio()
        closeModal()

        const btnRemover = novaComp.querySelector('.btn-remover')
        btnRemover.addEventListener('click', () => {
            novaComp.remove()
            verificarProjetoVazio()
        })
    })
})

function AtivarModoEdicaoTexto(pElement) {
    const textoAtual = pElement.textContent
    const textArea = document.createElement('textarea')
    textArea.className = 'text-lg'
    textArea.value = textoAtual
    textArea.style.width = '100%'
    textArea.style.minHeight = '80px'

    pElement.replaceWith(textArea)
    textArea.focus()

    function salvarEdicao() {
        const novoTexto = textArea.value.trim()
        const novoP = document.createElement('p')
        novoP.className = 'text-lg'
        novoP.textContent = novoTexto || 'Texto Vazio'
        textArea.replaceWith(novoP)
        configurarEdicaoTexto(novoP
        )
    }
    textArea.addEventListener('blur', salvarEdicao)
    textArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            textArea.blur()
        }
    })
}
function configurarEdicaoTexto(pElement) {
    pElement.addEventListener('dblclick', () => {
        AtivarModoEdicaoTexto(pElement)
    })
}


function configurarEdicaoImagem(imgElement) {
    imgElement.addEventListener('dblclick', () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.style.display = 'none'

        input.addEventListener('change', () => {
            const file = input.files[0]
            if (file) {
                const url = URL.createObjectURL(file)
                imgElement.src = url
            }
        })
        document.body.appendChild(input)
        input.click()
        input.remove()
    })
}

function ativarEdicaoTitulo(h1Element) {
    const textoAtual = h1Element.textContent;
    const input = document.createElement('input');
    input.value = textoAtual;

    input.className = 'text-3xl';
    input.style.width = '100%';
    input.style.backgroundColor = '#1e1e1e';
    input.style.color = 'white';
    input.style.border = '1px solid #555';
    input.style.borderRadius = '4px';
    input.style.padding = '8px';

    h1Element.replaceWith(input);
    input.focus();

    function salvarEdicao() {
        const novoTexto = input.value.trim();
        const novoH1 = document.createElement('h1');
        novoH1.className = 'text-3xl mg-0';
        novoH1.textContent = novoTexto || 'Título vazio';
        input.replaceWith(novoH1);
        configurarEdicaoTitulo(novoH1);
    }

    input.addEventListener('blur', salvarEdicao);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            input.blur();
        }
    });
}

function configurarEdicaoTitulo(h1Element) {
    h1Element.addEventListener('dblclick', () => {
        ativarEdicaoTitulo(h1Element);
    });
}

function gerarBlocoCor(hex) {
    return `
    <div class="color cor-editavel flex justify-start items-end pd-2 rounded-lg" 
         style="background-color: ${hex}; height: 150px; width: calc(50% - 12px); position: relative;">
        <button class="btn-remover-cor" style="
            position: absolute;
            top: 5px;
            right: 5px;
            background: #F84241;
            border: none;
            color: white;
            border-radius: 3px;
            width: 24px;
            height: 24px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        " title="Remover cor">&times;</button>
        <span class="drag-handle-cor" style="
            position: absolute;
            top: 5px;
            left: 5px;
            background: #30BFA5;
            color: white;
            border-radius: 3px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: move;
        " title="Ordenar cor">≡</span>
        <input type="color" value="${hex}" class="input-cor" style="
            position: absolute;
            bottom: 5px;
            left: 5px;
            opacity: 0;
            width: 24px;
            height: 24px;
            cursor: pointer;
        ">
        <h1 class="colorCode text-xl font-medium mg-0">${hex}</h1>
    </div>`;
}


function configurarCorIndividual(bloco) {
    const removerBtn = bloco.querySelector('.btn-remover-cor');
    const dragHandle = bloco.querySelector('.drag-handle-cor');
    const inputCor = bloco.querySelector('.input-cor');
    const label = bloco.querySelector('.colorCode');

    bloco.addEventListener('mouseenter', () => {
        removerBtn.style.opacity = '1';
        dragHandle.style.opacity = '1';
        removerBtn.style.pointerEvents = 'auto';
    });
    bloco.addEventListener('mouseleave', () => {
        removerBtn.style.opacity = '0';
        dragHandle.style.opacity = '0';
        removerBtn.style.pointerEvents = 'none';
    });

    removerBtn.addEventListener('click', () => {
        bloco.remove();
    });

    inputCor.addEventListener('input', () => {
        const novaCor = inputCor.value;
        bloco.style.backgroundColor = novaCor;
        label.textContent = novaCor;
    });

    bloco.addEventListener('dblclick', () => inputCor.click());
}
