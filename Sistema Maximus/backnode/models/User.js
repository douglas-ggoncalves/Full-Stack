var knex = require("../database/database");
var bcrypt = require("bcrypt");

class User{
    async findLogin(login) {
        try {
            var result = await knex.select().where({LOGIN_USUARIO: login}).from("USUARIO").leftOuterJoin('rede', 'rede.id', 'USUARIO.REDEID_USUARIO');
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findEmail(email) {
        try {
            var result = await knex.select().where({EMAIL_USUARIO: email}).from("USUARIO").leftOuterJoin('rede', 'rede.id', 'USUARIO.REDEID_USUARIO');
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findUserById(id) {
        try {
            var result = await knex.select().where({ID_USUARIO: id}).from("USUARIO").leftOuterJoin('rede', 'rede.id', 'USUARIO.REDEID_USUARIO');
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async newUser(login, email, password, role, networkId){
        try {
            var hash = await bcrypt.hash(password, 10);
            var result;
            if(networkId == ''){
                result = await knex.insert({LOGIN_USUARIO: login, EMAIL_USUARIO: email, CARGO_USUARIO: role, SENHA_USUARIO: hash}).table("USUARIO");
                return result;
            } else{
                result = await knex.insert({LOGIN_USUARIO: login, EMAIL_USUARIO: email, CARGO_USUARIO: role, SENHA_USUARIO: hash, REDEID_USUARIO: networkId}).table("USUARIO");
                return result;
            }
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async deleteUser(login){
        try {
            var result = await knex.select().where({LOGIN_USUARIO: login}).from("USUARIO").del();
            return result;
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findAllUser(){
        try {
            var result = await knex.select().from("USUARIO").leftOuterJoin('rede', 'rede.id', 'USUARIO.REDEID_USUARIO');
            return result;
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    async editUser(login, role, network, idUser){
        try {
            var result = await knex.where('ID_USUARIO', '=', idUser).update({ LOGIN_USUARIO: login, CARGO_USUARIO: role, REDEID_USUARIO: network }).table("USUARIO")
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async editPasswordUser(password, idUser){
        try {
            var hash = await bcrypt.hash(password, 10);
            var result = await knex.where('ID_USUARIO', '=', idUser).update({ SENHA_USUARIO: hash }).table("USUARIO")
            return result;
        } catch(err) {
            return undefined;
        }
    }
}

module.exports = new User();


