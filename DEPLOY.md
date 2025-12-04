# Guia de Deploy

Este projeto pode ser implantado de várias maneiras. Abaixo estão as instruções para as plataformas mais comuns.

## Configuração de Variáveis de Ambiente

Antes de fazer o deploy, certifique-se de configurar a URL da API backend.

- `VITE_API_URL`: A URL da sua API backend (ex: `https://api.riffhouse.com`). Se não definida, o padrão será `http://localhost:8080`.

## Opção 1: Vercel

Este projeto já inclui um arquivo `vercel.json` configurado para lidar com o roteamento SPA.

1. Instale a [Vercel CLI](https://vercel.com/docs/cli) ou conecte seu repositório no painel da Vercel.
2. Defina a variável de ambiente `VITE_API_URL` nas configurações do projeto na Vercel.
3. O comando de build será detectado automaticamente (`npm run build`) e o diretório de saída será `dist`.

## Opção 2: Netlify

Este projeto já inclui um arquivo `netlify.toml` configurado.

1. Conecte seu repositório no Netlify.
2. Defina a variável de ambiente `VITE_API_URL` nas configurações do site ("Site settings" > "Build & deploy" > "Environment").
3. As configurações de build e redirecionamento serão lidas automaticamente do arquivo `netlify.toml`.

## Opção 3: Docker

Para executar a aplicação em um contêiner Docker:

1. Construa a imagem:
   ```bash
   docker build -t riffhouse-client .
   ```

2. Execute o contêiner (passando a URL da API se necessário, mas note que variáveis de build do Vite são embutidas no momento do build. Para mudar a URL em tempo de execução com Docker, seria necessária uma abordagem diferente, como substituir a string no entrypoint, mas para este setup simples, recomenda-se definir a variável no build ou reconstruir a imagem para diferentes ambientes):

   **Nota:** Como o Vite injeta variáveis de ambiente no momento do build, se você quiser mudar a API URL, você deve passar o argumento de build:

   ```bash
   docker build --build-arg VITE_API_URL=https://api.meusite.com -t riffhouse-client .
   ```

   *Para suportar isso, o Dockerfile precisaria de uma pequena alteração para aceitar ARG. O Dockerfile atual usa as variáveis do ambiente de build.*

   Para rodar a imagem criada:
   ```bash
   docker run -p 80:80 riffhouse-client
   ```

## Opção 4: Surge.sh

1. Instale o Surge: `npm install --global surge`
2. Gere o build: `npm run build`
3. Entre na pasta dist: `cd dist`
4. Faça o deploy: `surge`
   (Lembre-se de renomear `index.html` para `200.html` se quiser suporte a client-side routing sem configuração extra no servidor, ou o surge lida com isso automaticamente para SPAs).
