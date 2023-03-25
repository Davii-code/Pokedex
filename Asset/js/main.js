
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonList = document.getElementById('pokemonList')

const maxRecords = 151;
const limit = 5;
let offset = 0;

const PokeApi = {}

class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
}
//
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}
//
function convertPokemonToLi(pokemon) {
    return `
   
    <li  class="atributos ${pokemon.type}">
            <span class="number">#00${pokemon.number}</span>
            <span class="name"> ${pokemon.name}</span>
            <div class="detalhes">
                <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                    <div>
                    <span><img src="${pokemon.photo}" alt="${pokemon.name}"></span>
            
                    </div>
                
            </div>
    </li>

    `
}
//
PokeApi.getPokemons = (offset= 0, limit=5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(PokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
//
PokeApi.getPokemonDetail =(pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}
//
   
 function loadPokemonItens(offset, limit){
    PokeApi.getPokemons(offset, limit) .then((pokemons) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})