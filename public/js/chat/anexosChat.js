const btnAnexos = document.getElementById("btnAnexos");
const menuAnexos = document.getElementById("menuAnexos");

btnAnexos.addEventListener("click", (e) => {
    e.stopPropagation();
    menuAnexos.classList.toggle("show");
});

document.addEventListener("click", () => {
    menuAnexos.classList.remove("show");
});

const modalLink = document.getElementById("modalLink");
const modalProjeto = document.getElementById("modalProjeto");

document.getElementById("anexarProjeto").addEventListener("click", abrirModalProjeto);
document.getElementById("anexarLink").addEventListener("click", abrirModalLink);

function abrirModalLink() {
    modalLink.classList.add("show");
}

function abrirModalProjeto() {
    modalProjeto.classList.add("show");
    renderizarProjetos("seus");
}

function confirmarAnexarLink() {
    const link = document.getElementById("inputLink").value;
    if (link) {
        alert("Link anexado: " + link);
    }
    modalLink.classList.remove("show");
}

function trocarAbaProjeto(botao) {
    document.querySelectorAll(".modal-tabs button").forEach(b => b.classList.remove("active"));
    botao.classList.add("active");
    const aba = botao.getAttribute("data-tab");
    renderizarProjetos(aba);
}

function renderizarProjetos(tipo) {
    const projetosContainer = document.getElementById("projetosLista");
    projetosContainer.innerHTML = "";

    const projetos = {
        seus: [
            {
                nome: "Yago",
                imagem: "https://uvvquwlgbkdcnchiyqzs.supabase.co/storage/v1/object/public/imagensprojeto/1750551973627_1.jpg",
                avatar: "https://uvvquwlgbkdcnchiyqzs.supabase.co/storage/v1/object/public/freelancer-photos/Hl4xUuLonsUkbS0m2oEIM8JFeRq1/1750368841923_image.jfif"
            },
            {
                nome: "Yago",
                imagem: "https://uvvquwlgbkdcnchiyqzs.supabase.co/storage/v1/object/public/imagensprojeto/1750551973627_1.jpg",
                avatar: "https://uvvquwlgbkdcnchiyqzs.supabase.co/storage/v1/object/public/freelancer-photos/Hl4xUuLonsUkbS0m2oEIM8JFeRq1/1750368841923_image.jfif"
            },
            {
                nome: "Bruna",
                imagem: "https://via.placeholder.com/400x200?text=Projeto+2",
                avatar: "https://via.placeholder.com/24/ff8800"
            },
            {
                nome: "Lucas",
                imagem: "https://via.placeholder.com/400x200?text=Projeto+3",
                avatar: "https://via.placeholder.com/24/0088ff"
            }
        ],
        curtidos: [
            {
                nome: "Fernanda",
                imagem: "https://via.placeholder.com/400x200?text=Curtido+1",
                avatar: "https://via.placeholder.com/24/cc00ff"
            },
            {
                nome: "João",
                imagem: "https://via.placeholder.com/400x200?text=Curtido+2",
                avatar: "https://via.placeholder.com/24/00ffcc"
            }
        ],
        favoritos: [
            {
                nome: "Rafael",
                imagem: "https://via.placeholder.com/400x200?text=Favorito",
                avatar: "https://via.placeholder.com/24/ff4444"
            }
        ]
    };

    projetos[tipo].forEach(p => {
        const card = document.createElement("div");
        card.className = "projeto-card";
        
        card.innerHTML = `
            <div class='projeto-overlay'>${p.nome}</div>
            <img src="${p.imagem}" alt="Capa" class="projeto-capa">
            <div class="projeto-info">
                <img src="${p.avatar}" alt="Avatar" class="projeto-avatar">
                <span class="projeto-nome">${p.nome}</span>
            </div>
        `;
        projetosContainer.appendChild(card);
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modalLink) modalLink.classList.remove("show");
    if (e.target === modalProjeto) modalProjeto.classList.remove("show");
});

document.querySelectorAll(".modal-tabs button").forEach(button => {
    button.addEventListener("click", function () {
        trocarAbaProjeto(this);
    });
});
