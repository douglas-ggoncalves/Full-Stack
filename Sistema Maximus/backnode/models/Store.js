var knex = require("../database/database");

class Store{
    async getStores() {
        console.log("teste")
        try {
            var result = await knex.select().from("loja").leftOuterJoin('rede', 'rede.id', 'loja.redeid');
                return result;
        } catch(err) {
            return undefined;
        }
    }
}

module.exports = new Store();
