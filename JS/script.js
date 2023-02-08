//Constantes de ligação com o HTML-to-JS;
const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImage = document.querySelector(".pokemon_image");
const form = document.querySelector(".form");
const input = document.querySelector(".input_search");
const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");

//Variável global responsável por indicar o id inicial do pokemon renderizado;
let searchPokemon = 1;

//Função responsável por buscar o Pokemon utilizando a API;
const fetchPokemon = async (pokemon) => {  //Torna a FUNÇÃO assincrona, já que por si só o fetch não faz isso;
     
    //Constante responsável por receber o valor retornado da api com as informações do pokemon desejado;
    //Perceba que o fetch nos retorna apenas uma promise, ou seja, quando o código for executado, ele será executado instantâneamente. Quando usamos apis, geralmente elas precisam de um espaço de tempo para carregar as informações, já que a maioria delas é requisitada pela internet. Nesse caso, utilizamos o await para que o código js espere aquela api nos retornar o seu resultado para que assim possa executar os demais comandos;
    const APIResposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    //Tratamento para quando o usuário digitar uma entrada incorreta, o retorno vai ser 404 e não 200;
    if(APIResposta.status === 200){
        //Constante responsável por receber os dados da api e converter ela em json já que por padrão ela vem da api em formato ilegível;
        //É preciso também colocar o await já que o json também é uma função assíncrona;
        const data = await APIResposta.json();
        return data;
    }
}

//Função responsável por renderizar as informações do pokemon buscado pelo usuário;
//Já que a fetchPokemon é uma função assíncrona, a renderPokemon tbm precisa ser;
const renderPokemon = async (pokemon) => {
    //Mensagem que será exibida antes da função fetchPokemon carregar;
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';

    //Como a função fetchPokemon virou uma função assíncrona, ela também vai retornar uma promise. Pensando bem faz muito sentido isso já que, se precisamos aguardar que na função de busca, a api carregue as informações, o mínimo é que nós precisaremos esperar o retorno dessa função também. As promises são como ervas daninhas;
    const data = await fetchPokemon(pokemon);

    //Tratamento pra quando o usuário digitar um valor inválido;
    if(data){
        //Substitui os dados da tela pelos dados fornecidos pela api;
        pokemonImage.style.display = "block";
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
    
        //Um pequeno problema desta api é que algumas propriedades de objetos tem nomes que podem gerar erro se acessadas simplesmente com o ponto. Em JS você pode acessar as propriedades de um elemento usando tanto o . como é mais comum quanto com os []. Nesse exemplo, precisou ser por colchetes em virtude deste erro da api;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    
        //Limpa o input após o enter da pesquisa;
        input.value = '';

        //Atualiza a variável global de pesquisa pré-setada;
        searchPokemon = data.id;
    }else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
    }
}

//Função associada a um evento responsável por capturar as informações que o usuário digitou. Por se tratar de um formulário, alguns comportamentos padrões podem gerar possíveis erros e para evitar isso utilizando so o preventDefault;
form.addEventListener("submit", (event)=>{ //Quando colocamos parâmetro em arrowfunction, o próprio JS pega o evento;
    //Evita os erros possíveis de comportamento padrão de um formulário;
    event.preventDefault();

    //Envia pra função que vai renderizar o pokemon o valor digitado pelo usuário;
    renderPokemon(input.value.toLowerCase());
});

//Funções associadas à eventos que serão responsáveis por add ou diminuir o id atual pesquisado;-----------------------
buttonPrev.addEventListener("click", ()=>{
    if(searchPokemon > 1){
        //Decrementa a variável de pesquisa global pré-setada;
        searchPokemon--;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener("click", ()=>{
    //Incrementa a variável de pesquisa global pré-setada;
    searchPokemon++;
    renderPokemon(searchPokemon);
});
//----------------------------------------------------------------------------------------------------------------------

renderPokemon(searchPokemon);

