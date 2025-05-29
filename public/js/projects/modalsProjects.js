const cards = document.querySelectorAll('.card_projeto');

cards.forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Correção aqui
    });
});

const modal = document.getElementById('modal');
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaura o scroll ao fechar
    }
});

const botoesCategorias = document.querySelector('.categorias')

botoesCategorias.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON'){
        botoesCategorias.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('button_categoria-active')
            btn.classList.add('button_categoria')
        })

        event.target.classList.add('button_categoria-active')
        event.target.classList.remove('button_categoria')
    }
})