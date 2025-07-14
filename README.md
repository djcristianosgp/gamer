# My Rock Paper Scissors Game

Este é um jogo de Pedra, Papel e Tesoura desenvolvido em React para um trabalho de faculdade.

## Funcionalidades

-   **Tela Inicial:** Permite selecionar a quantidade de objetos (Pedra, Papel, Tesoura) para o jogo.
-   **Tela do Jogo:**
    -   Objetos aparecem gradualmente em posições aleatórias.
    -   Movimento aleatório pela área do jogo.
    -   Colisões entre objetos resultam em transformações (Pedra > Tesoura, Papel > Pedra, Tesoura > Papel).
    -   Contador em tempo real de cada tipo de objeto.
    -   Controle de velocidade dos objetos.
-   **Tela de Resultados:** Exibe o tipo de objeto vencedor e um botão para reiniciar o jogo.

## Como Rodar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd my-rock-paper-scissors-game
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    # ou
    yarn start
    ```
    O jogo será aberto no seu navegador em `http://localhost:3000`.

## Como Compilar para Produção (Deploy no Vercel, etc.)

Para criar uma versão otimizada para produção:

```bash
npm run build
# ou
yarn build
