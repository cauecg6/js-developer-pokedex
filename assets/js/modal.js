// Controla o modal (janela flutuante) que mostra os detalhes de um pokémon.
const pokemonModal = {}

const modalElement = document.getElementById('pokemonModal')
const modalCloseButton = document.getElementById('modalCloseButton')
const modalBody = document.getElementById('modalBody')

// Não existe um "máximo oficial" de status base; 255 é o valor de referência
// mais usado pelos fãs para calcular a % da barrinha de cada stat.
const MAX_STAT_VALUE = 255

// Traduz o nome técnico do stat (ex.: "special-attack") para um rótulo em português.
function statNameToLabel(statName) {
    const labels = {
        hp: 'HP',
        attack: 'Ataque',
        defense: 'Defesa',
        'special-attack': 'Ataque Esp.',
        'special-defense': 'Defesa Esp.',
        speed: 'Velocidade'
    }

    return labels[statName] || statName
}

function renderStats(stats) {
    return stats.map((stat) => {
        const percentage = Math.min(100, Math.round((stat.value / MAX_STAT_VALUE) * 100))

        return `
            <li class="stat">
                <span class="stat-name">${statNameToLabel(stat.name)}</span>
                <span class="stat-value">${stat.value}</span>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${percentage}%"></div>
                </div>
            </li>
        `
    }).join('')
}

function renderModalContent(pokemon) {
    modalBody.innerHTML = `
        <img class="modal-photo" src="${pokemon.photo}" alt="${pokemon.name}">
        <span class="modal-number">#${pokemon.number}</span>
        <h2 class="modal-name">${pokemon.name}</h2>

        <ol class="types modal-types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>

        <div class="modal-info">
            <div>
                <strong>Altura</strong>
                <span>${pokemon.height} m</span>
            </div>
            <div>
                <strong>Peso</strong>
                <span>${pokemon.weight} kg</span>
            </div>
        </div>

        <div class="modal-abilities">
            <strong>Habilidades</strong>
            <span>${pokemon.abilities.join(', ')}</span>
        </div>

        <ol class="stats">
            ${renderStats(pokemon.stats)}
        </ol>
    `
}

pokemonModal.open = (pokemon) => {
    renderModalContent(pokemon)
    modalElement.hidden = false
    document.body.style.overflow = 'hidden' // trava o scroll da página com o modal aberto
}

pokemonModal.close = () => {
    modalElement.hidden = true
    document.body.style.overflow = ''
}

modalCloseButton.addEventListener('click', pokemonModal.close)

// Fecha ao clicar fora do card, isto é, no fundo escurecido (overlay).
modalElement.addEventListener('click', (event) => {
    if (event.target === modalElement) {
        pokemonModal.close()
    }
})

// Fecha com a tecla Esc.
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalElement.hidden) {
        pokemonModal.close()
    }
})
