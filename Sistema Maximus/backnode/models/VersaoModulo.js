var knex = require("../database/database");

class NotaVersao{
    async new(idModulo, numeroVersao, dataVersao, idVersao){
        try {
            let insertDataVersao = dataVersao ? `cast('${dataVersao}' as datetime)` : `null`;

            let queryInsert = `
                insert into VersoesModulos (IdModulo, NumeroVersao, DataVersao, IdVersao)
                values (${idModulo}, '${numeroVersao}', ${insertDataVersao}, ${idVersao})
            `;

            let result = await knex.raw(queryInsert);
            return result;
        } catch(err) {
            console.error("Erro ao atualizar data de publicação: ", err);
            return undefined;
        }
    }

    async find(){
        let result = await knex.raw(`
            select 
                ID, 
                IdModulo, 
                NumeroVersao, 
                DataVersao,
                IdVersao
            from VersoesModulos
        `)

        return result;
    }
    
    async findById(id){
         try {
            let result = await knex.select().where({ID: id}).from("VersoesModulos");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }
    
    async findByIdModuleAndVersionNumber(idModulo, numeroVersao){
         try {
            let result = await knex.select().where({IdModulo: idModulo}).where({ NumeroVersao: numeroVersao }).from("VersoesModulos");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }

    async edit(id, idModulo, numeroVersao, dataVersao, idVersao){
        try {
            let set = dataVersao ? `DataVersao = cast('${dataVersao}' as datetime)` : `DataVersao = null`;
            let queryUpdate = `update VersoesModulos set ${set}, IdModulo = ${idModulo}, NumeroVersao = '${numeroVersao}', IdVersao = ${idVersao} where ID = ${id} `; 
                
            let result = await knex.raw(queryUpdate)
            return result;
        } catch(err) {
            console.error("Erro ao atualizar data de publicação: ", err);
            return undefined;
        }
    }

    async delete(id){
        try {
            const notasVersoesResult = await knex("NotasVersoes").where({ IdVersaoModulo: id }).delete();
            const result = await knex("VersoesModulos").where({ ID: id }).delete();

            // result = número de linhas deletadas
            if (result > 0) {
                return true;
            } else {
                return false;
            }
        } catch(err) {
            console.error("Erro ao atualizar data de publicação: ", err);
            return undefined;
        }
    }
}

module.exports = new NotaVersao();