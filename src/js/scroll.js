document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.categorias');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const scrollAmount = 200; // Adjust this value to control scroll distance

    prevBtn.addEventListener('click', () => {
        container.scrollLeft -= scrollAmount;
    });

    nextBtn.addEventListener('click', () => {
        container.scrollLeft += scrollAmount;
    });
});