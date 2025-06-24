import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

const supabase = createClient(supabaseURL, supabaseChave);

import { getDatabase,  update,ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";

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
const database = getDatabase(app);

const inputFoto = document.getElementById("inputFoto");
const profilePic = document.getElementById("profilePic");
const placeholder = document.getElementById("placeholder");

inputFoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            profilePic.style.backgroundImage = `url('${reader.result}')`;
            placeholder.classList.add("hidden");
        };
        reader.readAsDataURL(file);
    }
});

const urlParams = new URLSearchParams(window.location.search)
const userId = urlParams.get('userId')

if (!userId) {
    window.location.href = '/login'
    throw new Erro('Usuário não indentificado')
}
else {
    const dbRef = ref(database);

    let tipo = null;
    const freelancerSnap = await get(child(dbRef, `Freelancer/${userId}`));
    if (freelancerSnap.exists()) {
        tipo = "Freelancer";
    } else {
        const contratanteSnap = await get(child(dbRef, `Contratante/${userId}`));
        if (contratanteSnap.exists()) {
            tipo = "Contratante";
        }
    }

    if (!tipo) {
        alert("Tipo de usuário não encontrado no banco de dados.")
    }
    document.getElementById("btnSalvar").addEventListener("click", async () => {
        const nome = document.getElementById("nome").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const tag = document.getElementById("profissao").value.trim();

        if (!inputFoto.files[0]) return alert("Selecione uma imagem de perfil.");

        const file = inputFoto.files[0];
        const filePath = `${userId}/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("imagensprojeto")
            .upload(filePath, file, { upsert: false });

        if (error) {
            console.error(error);
            alert("Erro ao fazer upload da imagem.");
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from("imagensprojeto")
            .getPublicUrl(filePath);

        const foto_perfil = publicUrlData.publicUrl;

        await update(ref(database, `${tipo}/${userId}`), {
            nome,
            bio,
            tag,
            foto_perfil
        });

        alert("Perfil salvo com sucesso!");
        window.location.href = "/";
    });
}




