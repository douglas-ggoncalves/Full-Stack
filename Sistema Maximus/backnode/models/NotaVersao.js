var knex = require("../database/database");

class NotaVersao{
    async new(titulo, descricao, idVersaoModulo){
        try {
            let result = await knex.raw(`
                insert into NotasVersoes (Titulo, Descricao, IdVersaoModulo)
                values ('${titulo}', '${descricao}', ${idVersaoModulo})
            `)
           
            return result;
        } catch(err) {
            console.error("Erro ao criar os dados: ", err);
            return undefined;
        }
    }

    async find(){
        let result = await knex.raw(`
            select 
                ID, 
                Titulo, 
                Descricao, 
                IdVersaoModulo
            from NotasVersoes
        `)

        return result;
    }
    
    async findById(id){
         try {
            let result = await knex.select().where({ID: id}).from("NotasVersoes");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }

    async edit(id, titulo, descricao, idVersaoModulo){
        try {
            let result = await knex.raw(`
                update NotasVersoes
                set 
                    Titulo = '${titulo}',
                    Descricao = '${descricao}',
                    IdVersaoModulo = '${idVersaoModulo}'
                where ID = ${id}
            `);
           
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async delete(id){
        try {
            const result = await knex("NotasVersoes").where({ ID: id }).delete();

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