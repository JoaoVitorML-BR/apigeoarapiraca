# API-REST GEO ARAPIRACA

-  Essa api visa cadastrar e fornecer as informações a respeito dos locais publicos de arapiraca e suas respectivas localizações.
-  Utilizamos para construir a mesma as tecnologias: Node.js, Knex, Express e o banco de dados PostgreSQL juntamente do docker.

## Iniciando a API

#### Passo 1
Antes de iniciar todo o processo abra o seu terminal e digite o seguinte comando: "chmod +x start.sh", esse comando será responsável por dar todas as permições necessarias para o arquivo "start.sh", além disso, você deverá criar um arquivo .env no diretorio raiiz APIGEOARA/.env passando as seguintes configurações:
-   POSTGRES_USER=seu_ususario
-   POSTGRES_PASSWORD=sua_senha
-   POSTGRES_HOST=geoara
-   POSTGRES_DB=geoara
-   PORT_PG=5432

-   PORT_SEVER =1952
-   HOST =0.0.0.0

#### Passo 2
-   Este comando irá construir as imagens necessárias, inicializar os contêineres e configurar o ambiente de execução, incluindo a instalação das dependências via npm install e a execução do servidor com npm start.

# Arquivos Docker

Possuimos 2 arquivos docker, 1 chamado de **Dockerfile** e outro de **docker-compose.yml**. Esses dois arquivos, Dockerfile e docker-compose.yml, juntos permitem a construção e a execução fácil do ambiente completo da aplicação, incluindo o servidor Node.js e o banco de dados PostgreSQL.

##### Docker
O Dockerfile é usado para criar a imagem Docker da sua aplicação Node.js. Ele define as instruções necessárias para configurar o ambiente de execução da aplicação.

```FROM node:alpine```
Inicia a imagem com o Node.js baseada no sistema operacional Alpine, uma versão leve do Linux.

```WORKDIR /usr/app```
Define o diretório de trabalho dentro do contêiner para /usr/app.

```COPY package*json ./```
Copia os arquivos package.json e package-lock.json para o diretório de trabalho dentro do contêiner, para que as dependências possam ser instaladas.

```RUN npm install```
Executa o comando npm install dentro do contêiner para instalar as dependências do projeto.

```COPY . .```
Copia todos os arquivos do seu projeto para dentro do contêiner.

```EXPOSE 1952```
Expõe a porta 1952 para que o contêiner possa ser acessado externamente.

```CMD ["npm", "start"]```
Define o comando padrão que será executado quando o contêiner for iniciado. Neste caso, ele inicia a aplicação com o npm start.

##### docker-compose.yml
O docker-compose.yml é usado para definir e gerenciar múltiplos contêineres Docker, facilitando a execução e configuração da aplicação e do banco de dados.

```version: "3"```
-   Define a versão do Docker Compose utilizada.

``` 
services:
  app:
    build: .
    command: npm start
    ports:
      - "1952:1952"
    volumes:
      - .:/usr/app
```
-   build: .: Constrói a imagem Docker utilizando o Dockerfile presente no diretório atual.
command: npm start: Executa o comando npm start dentro do contêiner.
-   ports: Mapeia a porta 1952 do contêiner para a porta 1952 do host, permitindo o acesso à aplicação.
-   volumes: Mapeia o diretório atual do projeto para dentro do contêiner, permitindo a sincronização em tempo real.

```
postgres:
    container_name: geoara
    image: postgres
    environment:
        POSTGRES_USER: ${POSTGRES_USER}
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        POSTGRES_DB: ${POSTGRES_DB}
    volumes:
        - ./data:/var/lib/postgresql/data
        - ./db/migrations/query.sql:/docker-entrypoint-initdb.d/query.sql
    ports:
        - "5432:5432"
```
-   container_name: geoara: Define o nome do contêiner como geoara.
-   image: postgres: Usa a imagem oficial do PostgreSQL.
-   environment: Define as variáveis de ambiente para o banco de dados, como usuário, senha e nome do banco, que podem ser passadas pelo arquivo .env.
-   volumes: Mapeia diretórios do host para o contêiner, garantindo a persistência dos dados e rodando um script SQL de inicialização.
-   ports: Mapeia a porta 5432 do contêiner para a porta 5432 do host, permitindo o acesso ao banco de dados PostgreSQL.

## Verificando se a aplicação está rodando

Agora que foi feito toda a configuração necessaria, iremos testar se está tudo ok, para isso iremos digitar o seguinte comando: ```curl http://localhost:1952/equipment``` Esse comando deve nos retornar um array vazio [], indicando estar tudo ok.