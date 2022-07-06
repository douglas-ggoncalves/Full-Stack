# API de gestão de usuários
Esta API Rest é utilizada para criar, visualizar, editar e excluir usuários.

## Endpoints
### GET /user
Esse endpoint é responsável por retornar a listagem de todos os usuários cadastrados no banco de dados.
#### Parâmetros
Nenhum
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber a listagem de todos os usuários.

Exemplo de resposta:
```
{
    "users": [
        {
            "id": 1,
            "name": "Douglas Gonçalves",
            "email": "douglasrnn62@gmail.com",
            "role": 1
        },
        {
            "id": 8,
            "name": "Douglas",
            "email": "douglasdepaula10@hotmail.com",
            "role": 0
        },
        {
            "id": 9,
            "name": "Rafael",
            "email": "rafael@gmail.com",
            "role": 1
        },
        {
            "id": 10,
            "name": "Julia",
            "email": "ju@gmail.com",
            "role": 1
        },
        {
            "id": 11,
            "name": "Giovanna",
            "email": "giovannaMartins@outlook.com",
            "role": 0
        },
        {
            "id": 12,
            "name": "Maria Eduarda",
            "email": "duda123@gmail.com",
            "role": 1
        },
        {
            "id": 14,
            "name": "comum",
            "email": "comum123@gmail.com",
            "role": 0
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
``` 
{
    "err": "Você não tem permissão para isso"
}
```

### GET /user/id
Esse endpoint é responsável por retornar os dados de um usuário baseado em seu identificador único.
#### Parâmetros
id: Id do usuário cadastrado no sistema.
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber os dados do respectivo usuário.

Exemplo de resposta:
```
{
    "id": 1,
    "name": "Douglas Gonçalves",
    "email": "douglasrnn62@gmail.com",
    "role": 1
}
```
##### Falha na autenticação! 403
Caso essa resposta aconteça significa que o usuário logado não tem acesso a estes dados. Motivos: 
O usuário não tem permissão.

Exemplo de resposta:
``` 
{
    "err": "Você não tem permissão para isso"
}
```
##### Falha na autenticação! 404
Caso essa resposta aconteça significa que o usuário não foi encontrado no banco de dados. Motivos: 
Usuário não encontrado.

Exemplo de resposta:
``` 
{
    "err": "Usuário não encontrado"
}
```

### POST /user
Esse endpoint é responsável por criar um usuário.
#### Parâmetros
Obs: Todos os parâmetros listados abaixo são obrigatórios.

name: Nome que o usuário vai receber em seu cadastro.

email: E-mail que o usuário vai receber em seu cadastro.

password: Senha que o usuário vai receber em seu cadastro.

role: Cargo que o usuário vai receber em seu cadastro, sendo que o número 0 representa o cargo de usuário comum e o número 1 representa os usuários Administradores.

Exemplo:
```
{
    "name": "Usuário",
    "email": "usuario@gmail.com",
    "password": "12345678",
    "role": "0"
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
##### Falha na criação do cadastro do usuário! 400
Caso essa resposta aconteça significa que o cadastro do usuário não foi concluído. Motivos: 
Nome, e-mail, senha ou cargo não informados.

Exemplos de respostas:
```
{
    "err": "E-mail inválido"
}
```
```
{
    "err": "Cargo inválido"
}
```

##### Falha na criação do cadastro do usuário! 406
Caso essa resposta aconteça significa que o cadastro do usuário não foi concluído. Motivos: 
E-mail já está registrado no cadastro de outro usuário.

Exemplo de resposta:
```
{
    "err": "O e-mail já foi cadastrado"
}
```

### PUT /user
Esse endpoint é responsável por editar os dados de um usuário.
#### Parâmetros
id: Id do usuário que deseja alterar os dados, esse parâmetro é obrigatório.

name: Novo nome do usuário. 

role: Novo cargo do usuário, sendo que o número 0 representa o cargo de usuário comum e o número 1 representa os usuários Administradores.

email: Novo e-mail do usuário.

Exemplo:
```
{
    "id": "8",
    "name": "Novo Nome",
    "role": "1",
    "email": "email@outlook.com"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que os dados do usuário foram alterados.

Exemplo de resposta:
```
{
    "success": "Usuário editado"
}
```
##### Falha na autenticação! 403
Caso essa resposta aconteça significa que o usuário logado não tem acesso a estes dados. Motivos: 
O usuário não tem permissão.

Exemplo de resposta:
``` 
{
    "err": "Você não tem permissão para isso"
}
```
##### Falha na autenticação! 404
Caso essa resposta aconteça significa que o usuário não foi encontrado no banco de dados. Motivos: 
Id informado não pertence a nenhum usuário.

Exemplo de resposta:
``` 
{
    "err": "Usuário não encontrado"
}
```

### DELETE /user/id
Esse endpoint é responsável por excluir o cadastro de um usuário.
#### Parâmetros
id: Id do usuário que deseja remover.
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que os dados do usuário foram excluídos.

Exemplo de resposta:
```
{
    "success": "Usuário deletado"
}
```
##### Falha na autenticação! 403
Caso essa resposta aconteça significa que a exclusão do usuário não ocorreu. Motivos: 
O usuário não tem permissão ou não está autenticado.

Exemplos de respostas:
``` 
{
    "err": "Você não tem permissão para isso"
}
```
```
{
    "err": "Você não está autenticado"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o usuário não foi encontrado no banco de dados. Motivos: 
Id informado não pertence a nenhum usuário.

Exemplo de resposta:
``` 
{
    "status": false,
    "err": "O usuário não existe, portanto não pode ser deletado"
}
```

### POST /recoveryPassword
Esse endpoint é responsável por criar um token necessário para editar a senha de um usuário.
#### Parâmetros
Nenhum
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que a requisição foi feita e você receberá o token gerado.

Exemplo de resposta:
```
{
    "token": 1655576373492
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o e-mail informado não existe. Motivos: 
O e-mail informado não existe no banco de dados.

Exemplo de resposta:
``` 
{
    "status": false,
    "err": "O e-mail passado não existe no banco de dados"
}
```

### POST /changePassword
Esse endpoint é responsável por editar a senha de um usuário.
#### Parâmetros
token: Aqui é informado o token gerado anteriormente com a rota POST /recoveryPassword.

password: Aqui é informado a nova senha do usuário.

Exemplo:
```
{
    "token": "1655576373492",
    "password": "123456"
}

```
#### Respostas
##### OK! 200
Caso essa resposta aconteça significa que a senha do usuário foi alterada com sucesso.

Exemplo de resposta:
```
{
    "success": "Senha alterada"
}
```
##### Falha na requisição! 401
Caso essa resposta aconteça significa que a senha não foi informada. Motivos: 
Senha não foi informada.

Exemplo de resposta:
```
{
    "err": "Senha não informada"
}
```
##### Falha na requisição! 406
Caso essa resposta aconteça significa que o token informado é inválido. Motivos: 
Token já utilizado ou inválido.

Exemplo de resposta:
``` 
{
    "err": "Token inválido"
}
```

### POST /login
Esse endpoint é responsável por fazer o processo de login.
#### Parâmetros
email: E-mail do usuário cadastrado no sistema.

password: Senha do usuário cadastrado no sistema com aquele determinado e-mail.

Exemplo:
```
{
    "email": "douglasrnn62@gmail.com",
    "password": "123456"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber o token JWT para conseguir acessar endpoints protegidos na API.

Exemplo de resposta:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvdWdsYXNybm42MkBnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE2NTU1NzcyOTN9.GA5MG5OsgHdO90kpTnwu5X11Mxh61YTuyHR6BuIoHro"
}
```
##### Falha na autenticação! 406
Caso essa resposta aconteça, isso significa que aconteceu alguma falha durante o processo de autenticação. Motivos: E-mail ou senha incorretos.

Exemplos de respostas:
```
{
    "status": false,
    "err": "O usuário não existe"
}
```
``` 
{
    "err": "Senha incorreta"
}
```

### POST /validate
Esse endpoint é responsável por fazer o processo de validação do usuário.
#### Parâmetros
token: Token gerado no momento de login do usuário, este token precisa ser enviado no cabeçalho da requisição, segue abaixo
um exemplo da requisição sendo feita pelo Vue.js pegando o token do local storage.

Exemplo:
```
var req = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem("token")
    }
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber o token JWT para conseguir acessar endpoints protegidos na API.

Exemplo de resposta:
```
{
    "success": "Ok"
}
```
##### Falha na autenticação! 403
Caso essa resposta aconteça significa que o usuário autenticado não tem acesso a rota ou não está logado. Motivos:
Usuário sem permissão ou não autenticado.

Exemplos de respostas:
```
{
    "err": "Você não tem permissão para isso"
}
```
```
{
    "err": "Você não está autenticado"
}
```