var User = require("../models/User");
var jwt = require("jsonwebtoken");
var secret = "as55a6a5as5d4a5qvjnkalçKASNFJLkakfnJKKjknldjsn";
var bcrypt = require("bcrypt");
const PasswordTokens = require("../models/PasswordTokens");
const nodemailer = require("nodemailer");
const serverIP = require("../../connection/frontConnection.json")
const emailData = require("../../connection/gmailConnection.json")
var jwt = require("jsonwebtoken");
var secret = "as55a6a5as5d4a5qvjnkalçKASNFJLkakfnJKKjknldjsn";

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: "douglasrnn62@gmail.com",
        pass: ""
    }
})

class UserController{
    async login(req, res) {
        var login = await req.body.login;
        var password = await req.body.password;
        var user = await User.findLogin(login);

        if(user != undefined) {
            var result = await bcrypt.compare(password, user.SENHA_USUARIO);
            if(result) {
                console.log("resulttttt ")
                var token = await jwt.sign({ idNetworkUser: user.RedesAssociadas, role: user.CARGO_USUARIO }, secret);
                res.status(200);
                res.send({token: token, user: user})
            } else {
                res.status(406);
                res.send({err: "Senha incorreta"});
            }
        } else{
            res.status(406);
            res.json({status: false, err: "O usuário informado não existe"})
        }
    }

    async create(req, res) {
        var login = await req.body.login;
        var email = await req.body.email;
        var password = await req.body.password;
        var role = await req.body.role;
        var networkId = await req.body.networkId;
        var isFuncNew = await req.body.isFuncNew;
        
        try{
            if(login != undefined && password != undefined){
                var loginExists = await User.findLogin(login);
                var loginEmail = await User.findEmail(email);
                
                if(loginExists != undefined){
                    res.status(404)
                    res.send({err: "Já existe um usuário com este login"})
                    return
                } else{
                    if(loginEmail != undefined){
                        res.status(404)
                        res.send({err: "Já existe um usuário com este email"})
                        return
                    } else{
                        var newUser = await User.newUser(login, email, password, role, networkId, isFuncNew)
                        if(newUser != undefined){
                            res.send({success: "Usuário criado com sucesso"})
                            return;
                        } else {
                            res.status(406);
                            res.send({err: 'Ocorreu um erro ao tentar cadastrar o usuário, verifique os dados informados e tente novamente'});
                            return;
                        }
                    }
                }
            }
        } catch(err)  {
            res.send({err: 'Ocorreu um erro ' + err});
            res.status(406);
            return;
        }
    }

    async recoveryPassword(req, res) {
        var email = await req.body.email;
        var result = await PasswordTokens.create(email);
        if(result.status){
            res.status(200);
            res.send("" + result.token);
            
            transporter.sendMail({
                from: "Maximus Gestão <douglasrnn1@gmail.com>",
                to: `${email}`,
                subject: "Recuperação de senha - Maximus Gestão",
                attachments: [{
                    filename: 'Logo Maximus',
                    path: '../../Sistema Maximus/frontvue/src/assets/img/logo_maximus_gestao.png',
                    cid: 'logo'
                }],
                html: `<html>
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>Pseudoclasse Hover</title>
                    <style type="text/css">
                        #divMain{
                            position: relative;
                            align-items: center;
                            background-color: rgb(250, 250, 250);
                            color: black;
                            font-family: Avenir, Helvetica, Arial, sans-serif;
                        }
                        
                        #divTitle{
                            background-color: blue; 
                            width: 100%; 
                            color: white; 
                            display: block; 
                            padding: 1rem;
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                        }
                        
                        #divData{
                            padding: 0 1rem;
                        }
                        
                        h4{
                            margin: auto;
                        }
                        
                        h5{
                            margin-bottom: 1rem;
                            margin-top: 1rem;
                        }
                        
                        h6{
                            font-size: 1.15rem;
                        }
                        
                        a{
                            font-size: 1.1rem;
                            margin-bottom: .5rem;
                            margin-top: .5rem;
                            color: blue !important; 
                            text-decoration: none;
                        }
                        
                        footer{
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                        }
                        
                        img{
                            max-width: 100%;
                            height: 150px;
                        }
                    </style>
                </head>
                 
                <body>
                    <div id="divMain">
                        <div id="divTitle">
                            <h4>Código de verificação da Maximus</h4>
                        </div>
                        
                        <div id="divData">
                            <h6>Prezado cliente</h6>
                            <h5>
                                Este e-mail foi enviado para ajudar na recuperação de acesso à sua Conta da Maximus:
                            </h5>
                            <a href="${serverIP.address}/conta/${result.token}">Clique aqui para recuperar sua senha</a>
                    
                            <h5>
                                Se você não solicitou esse código provavelmente outra pessoa esteja tentando acessar a sua conta <b>${email}</b> Não encaminhe ou mostre esse e-mail a ninguém.
                            </h5>
                        </div>
                    
                        <footer>
                            <img src="cid:logo" alt="">
                        </footer>
                    </div>`,
            }).then(message => {
                console.log(message)
                res.status(200)
                res.send({success: "E-mail enviado com sucesso"})
            }).catch(err => {
                console.log(err)
                res.status(406);
                res.send({err: err})
            })
        } else{
            res.status(406);
            res.send({err: result.err});
        }
    }

    async delete(req, res) {
        var login = req.params.login;

        if(login != undefined){
            var loginExists = await User.findLogin(login);

            if(loginExists != undefined){ // login existe
                res.status(200)
                var userDeleted = await User.deleteUser(login);
                if(userDeleted) {
                    res.send({success: "Usuário excluido"})
                    return
                }
                else{
                    res.status(404)
                    res.send({err: `Ocorreu um erro ao tentar excluir ${login}`})
                }
            } else{
                res.status(404)
                res.send({err: `Ocorreu um erro ao tentar excluir ${login}`})
            }
        }
    }

