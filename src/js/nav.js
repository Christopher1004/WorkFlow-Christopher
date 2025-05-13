let lastScroll = window.scrollY;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.scrollY;
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.classList.add('navbar--hidden');
    } else {
        // Scrolling up
        navbar.classList.remove('navbar--hidden');
    }
    
    lastScroll = currentScroll;
});