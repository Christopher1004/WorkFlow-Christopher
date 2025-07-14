import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { destinatarioId } from "./chat.js";
import { censurarTexto } from "/js/chat/censurarPalavroes.js";

const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co";
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE";
const supabase = createClient(supabaseURL, supabaseChave);

const db = getDatabase();
const auth = getAuth();

const btnAnexos = document.getElementById("btnAnexos");
const menuAnexos = document.getElementById("menuAnexos");
const btnAnexarImagem = document.getElementById("anexarImagem");

const btnAnexarLink = document.getElementById("anexarLink");
const modalLink = document.getElementById("modalLink");
const inputLink = document.getElementById("inputLink");
const btnCancelarLink = document.getElementById("cancelarLink");
const btnConfirmarLink = document.getElementById("confirmarLink");

const inputImagem = document.getElementById("inputImagemOculto");
const previewImagem = document.getElementById("previewImagem");
const previewContainer = document.getElementById("previewImagemContainer");
const btnFecharPreview = document.getElementById("fecharPreview");
const btnEnviar = document.getElementById("btnEnviar");
const messages = document.querySelector(".messages");
const inputMensagem = document.querySelector('.input-area input[type="text"]');

const indicadorLink = document.getElementById('link-anexado-indicador');
const btnRemoverLink = document.getElementById('remover-link');

let imagemSelecionada = null;
let imagemSupabasePath = null;
let imagemURLPublica = null;
let linkSelecionado = null;

btnAnexos.addEventListener("click", (e) => {
    e.stopPropagation();
    menuAnexos.classList.toggle("show");
});
document.addEventListener("click", () => {
    menuAnexos.classList.remove("show");
});

btnAnexarImagem.addEventListener("click", () => {
    inputImagem.click();
});

inputMensagem.addEventListener('keydown', (event) => {
    if(event.key === "Enter" && !event.shiftKey){
        event.preventDefault()
        btnEnviar.click()
    }
})

inputMensagem.addEventListener("input", () => {
    const valor = inputMensagem.value.trim();
    const preview = document.getElementById("previewLink");

    if (valor === linkSelecionado) {
        preview.innerHTML = `
            <div style="background:#1e1e1e; padding:8px; border-radius:6px; margin-bottom:5px; color:#4EAFFF; display:flex; align-items:center; justify-content:space-between;">
                <a href="${linkSelecionado}" target="_blank" style="text-decoration: underline; color: #4EAFFF;">${linkSelecionado}</a>
                <button id="removerPreviewLink" style="margin-left:10px; background:none; border:none; color:#aaa; font-weight:bold; cursor:pointer;">✖</button>
            </div>
        `;
        preview.style.display = "block";

        document.getElementById("removerPreviewLink").onclick = () => {
            linkSelecionado = null;
            preview.innerHTML = "";
            preview.style.display = "none";
            inputMensagem.value = "";
        };
    } else if (valor.startsWith("http")) {
        linkSelecionado = valor;
        preview.innerHTML = `
            <div style="background:#1e1e1e; padding:8px; border-radius:6px; margin-bottom:5px; color:#4EAFFF; display:flex; align-items:center; justify-content:space-between;">
                <a href="${valor}" target="_blank" style="text-decoration: underline; color: #4EAFFF;">${valor}</a>
                <button id="removerPreviewLink" style="margin-left:10px; background:none; border:none; color:#aaa; font-weight:bold; cursor:pointer;">✖</button>
            </div>
        `;
        preview.style.display = "block";

        document.getElementById("removerPreviewLink").onclick = () => {
            linkSelecionado = null;
            preview.innerHTML = "";
            preview.style.display = "none";
            inputMensagem.value = "";
        };
    } else {
        preview.innerHTML = "";
        preview.style.display = "none";
        linkSelecionado = null;
    }
});


inputImagem.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    imagemSelecionada = file;

    const reader = new FileReader();
    reader.onload = () => {
        previewImagem.src = reader.result;
        previewContainer.style.display = "flex";
        messages.classList.add("no-scroll");
    };
    reader.readAsDataURL(file);

    const user = auth.currentUser;
    if (!user) return;

    const nomeUnico = `${user.uid}_${Date.now()}_${file.name}`;
    imagemSupabasePath = nomeUnico;

    const { error } = await supabase.storage.from("imagensprojeto").upload(nomeUnico, file);
    if (error) {
        console.error("Erro ao subir imagem:", error);
        alert("Erro ao subir imagem.");
        imagemSelecionada = null;
        imagemSupabasePath = null;
        return;
    }

    const { data: publicData } = supabase.storage.from("imagensprojeto").getPublicUrl(nomeUnico);
    imagemURLPublica = publicData.publicUrl;
});

