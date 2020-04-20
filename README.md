# Teste Smarkio
> Aplicação Web de busca de clima por cidade utlizando OpenWeather API

<img style="text-center" src="https://github.com/Briuor/Test-Smarkio/blob/master/extra/demo_clima.gif?raw=true" />

## Instalando Dependências

```sh
# clone o projeto
git clone https://github.com/Briuor/Test-Smarkio.git
# abra o diretorio do projeto
cd Test-Smarkio/
# instale as dependências
npm install
```

## Preparando Ambiente
1. Entre em **config/** e adicione suas credencias de banco de dados no arquivo **config.json**, como na imagem abaixo.
<img style="text-center" src="https://github.com/Briuor/Test-Smarkio/blob/master/extra/config.png?raw=true" />
2. Crie um schema com nome "smarkio_test" e execute o comando abaixo para executar a migration.

```sh
# após preencher as credenciais de banco de dados
# criar a estutura do banco
npx sequelize-cli db:migrate
```

3. (opcional) Caso tenha problema em usar a migration pode-se importar o arquivo **smarkio_test.sql**(encontrado no diretório **extra/**) em seu mysql.
## Executando

```sh
npm start
# acessar http://localhost:3000
```
