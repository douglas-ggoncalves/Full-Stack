var knex = require("../database/connection");
var User = require("./User")

class PasswordTokens{
    async create(email) {
        var user = await User.findByEmail(email);

        if(user != undefined) {
            try {
                var token = Date.now();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordTokens")
                return {status: true, token: token}

            } catch(err) {
                console.log(err);
                return {status: false, err: err}
            }
        } else {
            return {status: false, err: "O e-mail passado não existe no banco de dados"}
        }
    }

    async validate(token) {
        try {
            var result = await knex.select().table("passwordTokens").where({token: token});

            if(result.length > 0) {
                var tk = result[0];

                if(tk.used) {
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
        await knex.update({used: 1}).where({token: token}).table("passwordTokens");
    }
}

module.exports = new PasswordTokens();


