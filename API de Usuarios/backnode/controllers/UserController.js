var User = require("../models/User");
var PasswordTokens = require("../models/PasswordTokens");

var jwt = require("jsonwebtoken");
var secret = "151515f15b1sf5vada5s1v5ad1vaf";
var bcrypt = require("bcrypt");

class UserController{
    async index(req, res) {
        var users = await User.findAll();
        res.json({users})
    }

    async findUser(req, res) {
        var id = req.params.id;
        var user = await User.findById(id);

        if(user == undefined) {
            res.status(404);
            res.json({err: "Usuário não encontrado"})
        } else{
            res.status(200);
            res.json(user)
        }
    }

    async create(req, res) {
        var {name, email, password} = req.body;
        
        if(email == undefined || email == '') {
            res.status(400);
            res.json({err: "E-mail inválido"})
            return; // assim que o método encontrar o return o método é encerrado
        } 

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "O e-mail já foi cadastrado"})
            return;
        }

        await User.new(name, email, password)
        res.status(200);
        res.json({success: "E-mail recebido"})
    }

    async edit(req, res) {
        var {id, name, role, email} = req.body;
        var result = await User.update(id, email, name, role);
        if(result != undefined) {
            if(result.status) {
                res.status(200);
                res.send("Tudo ok");
            } else {
                res.status(406);
                res.send(result.err);
            }
        } else {
            res.status(406);
            res.send("Ocorreu um erro no servidor");
        }
    }

    async remove(req, res) {
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo ok");
        } else{
            res.status(406);
            res.send(result.err);
        }
    }

    async recoveryPassword(req, res) {
        var email = req.body.email;

        var result = await PasswordTokens.create(email);

        if(result.status){
            res.status(200);
            res.send("" + result.token);
        } else{
            res.status(406);
            res.send(result.err);
        }
    }

    async changePassword(req, res) {
        var token = req.body.token;
        var password = req.body.password;

        var tokenIsValid = await PasswordTokens.validate(token);

        if(tokenIsValid.status) {
            await User.changePassword(password, tokenIsValid.token.user_id, tokenIsValid.token.token)
            res.status(200);
            res.send("Senha alterada")
        } else{
            res.status(406);
            res.send("Token inválido");
        }
    }

    async login(req, res) {
        var {email, password} = req.body;
        var user = await User.findByEmail(email);

        if(user != undefined) {
            var result = await bcrypt.compare(password, user.password);

            if(result) {
                var token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200);
                res.send({token: token})
            } else {
                res.status(406);
                res.send({err: "Senha incorreta"});
            }
        } else{
            res.status(406);
            res.json({status: false, err: "O usuário não existe"})
        }
    }
}

module.exports = new UserController();


