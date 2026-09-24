# Pokédex

Projeto do Desafio de Projeto **"Pokédex"** da trilha **Formação JavaScript Developer** (DIO).
Uma Pokédex simples, construída com **HTML, CSS e JavaScript puro** (sem frameworks e sem build), que consome a
[PokéAPI](https://pokeapi.co/api/v2/) para listar, buscar, filtrar e detalhar os 151 pokémons da 1ª geração.

## Demonstração

Publicado no GitHub Pages: `https://<seu-usuario>.github.io/js-developer-pokedex/`
*(link fica disponível depois que o Pages é ativado nas configurações do repositório — veja a seção "GitHub Pages" abaixo)*

## Funcionalidades

- **Listagem paginada** dos 151 pokémons da 1ª geração, com botão "Load More" para carregar mais 10 por vez.
- Cada card mostra **número, nome, tipo(s) e imagem**, com a cor de fundo de acordo com o tipo principal.
- **Busca** por nome (ex.: `pikachu`) ou número (ex.: `25`).
- **Filtro por tipo** (fogo, água, planta, etc.), limitado à 1ª geração.
- **Modal de detalhes** ao clicar em um card: imagem, tipos, altura, peso, habilidades e status base (com barrinhas de progresso). Fecha clicando no `x`, clicando fora do card ou com a tecla `Esc`.
- **Estado de carregamento** ("Carregando pokémons...") e **mensagens de erro amigáveis** caso a PokéAPI falhe ou não encontre resultados.
- **Layout responsivo**, do celular ao desktop.

## Tecnologias usadas

- HTML5
- CSS3 (Flexbox, Grid e media queries)
- JavaScript (ES6+, `fetch`, `async/await`, sem bibliotecas externas)
- [PokéAPI](https://pokeapi.co/api/v2/) como fonte de dados

## Estrutura do projeto

```
├── index.html
└── assets
    ├── css
    │   ├── global.css      # estilos base (fonte, cores de fundo, container)
    │   ├── pokedex.css      # listagem, cards, busca, filtro, cores por tipo
    │   └── modal.css        # modal de detalhes
    └── js
        ├── pokemon-model.js # classe Pokemon (o "formato" dos dados que usamos na tela)
        ├── poke-api.js       # toda a comunicação com a PokéAPI
        ├── modal.js          # abrir/fechar o modal e renderizar os detalhes
        └── main.js           # interface: listagem, busca, filtro, "Load More"
```

## Como rodar localmente

Como é HTML/CSS/JS puro, basta servir os arquivos estáticos — não precisa instalar nada.

Com a extensão **Live Server** do VS Code:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `index.html` → "Open with Live Server".

Ou, com Python instalado, pela linha de comando:

```bash
python -m http.server 8080
```

E acesse `http://localhost:8080` no navegador.

> Não abra o `index.html` direto no navegador com duplo clique (protocolo `file://`) — alguns navegadores
> bloqueiam certas requisições de arquivos locais. Sempre use um servidor local.

## Publicando no GitHub Pages

1. No GitHub, vá até o seu repositório → **Settings** → **Pages**.
2. Em **Build and deployment** → **Source**, selecione **Deploy from a branch**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)`, depois clique em **Save**.
4. Aguarde alguns instantes; o GitHub mostrará a URL pública (algo como `https://<seu-usuario>.github.io/js-developer-pokedex/`).

Como o projeto usa apenas caminhos relativos (`assets/css/...`, `assets/js/...`), ele funciona tanto localmente
quanto publicado em um subdiretório do GitHub Pages, sem nenhuma configuração extra.

## Aprendizados

Este desafio foi uma boa prática de consumo de **API REST** com `fetch`. Alguns conceitos que ficaram mais claros:

- **URL e query string**: a PokéAPI usa a URL para identificar o recurso (`/pokemon/25` busca o pokémon de número 25)
  e query strings para paginar resultados (`/pokemon?offset=10&limit=10` pula os 10 primeiros e traz os próximos 10).
- **Verbo HTTP**: como só precisamos ler dados, todas as chamadas aqui são `GET` (o padrão do `fetch`).
- **Status code**: `response.ok` é `true` para códigos de sucesso (200-299) e `false` para erros como `404` (pokémon
  não encontrado) — é isso que usamos para decidir quando mostrar a mensagem de erro amigável.
- **Body da resposta**: o `fetch` só nos dá o corpo da resposta depois de um segundo `await response.json()`,
  porque a resposta pode chegar em pedaços e o JSON precisa ser lido por completo antes de virar um objeto JS.
- **Requisições em paralelo**: para não buscar os detalhes de cada pokémon um por um (o que seria lento), usamos
  `Promise.all()` para disparar várias requisições ao mesmo tempo e esperar todas terminarem juntas.
- **async/await vs. `.then`**: reescrever as chamadas com `async/await` deixou o código bem mais fácil de ler
  do que a versão original encadeada com `.then()`, principalmente ao adicionar `try/catch` para os erros.

## Créditos

Projeto base fornecido pela [DIO](https://www.dio.me/) na trilha Formação JavaScript Developer.
Dados dos pokémons fornecidos pela [PokéAPI](https://pokeapi.co/).
