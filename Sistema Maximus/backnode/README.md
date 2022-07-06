# API Maximus Gestão
Esta API Rest é utilizada para controle de login, usuários, lojas, redes e postagens de tutoriais para a empresa Maximus Gestão.

## Endpoints
### POST /login
Esse endpoint é responsável por fazer o processo de login.
#### Parâmetros
login: Login do usuário cadastrado no sistema.

password: Senha do usuário cadastrado no sistema para o seu respectivo login.

Exemplo:
```
{
    "login": "LARI",
    "password": "123456"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber o token JWT para conseguir acessar endpoints protegidos na API e os dados do usuário.

Exemplo de resposta:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZE5ldHdvcmtVc2VyIjoxLCJyb2xlIjoiMSIsImlhdCI6MTY1NTYwNTIyMH0.e05xWjpsznufasTPjrJHz98s2kuzCt4gOVxMCsIfAQM",
    "user": {
        "ID_USUARIO": 4,
        "LOGIN_USUARIO": "LARI",
        "EMAIL_USUARIO": "larissa@outlook.com",
        "CARGO_USUARIO": "1",
        "SENHA_USUARIO": "$2b$10$QSeDRq2L/L7q778aJHQtouSi5kcUCKYb1Xy0cLy5bOVCRTCPLKrAS",
        "REDEID_USUARIO": 1,
        "id": 1,
        "NOME_REDE": "Big Farma"
    }
}
```
##### Falha na autenticação! 406
Caso essa resposta aconteça significa que aconteceu alguma falha durante o processo de autenticação. Motivos: Login ou senha incorretos.

Exemplos de respostas:
```
{
    "status": false,
    "err": "O usuário informado não existe"
}
```
``` 
{
    "err": "Senha incorreta"
}
```

### GET /user
Esse endpoint é responsável por retornar a listagem de todos os usuários cadastrados no banco de dados.
#### Parâmetros
token: Token gerado no momento de login do usuário, este token precisa ser enviado no cabeçalho da requisição.
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a listagem de todos os usuários

Exemplo de resposta:
```
[
    {
        "ID_USUARIO": 1,
        "LOGIN_USUARIO": "MAXIMUS",
        "EMAIL_USUARIO": "douglasrnn62@gmail.com",
        "CARGO_USUARIO": "M",
        "SENHA_USUARIO": "$2b$10$H1nWKQ.7R.CqQJ.u5uzmkeYLrH7RHO.2qnnyRF0a5tU1WofRaUR9e",
        "REDEID_USUARIO": null,
        "id": null,
        "NOME_REDE": null
    },
    {
        "ID_USUARIO": 3,
        "LOGIN_USUARIO": "VANESSA",
        "EMAIL_USUARIO": "vanessa@gmail.com",
        "CARGO_USUARIO": "A",
        "SENHA_USUARIO": "$2b$10$Shl2twUljQV28g50JTJfr.LK9JEGxOdmSz13BYYfw2OGupVxutWGG",
        "REDEID_USUARIO": 1,
        "id": 1,
        "NOME_REDE": "Big Farma"
    },
    {
        "ID_USUARIO": 4,
        "LOGIN_USUARIO": "LARI",
        "EMAIL_USUARIO": "larissa@outlook.com",
        "CARGO_USUARIO": "A",
        "SENHA_USUARIO": "$2b$10$QSeDRq2L/L7q778aJHQtouSi5kcUCKYb1Xy0cLy5bOVCRTCPLKrAS",
        "REDEID_USUARIO": 1,
        "id": 1,
        "NOME_REDE": "Big Farma"
    }
]
```
##### Falha na autenticação! 403
Caso essa resposta aconteça significa que aconteceu alguma falha durante o processo de autenticação. Motivos: 
Você não está autenticado, O usuário não tem permissão, Token inválido, Token expirado.

Exemplos de respostas:
``` 
{
    "err": "Você não está autenticado"
}
```
``` 
{
    "err": "Você não tem permissão para acessar essa página / função"
}
```

### POST /user
Esse endpoint é responsável por criar um usuário.
#### Parâmetros
Obs: Todos os parâmetros listados abaixo são obrigatórios.

login: Login que o usuário vai receber em seu cadastro, esse login será utilizado para acessar o sistema.

email: E-mail que o usuário vai receber em seu cadastro.

