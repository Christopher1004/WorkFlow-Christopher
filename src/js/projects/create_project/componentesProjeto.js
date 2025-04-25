document.addEventListener('DOMContentLoaded', () => {
    const textoButton = document.querySelector('.texto');
    const imagemButton = document.querySelector('.imagem');
    const areaComponentes = document.querySelector('.content');

    textoButton.addEventListener('click', () => {
        const inputTexto = document.createElement('input');
        inputTexto.type = 'text';
        inputTexto.placeholder = 'Digite seu texto aqui';

        inputTexto.style.width = "100%";
        inputTexto.style.padding = "12px 16px";
        inputTexto.style.border = "1.5px solid #444";
        inputTexto.style.borderRadius = "8px";
        inputTexto.style.backgroundColor = "#1e1e1e";
        inputTexto.style.color = "#fff";
        inputTexto.style.fontSize = "16px";
        inputTexto.style.fontFamily = "sans-serif";
        inputTexto.style.outline = "none";

        areaComponentes.appendChild(inputTexto);
    });

    imagemButton.addEventListener('click', () => {
        const inputImagem = document.createElement('input');
        inputImagem.type = 'file';
        inputImagem.accept = 'image/*';
        inputImagem.style.display = "none";

        const divUpload = document.createElement("div");
        divUpload.style.width = "100%";
        divUpload.style.padding = "30px";
        divUpload.style.border = "2px dashed #555";
        divUpload.style.borderRadius = "10px";
        divUpload.style.backgroundColor = "#1e1e1e";
        divUpload.style.color = "#bbb";
        divUpload.style.textAlign = "center";
        divUpload.style.cursor = "pointer";
        divUpload.style.fontFamily = "sans-serif";
        divUpload.textContent = "Clique para adicionar uma imagem";

        divUpload.addEventListener("click", () => {
            inputImagem.click();
        })
        inputImagem.addEventListener("change", () => {
            if (inputImagem.files.length > 0) {
                const file = inputImagem.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    divUpload.innerHTML = ""; // Limpa texto anterior
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.maxWidth = "100%";
                    img.style.maxHeight = "200px";
                    img.style.borderRadius = "8px";
                    img.style.marginTop = "10px";
                    divUpload.appendChild(img);
                };

                reader.readAsDataURL(file);
            }
        });


        areaComponentes.appendChild(inputImagem);
        areaComponentes.appendChild(divUpload)
    });
});