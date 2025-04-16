document.addEventListener('DOMContentLoaded', () => {
    const proximoButton = document.querySelector('.proximo');
    const modalSalvar = document.querySelector('.modalSalvar');
    const body = document.body;

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    body.appendChild(modalOverlay);

    // Show modal function
    function showModal() {
        modalOverlay.classList.add('show');
        modalSalvar.classList.add('show');
    }

    // Hide modal function
    function hideModal() {
        modalOverlay.classList.remove('show');
        modalSalvar.classList.remove('show');
    }

    // Event listeners
    proximoButton.addEventListener('click', showModal);
    modalOverlay.addEventListener('click', hideModal);
})