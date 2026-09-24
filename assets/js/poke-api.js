// Centraliza todas as chamadas à PokeAPI (https://pokeapi.co/api/v2/).
// Cada função devolve uma Promise já convertida para o nosso modelo Pokemon.
const pokeApi = {}

// Converte a resposta "crua" da PokeAPI (endpoint /pokemon/{id}) para o nosso modelo Pokemon.
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    // "dream_world" tem imagens em vetor mais bonitas; caem para o sprite padrão se faltar.
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
        || pokeDetail.sprites.front_default

    pokemon.height = pokeDetail.height / 10 // a API retorna decímetros -> convertendo para metros
    pokemon.weight = pokeDetail.weight / 10 // a API retorna hectogramas -> convertendo para quilos
    pokemon.abilities = pokeDetail.abilities.map((item) => item.ability.name)
    pokemon.stats = pokeDetail.stats.map((item) => ({
        name: item.stat.name,
        value: item.base_stat
    }))

    return pokemon
}

// Busca os detalhes completos de um pokémon a partir da url retornada pela listagem.
pokeApi.getPokemonDetail = async (pokemon) => {
    const response = await fetch(pokemon.url)

    if (!response.ok) {
        throw new Error(`Não foi possível carregar os detalhes de ${pokemon.name}.`)
    }

    const pokeDetail = await response.json()
    return convertPokeApiDetailToPokemon(pokeDetail)
}

// Busca uma página de pokémons (offset/limit) e já resolve os detalhes de cada um.
pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Não foi possível carregar a lista de pokémons.')
    }

    const jsonBody = await response.json()
    const detailRequests = jsonBody.results.map(pokeApi.getPokemonDetail)

    return Promise.all(detailRequests)
}

// Busca um único pokémon pelo nome (ex.: "pikachu") ou pelo número (ex.: 25).
pokeApi.getPokemonByNameOrId = async (nameOrId) => {
    const query = String(nameOrId).toLowerCase().trim()
    const url = `https://pokeapi.co/api/v2/pokemon/${query}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Pokémon "${nameOrId}" não foi encontrado.`)
    }

    const pokeDetail = await response.json()
    return convertPokeApiDetailToPokemon(pokeDetail)
}

// Busca todos os pokémons de um tipo, limitando à 1ª geração (número <= 151, igual à listagem)
// para não disparar centenas de requisições de uma vez só.
pokeApi.getPokemonsByType = async (type) => {
    const url = `https://pokeapi.co/api/v2/type/${type}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Não foi possível carregar o tipo "${type}".`)
    }

    const jsonBody = await response.json()

    const firstGenPokemons = jsonBody.pokemon
        .map((item) => item.pokemon)
        .filter((pokemon) => {
            // a url termina em algo como ".../pokemon/25/" -> extraímos o número dali
            const id = Number(pokemon.url.split('/').filter(Boolean).pop())
            return id <= 151
        })

    const detailRequests = firstGenPokemons.map(pokeApi.getPokemonDetail)
    return Promise.all(detailRequests)
}
