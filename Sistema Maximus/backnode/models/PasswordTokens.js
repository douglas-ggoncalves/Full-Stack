var knex = require("../database/database");
var User = require("./User")
const { v4: uuidv4 } = require('uuid');
class PasswordTokens{
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

    async create(email) {
        var user = await this.findEmail(email);
       
        if(user != undefined) {
            try {
                var token = uuidv4();
                await knex.insert({
                    USERID_PASSWORDTOKENS: user.ID_USUARIO,
                    used: 0,
                    token: token
                }).table("passwordTokens")
                return {status: true, token: token}

            } catch(err) {
                return {status: false, err: err}
            }
        } else {
            return {status: false, err: "O e-mail informado não existe"}
        }
    }

    async validate(token) {
        try {
            var result = await knex.select().table("passwordTokens").where({token: token});

            if(result.length > 0) {
                var tk = result[0];
                if(tk.USED) {
                    return {status: false};
                } else {
                    return {status: true, token: tk};
                }
            } else {
                return {status: false};
            }

        } catch(err){
            console.log(err);
            return {status: false};
        }
    }

    async updateToken(token) {
        await knex.update({USED: 1}).where({TOKEN: token}).table("passwordTokens");
    }
}

module.exports = new PasswordTokens();