btnFecharPreview.addEventListener("click", async () => {
    if (imagemSupabasePath) {
        await supabase.storage.from("imagensprojeto").remove([imagemSupabasePath]);
    }

    imagemSelecionada = null;
    imagemSupabasePath = null;
    imagemURLPublica = null;
    previewImagem.src = "";
    previewContainer.style.display = "none";
    inputImagem.value = "";
    messages.classList.remove("no-scroll");
});

btnAnexarLink.addEventListener("click", () => {
    modalLink.style.display = "block";
    inputLink.value = "";
    inputLink.focus();
});

btnCancelarLink.addEventListener("click", () => {
    modalLink.style.display = "none";
    linkSelecionado = null;
});

btnConfirmarLink.addEventListener("click", () => {
    const url = inputLink.value.trim();
    if (!url || !url.startsWith("http")) {
        alert("Por favor, insira um link válido começando com http");
        return;
    }

    linkSelecionado = url;
    inputMensagem.value = url;

    const preview = document.getElementById("previewLink");
    preview.innerHTML = `
        <div style="background:#1e1e1e; padding:8px; border-radius:6px; margin-bottom:5px; color:#4EAFFF; display:flex; align-items:center; justify-content:space-between;">
            <a href="${url}" target="_blank" style="text-decoration: underline; color: #4EAFFF;">${url}</a>
            <button id="removerPreviewLink" style="margin-left:10px; background:none; border:none; color:#aaa; font-weight:bold; cursor:pointer;">✖</button>
        </div>
    `;
    preview.style.display = "block";
    modalLink.style.display = "none";
    inputMensagem.focus();

    document.getElementById("removerPreviewLink").onclick = () => {
        linkSelecionado = null;
        preview.innerHTML = "";
        preview.style.display = "none";
        inputMensagem.value = "";
    };
});

function aguardarUploadImagem(timeout = 10000) {
    return new Promise((resolve, reject) => {
        const inicio = Date.now();

        const verificar = () => {
            if (imagemURLPublica) return resolve();
            if (Date.now() - inicio > timeout) return reject("Tempo limite excedido para upload da imagem");
            setTimeout(verificar, 100);
        };

        verificar();
    });
}

btnEnviar.addEventListener("click", async () => {
    const textoOriginal = inputMensagem.value.trim();
    const texto = censurarTexto(textoOriginal);
    const user = auth.currentUser;
    if (!user || !destinatarioId) return;

    const remetenteId = user.uid;

    if (imagemSelecionada && !imagemURLPublica) {
        try {
            btnEnviar.disabled = true;
            btnEnviar.textContent = "Aguardando imagem...";
            await aguardarUploadImagem();
        } catch (err) {
            alert("Erro ao enviar imagem: " + err);
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar";
            return;
        }
    }

    if (!texto && !imagemURLPublica && !linkSelecionado) {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar";
        return;
    }

    let linkFinal = null;
    let textoFinal = texto;

    if (linkSelecionado && texto === linkSelecionado) {
        linkFinal = linkSelecionado;
        textoFinal = "";
    }

    const novaMsgRef1 = push(ref(db, `Conversas/${remetenteId}/${destinatarioId}/mensagens`));
    const novaMsgRef2 = push(ref(db, `Conversas/${destinatarioId}/${remetenteId}/mensagens`));

    const mensagem = {
        texto: textoFinal || "",
        imagem: imagemURLPublica || null,
        link: linkFinal,
        autor: remetenteId,
        timestamp: serverTimestamp()
    };

    await set(novaMsgRef1, mensagem);
    await set(novaMsgRef2, mensagem);

    imagemSelecionada = null;
    imagemSupabasePath = null;
    imagemURLPublica = null;
    linkSelecionado = null;

    inputMensagem.value = "";
    inputImagem.value = "";
    previewImagem.src = "";
    previewContainer.style.display = "none";
    messages.classList.remove("no-scroll");

    const preview = document.getElementById("previewLink");
    preview.innerHTML = "";
    preview.style.display = "none";

    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar";
});
