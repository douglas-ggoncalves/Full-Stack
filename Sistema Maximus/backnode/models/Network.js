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
}

module.exports = new Network();