var knex = require("../database/database");

class Stage{
    async findDesc(DESC_ETAPA) {
        try {
            var result = await knex.select().where({DESC_ETAPA: DESC_ETAPA}).from("ETAPAS_IMPLANTACAO");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }

    async newStage(DESC_ETAPA) {
        try {
            var result = await knex.insert({DESC_ETAPA: DESC_ETAPA}).table("ETAPAS_IMPLANTACAO");

            return result;
        } catch(err) {
            return undefined;
        }
    }

    async findAll() {
        try {
            var result = await knex.select().from("ETAPAS_IMPLANTACAO");
            return result;
        } catch(err) {
            return undefined;
        }
}
}

module.exports = new Stage();
