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