const cards = document.querySelectorAll('.card_projeto')

cards.forEach(card => {
    card.addEventListener('click', () =>{
        document.getElementById('modal').style.display = 'flex'
    })
})

const modal = document.getElementById('modal')
modal.addEventListener('click', (event) => {
    if(event.target === modal)
        modal.style.display = 'none'
})