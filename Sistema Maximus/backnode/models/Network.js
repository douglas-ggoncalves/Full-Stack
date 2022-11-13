var knex = require("../database/database");

class Network{
    async findAll() {
        try {
            var result = await knex.raw(`
                select id, NOME_REDE, RADMIN_NOMEREDE, RADMIN_SENHAREDE, REDE_REPLICA, ISATIVA from rede
            `)
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async findByName(name){
        var result = await knex.raw(`select * from rede where NOME_REDE = '${name}'`)

        if(result.length > 0){
            return result[0];
        } else{
            return undefined;
        }
    }

    //var result = await knex.select().where({TITULO: title}).table("POSTAGEM")

    async editNetwork(id, NOME_REDE, RADMIN_NOMEREDE, RADMIN_SENHAREDE, REDE_REPLICA, ISATIVA){
        try {
            var result = await knex.where('id', '=', id).update({ NOME_REDE: NOME_REDE, RADMIN_NOMEREDE: RADMIN_NOMEREDE, RADMIN_SENHAREDE: RADMIN_SENHAREDE, REDE_REPLICA: REDE_REPLICA, ISATIVA: ISATIVA }).table("rede")
            return result;
        } catch(err) {
            return undefined;
        }
    }
}

module.exports = new Network();