    async edit(req, res) {
        var login = await req.body.editLoginUser;
        var role = await req.body.editRoleUser;
        var network = await req.body.editRoleNetwork;
        var idUser = await req.body.idUser;
        var passwordUser = await req.body.passwordUser;
        var alterPassword = await req.body.alterPassword;
        var editIsFunc = await req.body.editIsFunc;

        try{
            var loginExists = await User.findLogin(login);

            if(loginExists != undefined && loginExists.ID_USUARIO != idUser){ // login existe e não é o mesmo login do usuário que mandou requisição
                res.status(404);
                res.send({err: "Já existe um usuário com este login"});
                return;
            } else {
                if(login != undefined && idUser != undefined){
                    var idExist = await User.findUserById(idUser);
                    
                    if(idExist != undefined){ // login existe
                        var editUser = await User.editUser(login, role, network, idUser, passwordUser, alterPassword, editIsFunc);
                        if(editUser != undefined) {
                            res.status(200);
                            res.send({success: "Usuário editado com sucesso"});
                            return;
                        } else{
                            res.status(404);
                            res.send({success: "Não foi possível editar o usuário"});
                        }
                    } else{
                        res.status(404);
                        res.send({err: "Usuário não encontrado, não foi possível alterar o mesmo"});
                    }
                }
            }
        } catch(err)  {
            res.send({err: 'Ocorreu um erro ' + err});
            res.status(406);
            return;
        }
    }

    async editPhoto(req, res) {
        var idUser = await req.body.ID_USUARIO;
        var base64 = await req.body.IMG_USUARIO;

        try{
            var idExist = await User.findUserById(idUser);
            
            if(idExist != undefined){ // login existe
                var editUserPassword = await User.editUserPassword(idUser, base64);
                if(editUserPassword != undefined) {
                    res.status(200);
                    res.send({success: "Imagem alterada com sucesso."});
                    return;
                } else{
                    res.status(404);
                    res.send({success: "Não foi possível editar a imagem."});
                }
            } else{
                res.status(404);
                res.send({err: "Usuário não encontrado, não foi possível alterar o mesmo."});
            }
        } catch(err)  {
            res.send({err: 'Ocorreu um erro ' + err});
            res.status(406);
            return;
        }
    }

    async validateToken(req, res) {
        var token = await req.body.token;
        var tokenIsValid = await PasswordTokens.validate(token);
        
        if(tokenIsValid.status) {
            res.status(200);
            res.send({success: 'Token válido'})
        } else{
            res.status(406);
            res.send({err: "Token inválido"});
        }
    }
    
    async editPassword(req, res) {
        var token = await req.body.token;
        var password = await req.body.password;
        var tokenIsValid = await PasswordTokens.validate(token);

        if(tokenIsValid.status) {
            var editUser = await User.editPasswordUser(password, tokenIsValid.token.USERID_PASSWORDTOKENS)

            if(editUser != undefined) {
                await PasswordTokens.updateToken(token);
                res.status(200);
                res.send({success: "Usuário editado com sucesso"})
                return;
            } else{
                res.status(404)
                res.send({success: "Não foi possível editar o usuário"})
            }
            res.status(200);
            res.send({success: 'Token válido'})
        } else{
            res.status(406);
            res.send("Token inválido");
        }
    }

    async getUsers(req, res) {
        var users = await User.findAllUser();
        res.send(users)
    }

    async validate(req, res) {
        var redeUser = await req.body.redeUser
        var roleUser = await req.body.roleUser
        var loginUser = await req.body.loginUser

        if(roleUser == undefined){
            res.status(400);
            res.send({err:"O cargo do usuário não foi enviado, não foi possível fazer a verificação"});
            return;
        }
        
        if(loginUser == undefined){
            res.status(400);
            res.send({err:"O login do usuário não foi enviado, não foi possível fazer a verificação"});
            return;
        }

        if(redeUser == 'null'){
            redeUser = null;
        }
     
        var users = await User.findAllUser();
        var oneUser = users.filter(user => user.LOGIN_USUARIO == loginUser && user.CARGO_USUARIO == roleUser && user.RedesAssociadas == redeUser)
        console.log("teste de erro: " + oneUser)
        console.log("teste de redeUser: " + redeUser)
        console.log("teste de RedesAssociadas: " + req.body.RedesAssociadas)


        
        if(oneUser != ''){
            res.status(200);
            res.send("Ok");
        } else{
            res.status(406);
            res.send({err:"Usuário inválido"});
        }
    }

    async validateUser(req, res) {
        var redeUser = req.body.redeUser
        var roleUser = req.body.roleUser
        var loginUser = req.body.loginUser

        if(roleUser == undefined){
            res.status(400);
            res.send({err:"O cargo do usuário não foi enviado, não foi possível fazer a verificação"});
            return;
        }
        
        if(loginUser == undefined){
            res.status(400);
            res.send({err:"O login do usuário não foi enviado, não foi possível fazer a verificação"});
            return;
        }

        if(redeUser == 'null'){
            redeUser = null;
        }
     
        var users = await User.findAllUser();
        var oneUser = users.filter(user => user.LOGIN_USUARIO == loginUser && user.CARGO_USUARIO == roleUser && user.RedesAssociadas == redeUser)
        if(oneUser != ''){
            res.status(200);
            res.send("Ok");
        } else{
            res.status(406);
            res.send({err:"Usuário inválido"});
        }
    }
}

module.exports = new UserController();