// Monta a interface: listagem paginada, busca, filtro por tipo e abertura do modal.
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const loadingMessage = document.getElementById('loadingMessage')
const errorMessage = document.getElementById('errorMessage')
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput')
const typeFilter = document.getElementById('typeFilter')

const maxRecords = 151
const limit = 10
let offset = 0

// Guarda, por número, os pokémons já renderizados na tela. Assim, ao clicar em um
// card para abrir o modal, reaproveitamos o dado que já temos em vez de buscar de novo.
const pokemonsCache = {}

function showLoading(isLoading) {
    loadingMessage.hidden = !isLoading
}

function showError(message) {
    errorMessage.textContent = message || ''
    errorMessage.hidden = !message
}

function convertPokemonToLi(pokemon) {
    pokemonsCache[pokemon.number] = pokemon

    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

// append = true adiciona no final da lista (usado pelo "Load More");
// append = false substitui a lista inteira (usado por busca e filtro).
function renderPokemonList(pokemons, { append = true } = {}) {
    const html = pokemons.map(convertPokemonToLi).join('')
    pokemonList.innerHTML = append ? pokemonList.innerHTML + html : html
}

async function loadPokemonItens(offset, limit) {
    showError(null)
    showLoading(true)

    try {
        const pokemons = await pokeApi.getPokemons(offset, limit)
        renderPokemonList(pokemons)
    } catch (error) {
        showError('Não foi possível carregar os pokémons. Verifique sua conexão e tente novamente.')
    } finally {
        showLoading(false)
    }
}

// Volta para a listagem padrão paginada. Usado quando o campo de busca ou o
// filtro de tipo são limpos.
function resetToDefaultListing() {
    offset = 0
    pokemonList.innerHTML = ''
    loadMoreButton.hidden = false
    loadPokemonItens(offset, limit)
}

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.hidden = true
    } else {
        loadPokemonItens(offset, limit)
    }
})

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const term = searchInput.value.trim()

    if (!term) {
        resetToDefaultListing()
        return
    }

    showError(null)
    showLoading(true)
    loadMoreButton.hidden = true

    try {
        const pokemon = await pokeApi.getPokemonByNameOrId(term)
        renderPokemonList([pokemon], { append: false })
    } catch (error) {
        pokemonList.innerHTML = ''
        showError(`Nenhum pokémon encontrado para "${term}".`)
    } finally {
        showLoading(false)
    }
})

typeFilter.addEventListener('change', async () => {
    const type = typeFilter.value

    if (!type) {
        resetToDefaultListing()
        return
    }

    showError(null)
    showLoading(true)
    loadMoreButton.hidden = true

    try {
        const pokemons = await pokeApi.getPokemonsByType(type)

        if (pokemons.length === 0) {
            pokemonList.innerHTML = ''
            showError(`Nenhum pokémon do tipo "${type}" foi encontrado.`)
        } else {
            renderPokemonList(pokemons, { append: false })
        }
    } catch (error) {
        pokemonList.innerHTML = ''
        showError('Não foi possível carregar os pokémons desse tipo.')
    } finally {
        showLoading(false)
    }
})

// Um único listener no <ol> (delegação de evento) abre o modal do card clicado.
pokemonList.addEventListener('click', (event) => {
    const item = event.target.closest('.pokemon')
    if (!item) return

    const pokemon = pokemonsCache[item.dataset.number]
    if (pokemon) {
        pokemonModal.open(pokemon)
    }
})

loadPokemonItens(offset, limit)
