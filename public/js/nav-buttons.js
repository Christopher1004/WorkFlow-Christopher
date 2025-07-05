// ===== NAVEGAÇÃO DAS CATEGORIAS =====

document.addEventListener('DOMContentLoaded', function() {
    const categoriasContainer = document.querySelector('.categorias');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    
    if (!categoriasContainer || !btnPrev || !btnNext) return;
    
    const scrollAmount = 300; // Quantidade de pixels para rolar
    let isScrolling = false;
    
    // Função para verificar se pode rolar para a esquerda
    function canScrollLeft() {
        return categoriasContainer.scrollLeft > 0;
    }
    
    // Função para verificar se pode rolar para a direita
    function canScrollRight() {
        return categoriasContainer.scrollLeft < (categoriasContainer.scrollWidth - categoriasContainer.clientWidth);
    }
    
    // Função para atualizar o estado dos botões
    function updateButtonStates() {
        btnPrev.disabled = !canScrollLeft();
        btnNext.disabled = !canScrollRight();
    }
    
    // Função para rolar para a esquerda
    function scrollLeft() {
        if (isScrolling || !canScrollLeft()) return;
        
        isScrolling = true;
        categoriasContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
            updateButtonStates();
        }, 500);
    }
    
    // Função para rolar para a direita
    function scrollRight() {
        if (isScrolling || !canScrollRight()) return;
        
        isScrolling = true;
        categoriasContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
            updateButtonStates();
        }, 500);
    }
    
    // Event listeners para os botões
    btnPrev.addEventListener('click', scrollLeft);
    btnNext.addEventListener('click', scrollRight);
    
    // Event listeners para teclado
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('.categorias-container')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollLeft();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollRight();
            }
        }
    });
    
    // Event listener para scroll da categoria
    categoriasContainer.addEventListener('scroll', function() {
        if (!isScrolling) {
            updateButtonStates();
        }
    });
    
    // Event listener para redimensionamento da janela
    window.addEventListener('resize', function() {
        setTimeout(updateButtonStates, 100);
    });
    
    // Inicializar estado dos botões
    updateButtonStates();
    
    // Adicionar classe para indicar que o JavaScript está ativo
    document.querySelector('.categorias-container').classList.add('js-enabled');
    
    // Função para scroll suave com easing
    function smoothScrollTo(element, target, duration) {
        const start = element.scrollLeft;
        const distance = target - start;
        const startTime = performance.now();
        
        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        
        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutQuad(progress);
            
            element.scrollLeft = start + (distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
                updateButtonStates();
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Função alternativa para scroll mais suave
    function smoothScrollLeft() {
        if (isScrolling || !canScrollLeft()) return;
        
        isScrolling = true;
        const target = Math.max(0, categoriasContainer.scrollLeft - scrollAmount);
        smoothScrollTo(categoriasContainer, target, 400);
    }
    
    function smoothScrollRight() {
        if (isScrolling || !canScrollRight()) return;
        
        isScrolling = true;
        const maxScroll = categoriasContainer.scrollWidth - categoriasContainer.clientWidth;
        const target = Math.min(maxScroll, categoriasContainer.scrollLeft + scrollAmount);
        smoothScrollTo(categoriasContainer, target, 400);
    }
    
    // Substituir as funções de scroll por versões mais suaves
    btnPrev.onclick = smoothScrollLeft;
    btnNext.onclick = smoothScrollRight;
    
    // Adicionar indicadores visuais de scroll
    function addScrollIndicators() {
        const container = document.querySelector('.categorias-container');
        
        // Adicionar gradientes nas bordas para indicar mais conteúdo
        const style = document.createElement('style');
        style.textContent = `
            .categorias-container::before,
            .categorias-container::after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                width: 40px;
                pointer-events: none;
                z-index: 5;
                transition: opacity 0.3s ease;
            }
            
            .categorias-container::before {
                left: 0;
                background: linear-gradient(to right, rgba(23, 22, 22, 0.8), transparent);
                opacity: 0;
            }
            
            .categorias-container::after {
                right: 0;
                background: linear-gradient(to left, rgba(23, 22, 22, 0.8), transparent);
                opacity: 0;
            }
            
            .categorias-container.scroll-left::before {
                opacity: 1;
            }
            
            .categorias-container.scroll-right::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Atualizar indicadores baseado na posição do scroll
        function updateScrollIndicators() {
            const container = document.querySelector('.categorias-container');
            container.classList.toggle('scroll-left', canScrollLeft());
            container.classList.toggle('scroll-right', canScrollRight());
        }
        
        categoriasContainer.addEventListener('scroll', updateScrollIndicators);
        updateScrollIndicators();
    }
    
    addScrollIndicators();
}); 