var User = require("../models/User");
var PasswordTokens = require("../models/PasswordTokens");
var jwt = require("jsonwebtoken");
var secret = "151515f15b1sf5vada5s1v5ad1vaf";
var bcrypt = require("bcrypt");

class UserController{
    async index(req, res) {
        var users = await User.findAll();
        res.status(200);
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
        var {name, email, password, role} = req.body;
        
        if(email == undefined || email == '') {
            res.status(400);
            res.json({err: "E-mail inválido"})
            return;
        } 

        if(name == undefined || name == '') {
            res.status(400);
            res.json({err: "Nome inválido"})
            return;
        }
        if(name == undefined || name == '') {
            res.status(400);
            res.json({err: "Nome inválido"})
            return;
        }

        if(password == undefined || password == '') {
            res.status(400);
            res.json({err: "Senha inválida"})
            return;
        }
        
        if(role != 0 && role != 1) {
            res.status(400);
            res.json({err: "Cargo inválido"})
            return;
        }

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "O e-mail já foi cadastrado"})
            return;
        }

        var userCad = await User.new(name, email, password, role)
        if(userCad){
            res.status(200);
            res.json({success: "Usuário cadastrado com sucesso!"})
        } else{
            res.status(406);
            res.json({err: "Não foi possível cadastrar o usuário"})
        }
    }

    async edit(req, res) {
        var {id, name, role, email} = req.body;
        var result = await User.update(id, email, name, role);

        if(result != undefined) {
            if(result.status) {
                res.status(200);
                res.send({success: "Usuário editado"});
            } else {
                res.status(406);
                res.send({err: result.err});
            }
        } else {
            res.status(406);
            res.send({err: "Ocorreu ao tentar excluir o usuário"});
        }
    }

    async remove(req, res) {
        var id = req.params.id;
        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send({success: "Usuário deletado"});
        } else{
            res.status(406);
            res.send(result);
        }
    }

    async recoveryPassword(req, res) {
        var email = req.body.email;
        var result = await PasswordTokens.create(email);

        if(result.status){
            res.status(200);
            res.send({token: result.token});
        } else{
            res.status(406);
            res.send(result);
        }
    }

    async changePassword(req, res) {
        var token = req.body.token;
        var password = req.body.password;

        if(password == undefined){
            res.status(401);
            res.send({err: "Senha não informada"});
            return;
        }

        var tokenIsValid = await PasswordTokens.validate(token);

        if(tokenIsValid.status) {
            await User.changePassword(password, tokenIsValid.token.user_id, tokenIsValid.token.token)
            res.status(200);
            res.send({success: "Senha alterada"})
        } else{
            res.status(406);
            res.send({err: "Token inválido"});
            return;
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


