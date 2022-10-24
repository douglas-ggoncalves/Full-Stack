var knex = require("../database/database");

class Item{
    async findDesc(DESC_ITEM) {
        try {
            var result = await knex.select().where({DESC_ITEM: DESC_ITEM}).from("ITENS_IMPLANTACAO");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }

    async newItem(DESC_ITEM, ITEM_CODETAPA) {
        try {
            var result = await knex.insert({DESC_ITEM: DESC_ITEM, ITEM_CODETAPA: ITEM_CODETAPA}).table("ITENS_IMPLANTACAO");
            return result;
        } catch(err) {
            return undefined;
        }
    }
}

module.exports = new Item();
