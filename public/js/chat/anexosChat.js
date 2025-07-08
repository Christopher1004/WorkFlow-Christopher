import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

const btnAnexos = document.getElementById("btnAnexos");
const menuAnexos = document.getElementById("menuAnexos");

btnAnexos.addEventListener("click", (e) => {
    e.stopPropagation();
    menuAnexos.classList.toggle("show");
});

document.addEventListener("click", () => {
    menuAnexos.classList.remove("show");
});

const btnAnexarImagem = document.getElementById("anexarImagem");
const inputImagem = document.getElementById("inputImagemOculto");
const previewImagem = document.getElementById("previewImagem");
const previewContainer = document.getElementById("previewImagemContainer");
const btnFecharPreview = document.getElementById("fecharPreview");
const btnEnviar = document.getElementById("btnEnviar");
const messages = document.querySelector('.messages');
const inputMensagem = document.querySelector('.input-area input[type="text"]');

let imagemSelecionada = null;


btnAnexarImagem.addEventListener("click", () => {
    inputImagem.click();
});


inputImagem.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
            previewImagem.src = reader.result;
            previewContainer.style.display = "flex";
            messages.classList.add("no-scroll"); 
            imagemSelecionada = file;
        };
        reader.readAsDataURL(file);
    }
});


btnFecharPreview.addEventListener("click", () => {
    previewContainer.style.display = "none";
    previewImagem.src = "";
    inputImagem.value = "";
    imagemSelecionada = null;
    messages.classList.remove("no-scroll"); 
});

btnEnviar.addEventListener("click", () => {
    const texto = inputMensagem.value.trim();

    if (imagemSelecionada) {
        console.log("Imagem enviada:", imagemSelecionada);

        
        const imgElement = document.createElement("img");
        imgElement.src = previewImagem.src;
        imgElement.style.maxWidth = "200px";
        imgElement.style.margin = "10px 0";
        document.body.appendChild(imgElement); 

        imagemSelecionada = null;
        previewImagem.src = "";
        previewContainer.style.display = "none";
        inputImagem.value = "";
        messages.classList.remove("no-scroll");
    }

    if (texto !== "") {
        console.log("Mensagem de texto enviada:", texto);
        inputMensagem.value = "";
    }
});