password: Senha que o usuário vai receber em seu cadastro.

role: Cargo que o usuário vai receber em seu cadastro, cargos disponíveis: Master que é representado pela letra M e Administrativo representado
pela letra A.

Exemplo:
```
{
    "login": "Usuário",
    "email": "usuario@gmail.com",
    "password": "12345678",
    "role": "A"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação de cadastro do usuário.

Exemplo de resposta:
```
{
    "success": "Usuário cadastrado com sucesso!"
}
```
##### Falha na criação do cadastro do usuário! 404
Caso essa resposta aconteça significa que o cadastro do usuário não foi concluído. Motivos: 
Já existe um usuário cadastrado no banco de dados com o login informado pelo usuário.

Exemplo de resposta:
```
{
    "err": "Já existe um usuário com este login"
}
```
##### Falha na criação do cadastro do usuário! 406
Caso essa resposta aconteça significa que o cadastro do usuário não foi concluído. Motivos: 
Login, e-mail, senha ou cargo do usuário não foram preenchidos.

Exemplo de resposta:
```
{
    "err": "Ocorreu um erro ao tentar cadastrar o usuário, verifique os dados informados e tente novamente"
}
```

### PATCH /user
Esse endpoint é responsável por editar os dados de um usuário.
#### Parâmetros
editLoginUser: Login que o usuário vai receber em seu cadastro, parâmetro obrigatório, caso o usuário não altere o login envie o login antigo na requisição.

editRoleUser: Cargo que o usuário vai receber em seu cadastro, cargos disponíveis: Master que é representado pela letra M e Administrativo representado
pela letra A.

editRoleNetwork: Id da rede que o usuário vai receber em seu cadastro.

idUser: Id do usuário que deseja editar, parâmetro obrigatório.

Exemplo:
```
{
    "editLoginUser": "MAXIMUS",
    "editRoleUser": "M",
    "editRoleNetwork": "1",
    "idUser": 9
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação que a edição do usuário foi concluída.

Exemplo de resposta:
```
{
    "success": "Usuário editado com sucesso"
}
```
##### Falha na edição do cadastro do usuário! 404
Caso essa resposta aconteça significa que a edição do cadastro do usuário não foi concluída. Motivos: 
Já existe um usuário cadastrado no banco de dados com o login informado.

Exemplo de resposta:
```
{
    "err": "Já existe um usuário com este login"
}
```

### POST /password
Esse endpoint é responsável por fazer a criação de um token necessário para que o usuário altere sua senha.
#### Parâmetros
email: E-mail do usuário.

Exemplo:
```
{
    "email": "douglasrnn62@gmail.com"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber o token para que o usuário consiga alterar a senha do usuário dele.

Exemplo de resposta:
```
3cfbed7c-fe8d-4a5f-8e2d-0e342cad88e1
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que e-mail informado não existe. Motivos: 
E-mail do usuário não foi encontrado na base de dados.

Exemplo de resposta:
```
{
    "err": "O e-mail informado não existe"
}
```

### PATCH /token
Esse endpoint é responsável por fazer a validação do token e caso o token seja válido o usuário conseguirá alterar a senha dele.
#### Parâmetros
token: Token gerado anteriormente no endpoint POST /password.

password: Nova senha do usuário.

Exemplo:
```
{
    "token": "3cfbed7c-fe8d-4a5f-8e2d-0e342cad88e1",
    "password": "123456"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação que a edição da senha do usuário foi concluída.

Exemplo de resposta:
```
{
    "success": "Usuário editado com sucesso"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o token não é válido. Motivos: 
Token inválido, Token já utilizado.

Exemplo de resposta:
```
Token inválido
```

### POST /token
Esse endpoint é responsável fazer a validação do token, apenas para saber o token é válido ou não.
#### Parâmetros
token: Token gerado anteriormente no endpoint POST /password.

Exemplo:
```
{
    "token": "3cfbed7c-fe8d-4a5f-8e2d-0e342cad88e1"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação que o token é válido e pode ser utilizado.

Exemplo de resposta:
```
{
    "success": "Token válido"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o token não é válido e não pode mais ser utilizado. Motivos: 
Token inválido, Token já utilizado.

Exemplo de resposta:
```
{
    "err": "Token inválido"
}
```

### DELETE /user/:login
Esse endpoint é responsável por excluir o cadastro de um usuário.
#### Parâmetros
login: Login do usuário que deseja remover, o login deve ser informado na URL de conexão com o endpoint.

Exemplos:
```
/user/MAXIMUS2022
```
```
/user/LoginDoUsuario
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que o usuário foi excluído.

Exemplo de resposta:
```
{
    "success": "Usuário excluido"
}
```
##### Falha na requisição! 404
Caso essa resposta aconteça significa que a exclusão do usuário não ocorreu. Motivos: 
O usuário não existe na base de dados.

Exemplo de resposta:
``` 
{
    "err": "Ocorreu um erro ao tentar excluir MAXIMUS2022"
}
```

### GET /replic
Esse endpoint é responsável por retornar a listagem das redes e suas respectivas lojas cadastradas no banco de dados.
#### Parâmetros
token: Token gerado no momento de login do usuário, este token precisa ser enviado no cabeçalho da requisição.
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a listagem das redes e suas respectivas lojas cadastradas.

Exemplo de resposta:
```
{
    "success": "Tudo OK",
    "networks": [
        {
            "NOME_REDE": "Big Farma",
            "id": 1
        },
        {
            "NOME_REDE": "Bom Preço",
            "id": 2
        },
        {
            "NOME_REDE": "Droga Fácil SE",
            "id": 3
        },
        {
            "NOME_REDE": "Drogaria Canaã",
            "id": 4
        },
        {
            "NOME_REDE": "Drogaria Cidadã",
            "id": 5
        },
        {
            "NOME_REDE": "Drogaria Rezende",
            "id": 6
        },
        {
            "NOME_REDE": "Drogaria Veracruz",
            "id": 7
        },
        {
            "NOME_REDE": "Drogaria Xavier",
            "id": 8
        },
        {
            "NOME_REDE": "Farma Nova GO",
            "id": 11
        },
        {
            "NOME_REDE": "Farmácia Caçula",
            "id": 12
        },
        {
            "NOME_REDE": "Farmácia Gloria SE",
            "id": 9
        },
        {
            "NOME_REDE": "Farmácia Mais Farma PA",
            "id": 13
        },
        {
            "NOME_REDE": "Farmácia Preço Popular",
            "id": 10
        },
        {
            "NOME_REDE": "Ouro Farma",
            "id": 14
        },
        {
            "NOME_REDE": "Preço Baixo ES",
            "id": 15
        },
        {
            "NOME_REDE": "Rede Soma ES",
            "id": 17
        },
        {
            "NOME_REDE": "São Luiz GO",
            "id": 16
        },
        {
            "NOME_REDE": "Star Farma GO",
            "id": 18
        },
        {
            "NOME_REDE": "Trab Carajas PA",
            "id": 19
        }
    ],
    "stores": [
        {
            "ID_LOJA": 1,
            "NUMERO_LOJA": 0,
            "NOME_LOJA": "Integração",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 1,
            "id": 1,
            "NOME_REDE": "Big Farma"
        },
        {
            "ID_LOJA": 2,
            "NUMERO_LOJA": 1,
            "NOME_LOJA": "Loja 1",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 1,
            "id": 1,
            "NOME_REDE": "Big Farma"
        },
        {
            "ID_LOJA": 3,
            "NUMERO_LOJA": 2,
            "NOME_LOJA": "Loja 2",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 1,
            "id": 1,
            "NOME_REDE": "Big Farma"
        },
        {
            "ID_LOJA": 4,
            "NUMERO_LOJA": 3,
            "NOME_LOJA": "Loja 3",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 1,
            "id": 1,
            "NOME_REDE": "Big Farma"
        },
        {
            "ID_LOJA": 5,
            "NUMERO_LOJA": 4,
            "NOME_LOJA": "Loja 4",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 1,
            "id": 1,
            "NOME_REDE": "Big Farma"
        },
        {
            "ID_LOJA": 6,
            "NUMERO_LOJA": 5,
            "NOME_LOJA": "Loja 5",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 1,
            "id": 1,
            "NOME_REDE": "Big Farma"
        },
        {
            "ID_LOJA": 7,
            "NUMERO_LOJA": 1,
            "NOME_LOJA": "Loja 1",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 2,
            "id": 2,
            "NOME_REDE": "Bom Preço"
        },
        {
            "ID_LOJA": 8,
            "NUMERO_LOJA": 2,
            "NOME_LOJA": "Loja 2",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 2,
            "id": 2,
            "NOME_REDE": "Bom Preço"
        },
        {
            "ID_LOJA": 9,
            "NUMERO_LOJA": 3,
            "NOME_LOJA": "Loja 3",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 2,
            "id": 2,
            "NOME_REDE": "Bom Preço"
        },
        {
            "ID_LOJA": 10,
            "NUMERO_LOJA": 1,
            "NOME_LOJA": "Loja 1",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 3,
            "id": 3,
            "NOME_REDE": "Droga Fácil SE"
        },
        {
            "ID_LOJA": 11,
            "NUMERO_LOJA": 2,
            "NOME_LOJA": "Loja 2",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 3,
            "id": 3,
            "NOME_REDE": "Droga Fácil SE"
        },
        {
            "ID_LOJA": 12,
            "NUMERO_LOJA": 3,
            "NOME_LOJA": "Loja 3",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 3,
            "id": 3,
            "NOME_REDE": "Droga Fácil SE"
        },
        {
            "ID_LOJA": 13,
            "NUMERO_LOJA": 4,
            "NOME_LOJA": "Loja 4",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 3,
            "id": 3,
            "NOME_REDE": "Droga Fácil SE"
        },
        {
            "ID_LOJA": 14,
            "NUMERO_LOJA": 5,
            "NOME_LOJA": "Loja 5",
            "IP_LOJA": "26.000.123.100",
            "PORTA_LOJA": 1414,
            "LOGIN_LOJA": "sa",
            "SENHA_LOJA": "S124657251",
            "REDEID": 3,
            "id": 3,
            "NOME_REDE": "Droga Fácil SE"
        }
    ]
}
```
##### Falha na autenticação! 403
Caso essa resposta aconteça significa que aconteceu alguma falha durante o processo de autenticação. Motivos: 
Você não está autenticado, O usuário não tem permissão, Token inválido, Token expirado.

Exemplos de respostas:
``` 
{
    "err": "Você não está autenticado"
}
```

### POST /replic
Esse endpoint é responsável por trazer os dados de replicação de determinada loja.
#### Parâmetros
array: Aqui você envia um JSON do array gerado anteriormente.

Exemplo:
```
{
    "array": {
        "ID_LOJA": 3,
        "NUMERO_LOJA": 2,
        "NOME_LOJA": "Loja 2",
        "IP_LOJA": "26.000.123.100",
        "PORTA_LOJA": 1414,
        "LOGIN_LOJA": "sa",
        "SENHA_LOJA": "S124657251",
        "REDEID": 1,
        "id": 1,
        "NOME_REDE": "Big Farma"
    }
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber os dados de replicação daquela loja em que você fez a requisição.

Exemplos de respostas:
```
{
    "success": "Requisição feita com sucesso",
    "newArray": {
        "ID_LOJA": 2,
        "NUMERO_LOJA": 1,
        "NOME_LOJA": "Loja 1",
        "IP_LOJA": "26.000.123.100",
        "PORTA_LOJA": 1414,
        "LOGIN_LOJA": "sa",
        "SENHA_LOJA": "S124657251",
        "REDEID": 1,
        "id": 1,
        "NOME_REDE": "Big Farma",
        "result": [
        {
            "IDLojaDestino": 1,
            "QuantidadesDeComandos": 281
        },
        {
            "IDLojaDestino": 4,
            "QuantidadesDeComandos": 163
        }
    ]
    }
}
```
```
{
    "success": "Requisição feita com sucesso",
    "newArray": {
        "ID_LOJA": 3,
        "NUMERO_LOJA": 2,
        "NOME_LOJA": "Loja 2",
        "IP_LOJA": "26.000.123.100",
        "PORTA_LOJA": 1414,
        "LOGIN_LOJA": "sa",
        "SENHA_LOJA": "S124657251",
        "REDEID": 1,
        "id": 1,
        "NOME_REDE": "Big Farma",
        "result": [
            {
                "semComandos": "Não existem comandos pendentes"
            }
        ]
    }
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que a conexão com a loja não ocorreu, o array será retornado para você com o atributo err inserido no
JSON. Motivos: 
Servidor da loja destino desligado, sem internet ou configurações da loja estão erradas.

Exemplo de resposta:
```
{
    "ID_LOJA": 6,
    "NUMERO_LOJA": 5,
    "NOME_LOJA": "Loja 5",
    "IP_LOJA": "26.000.123.100",
    "PORTA_LOJA": 1414,
    "LOGIN_LOJA": "sa",
    "SENHA_LOJA": "S124657251",
    "REDEID": 1,
    "id": 1,
    "NOME_REDE": "BigFarmaMA",
    "err": "Ocorreu um erro de conexão"
}
```

### POST /network
Esse endpoint é responsável por fazer a criação de uma rede.
#### Parâmetros
network: Nesse parâmetro você informa o nome da rede que deseja cadastrar.

Exemplo:
```
{
    "network": "Drogasil"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação da criação da rede.

Exemplo de resposta:
```
{
    "success": "Rede cadastrada com sucesso!"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que a rede que está tentando criar já existe. Motivos: 
A rede já foi cadastrada anteriormente.

Exemplo de resposta:
```
{
    "err": "Já existe uma rede criada com o nome Drogasil"
}
```

### POST /store
Esse endpoint é responsável por fazer a criação de uma loja.
#### Parâmetros
numberStoreNewStore: Nesse parâmetro você informa o número da loja.

nameStore: Nesse parâmetro você informa o nome da loja.

ipStore: Nesse parâmetro você informa o ip da loja.

selected: Nesse parâmetro você informa o id da rede que esta loja pertence.

doorIP: Nesse parâmetro você informa a porta para acessar o banco de dados da loja.

login: Nesse parâmetro você informa o login para acessar o banco de dados da loja.

password: Nesse parâmetro você informa a senha para acessar o banco de dados da loja.

Exemplo:
```
{
    "numberStoreNewStore": "5",
    "nameStore": "Loja 5",
    "ipStore": "192.168.1.100",
    "selected": "1",
    "doorIP": "1414",
    "login": "sa",
    "password": "123456789"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação da criação da loja.

Exemplo de resposta:
```
{
    "success": "Loja cadastrada com sucesso"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que algum dos parâmetros não foram preenchidos, o sistema enviará exatamente o campo que não foi preenchido. Motivos: 
Algum parâmetro não foi preenchido.

Exemplo de respostas:
```
{
    "err": "Número da loja precisa ser preenchido"
}
```
```
{
    "err": "Nome da loja precisa ser preenchido"
}
```
```
{
    "err": "IP da loja precisa ser preenchido"
}
```
```
{
    "err": "Rede da loja precisa ser preenchido"
}
```
```
{
    "err": "Porta da loja precisa ser preenchido"
}
```
```
{
    "err": "Login da loja precisa ser preenchido"
}
```
```
{
    "err": "Senha da loja precisa ser preenchido"
}
```

### POST /post
Esse endpoint é responsável por cadastrar uma postagem na base de dados.
#### Parâmetros
title: Nesse parâmetro você informa o título da postagem que deseja cadastrar.

desc: Nesse parâmetro você informa a descrição da postagem que deseja cadastrar, podendo colocar qualquer conteúdo html como títulos, links, parágrafos, alinhamentos etc para melhorar a visualização do usuário.

status: Nesse parâmetro você informa o status da postagem que deseja cadastrar, geralmente sendo 0 para inativo e 1 para postagem ativa.

moduleId: Nesse parâmetro você informa o id referente ao módulo dessa postagem que deseja cadastrar, os ids eu informei no front end, sendo
o id 1 referenciado o Maximus Lite, o id 2 referenciando o Maximus Administrativo, o id 3 referenciando o Maximus Balcão e o id 4 referenciado o Maximus Caixa.

Exemplo:
```
{
    "title" : "Como criar um cadastro de um produto",
    "desc" :  "Descrição de como cadastrar um produto...",
    "status" : "1",
    "moduleId" : "2"
}
```
```
{
    "title" : "Como criar um cadastro de um produto",
    "desc" :  "<h3> Subtítulo </h3> <p> Primeiramente você vai... </p> <a href='https://www.youtube.com/'>Acessar vídeo explicativo</a>",
    "status" : "1",
    "moduleId" : "2"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação do cadastro da postagem.

Exemplo de resposta:
```
{
    "success": "Postagem salva com sucesso"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o título informado pelo usuário já está cadastrado na base de dados. Motivos: 
Postagem com o mesmo título já existe na base de dados.

Exemplos de respostas:
``` 
{
    "err": "Já existe uma postagem com este título"
}
```

### GET /posts
Esse endpoint é responsável por retornar a listagem de todas as postagens cadastrados no banco de dados.
#### Parâmetros
Nenhum
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a listagem de todos as postagens.

Exemplo de resposta:
```
{
    "arrayPosts": [
        {
            "ID_POST": 2,
            "TITULO": "Como cadastrar produto",
            "SLUG": "como-cadastrar-produto",
            "DESCRICAO": "<p>asd</p>",
            "ATIVO": 1,
            "CODMODULO": 2
        },
        {
            "ID_POST": 3,
            "TITULO": "Como configurar contingência",
            "SLUG": "como-configurar-contingencia",
            "DESCRICAO": "<iframe class=\"ql-video ql-align-center\" frameborder=\"0\" allowfullscreen=\"true\" src=\"https://www.youtube.com/embed/lERj7MrZKN8?showinfo=0\"></iframe><p class=\"ql-align-center\"><br></p>",
            "ATIVO": 1,
            "CODMODULO": 4
        }
    ]
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que aconteceu alguma falha durante o processo de leitura dos dados. Motivos: 
Sistema fora do ar.

Exemplos de respostas:
``` 
{
    "err": Não foi possível carregar as postagens"
}
```

### GET /post
Esse endpoint é responsável por retornar os dados de uma postagem cadastrada na base de dados.
#### Parâmetros
Obs: O parâmetro para este endpoint deve ser passado pelo params e não no corpo da requisição como estava sendo feito anteriormente.
slug: Você pode encontrar o slug da postagem fazendo uma requisição GET para a rota /posts e pegando o valor do atributo SLUG no JSON retornado.

Exemplo:
```
slug: como-criar-um-cadastro-de-um-produto
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber os dados da respectiva postagem.

Exemplo de resposta:
```
{
    "post": {
        "ID_POST": 5,
        "TITULO": "Como criar um cadastro de um produto",
        "SLUG": "como-criar-um-cadastro-de-um-produto",
        "DESCRICAO": "Descrição de como cadastrar um produto...",
        "ATIVO": 1,
        "CODMODULO": 2
    }
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que a postagem não foi encontrada. Motivos: 
A postagem não existe na base de dados, slug informado não pertence a nenhuma postagem.

Exemplo de resposta:
``` 
{
    "err": "Não foi possível carregar a postagem"
}
```

### DELETE /post/:slug
Esse endpoint é responsável por excluir o cadastro de uma postagem.
#### Parâmetros
slug: Slug da postagem que deseja remover, o slug deve ser informado na URL de conexão com o endpoint.

Exemplos:
```
/post/como-criar-um-cadastro-de-um-produto
```
```
/post/como-configurar-contingencia
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que a postagem foi excluída.

Exemplo de resposta:
```
{
    "success": "Postagem excluida com sucesso"
}
```
##### Falha na requisição! 404
Caso essa resposta aconteça significa que a postagem não foi encontrada. Motivos: 
A postagem não existe na base de dados, slug informado não pertence a nenhuma postagem.

Exemplo de resposta:
``` 
{
    "err": "Não foi possível carregar a postagem"
}
```

### PATCH /post
Esse endpoint é responsável por editar os dados de uma postagem.
#### Parâmetros
idPost: Neste parâmetro você informa o id da postagem que deseja alterar.

title: Nesse parâmetro você informa o novo título da postagem.

desc: Nesse parâmetro você informa a nova descrição da postagem.

status: Nesse parâmetro você informa o novo status da postagem.

moduleId: Nesse parâmetro você informa o novo id referente ao módulo dessa postagem.

Exemplo:
```
{
    "idPost": "4",
    "title" : "Novo Título",
    "desc" :  "Nova Descrição.......",
    "status" : "0",
    "moduleId" : "1"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação que a edição da postagem foi concluída e o novo slug da postagem.

Exemplo de resposta:
```
{
    "success": "Postagem alterada com sucesso",
    "slug": "novo-titulo"
}
```
##### Falha na edição da postagem! 406
Caso essa resposta aconteça significa que a edição da postagem não foi concluída. Motivos: 
Título ou id da postagem não foram preenchidos ou então já existe uma postagem com o mesmo título informado cadastrado na base de dados.

Exemplo de resposta:
```
{
    "err": "Título da postagem precisa ser preenchido"
}
```
```
{
    "err": "ID da postagem precisa ser preenchido"
}
```
```
{
    "err": "Já existe uma postagem com este título"
}
```

### DELETE /store/:id
Esse endpoint é responsável por excluir o cadastro de uma loja.
#### Parâmetros
id: Id do usuário que deseja remover, o id deve ser informado na URL de conexão com o endpoint.

Exemplos:
```
/store/81
```
```
/store/82
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que a loja foi excluída.

Exemplo de resposta:
```
{
    "success": "Loja excluida com sucesso"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que a exclusão da loja não ocorreu. Motivos: 
Não existe uma loja na base de dados com o id informado na requisição.

Exemplo de resposta:
``` 
{
    "err": "Nenhuma loja foi encontrada com os parâmetros informados"
}
```

### PATCH /store
Esse endpoint é responsável por editar os dados de uma loja.
#### Parâmetros
idStore: Nesse parâmetro você informa o id da loja que deseja alterar.

editNumberStoreNewStore: Nesse parâmetro você informa o novo número da loja.

editNameStore: Nesse parâmetro você informa o novo nome da loja.

editIpStore: Nesse parâmetro você informa o novo ip da loja.

editSelected: Nesse parâmetro você informa o novo id da rede que esta loja pertence.

editDoorIP: Nesse parâmetro você informa a nova porta para acessar o banco de dados da loja.

editLogin: Nesse parâmetro você informa o novo login para acessar o banco de dados da loja.

Exemplo:
```
{
    "idStore": "73",
    "editNumberStoreNewStore": "22",
    "editNameStore": "Loja 22",
    "editIpStore": "192.168.1.100",
    "editSelected": "5",
    "editDoorIP": "1715",
    "editLogin": "user"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a confirmação que a edição da loja foi concluída.

Exemplo de resposta:
```
{
    "success": "Loja alterada com sucesso"
}
```
##### Falha na edição da loja! 406
Caso essa resposta aconteça significa que a edição da loja não foi concluída. Motivos: 
O id informado não pertence a nenhuma loja ou algum dos parâmetros não foram informados.

Exemplos de respostas:
```
{
    "err": "Não foi encontrada nenhuma loja com o id informado"
}
```
```
{
    "err": "Não foi informado o id da loja que deseja alterar"
}
```
```
{
    "err": "Não foi informado o número da loja"
}
```
```
{
    "err": "Não foi informado o nome da loja"
}
```
```
{
    "err": "Não foi informado o ip da loja"
}
```

### POST /validate
Esse endpoint é responsável por verificar se o usuário logado é válido.
#### Parâmetros
redeUser: Nesse parâmetro você informa a rede do usuário, caso ele não tenha uma rede informe null no parâmetro ou não informe o parâmetro.

roleUser: Nesse parâmetro você informa o cargo do usuário.

loginUser: Nesse parâmetro você informa o login do usuário.

Exemplo:
```
{
    "roleUser": "M",
    "loginUser": "MAXIMUS"
}
```
```
{
    "redeUser": "null",
    "roleUser": "M",
    "loginUser": "MAXIMUS"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a mensagem OK, ou seja, o cadastro do usuário na base de dados tem os mesmos dados informados nos parâmetros logo a cima.

Exemplo de resposta:
```
Ok
```
##### Falha na requisição! 400
Caso essa resposta aconteça significa que o parâmetro roleUser ou o loginUser não foram informados na requisição. Motivos: 
Algum dos parâmetros não foram informados.

Exemplos de respostas:
``` 
{
    "err": "O cargo do usuário não foi enviado, não foi possível fazer a verificação"
}
```
``` 
{
    "err": "O login do usuário não foi enviado, não foi possível fazer a verificação"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o usuário não é válido. Motivos: 
O cadastro do usuário na base de dados não possui os mesmos dados informados nos parâmetros logo a cima.

Exemplo de resposta:
``` 
{
    "err": "Usuário inválido"
}
```
