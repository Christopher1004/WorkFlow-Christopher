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
                    <div class="PTitulo pd-y-3 w-full">
                        <h1 class="text-3xl text-white mg-0">Cores adicionadas</h1>
                    </div>
                    <div class="Pcores pd-y-3 w-full">
                        <div class="row flex flex-row gap-3 mg-b-2">
                            <div class="color flex justify-start items-end w-full pd-2 rounded-lg"
                                style="background-color: #3498db; height: 150px;">
                                <h1 class="colorCode text-xl font-medium mg-0">#3498db</h1>
                            </div>
                            <div class="color flex justify-start items-end w-full pd-2 rounded-lg"
                                style="background-color: #e74c3c; height: 150px;">
                                <h1 class="colorCode text-xl font-medium mg-0">#e74c3c</h1>
                            </div>
                        </div>
                    </div>`;
                break;
        }
        contentProject.insertAdjacentHTML('beforeend', html);

        const componentes = contentProject.querySelectorAll('.componente-removivel')
        const novaComp = componentes[componentes.length -1]

        novaComp.scrollIntoView({ behavior: 'smooth', block: 'center'})

        novaComp.classList.add('highlight')
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
