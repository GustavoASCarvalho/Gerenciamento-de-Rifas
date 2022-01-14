<p align="center">
  <img alt="rifa" src="/public/assets/rifas.png" width="100px" />
  <h1 align="center">Gerênciamento de rifas</h1>
</p>

<p>Você acaba de encontrar nosso repositório de gerenciamento de rifas no GitHub, nele você poderá cadastrar suas rifas com seus respectivos prêmios, vender e realizar sorteios</p>
<p>Site: https://rifasapp.herokuapp.com/</p>
<p>Apresentação: https://youtu.be/6e_NPwY1Tkw</p>

## Index

- [Index](#index)
- [Como rodar](#como-rodar)
- [Classes](#classes)
- [CheckList](#checklist)
- [Participantes](#participantes)

## Como rodar

Requisitos

- nodejs^14.17.0
- npm^6.14.12
- postgresql^13

Na raiz do projeto

- Criar o arquivo .env seguindo os padrões do .env.example

```shell
  npm i                   # Instala as dependencias do projeto
  node ace migration:run  # Inicializa o banco de dados
  node ace db:seed        # Insere alguns dados de teste no banco de dados
  node ace serve          # Roda um servidor local para visualização do projeto
```

## Classes

- Rifas
- Usuários
- Tipos
- Prêmios
- Bilhetes

## CheckList

- [x] Implementação do [AdonisJS](https://adonisjs.com/)
- [x] Criação de rotas primarias (Home, About)
- [x] Implementação do [Bootstrap](https://getbootstrap.com/)
- [x] Implementação do banco de dados Postgresql
- [x] Models e migrations aplicados
- [x] Autenticação adicionada
- [x] Atribuição de relações
- [x] Criação de um seeder paro banco de dados
- [x] Estilização de paginas
- [x] Adicionado validações de formulários
- [x] Adicionado bibliotecas de segurança

## Participantes

1. [@FelipeNaoto](https://github.com/felipeinfo18)
2. [@GustavoAlexandre](https://github.com/GustavoASCarvalho)
