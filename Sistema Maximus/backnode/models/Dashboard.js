var database = require("../database/database");

class Dashboard{
    async findUsers(){
        try {
            var result = await database.raw(`
                select 
                    USUARIO_ID, 
                    LOGIN_USUARIO, 
                    cast(DATA_CHECAGEM as datetime) as DataChecagem 
                from DATA_REPLICACAO
                inner join USUARIO on USUARIO.ID_USUARIO = USUARIO_ID
                order by DataChecagem asc
            `);

            return result;
        } catch(err) {
            return err;
        }
    }

    async countDataUsers(dataIni, dataFim){
        try {
            if(dataIni != undefined && dataFim != undefined){
              var result = await database.select("USUARIO_ID", "LOGIN_USUARIO").table("DATA_REPLICACAO").innerJoin("USUARIO", "USUARIO.ID_USUARIO", "USUARIO_ID").count("DATA_CHECAGEM as ContagemChecagem").groupBy('USUARIO_ID').groupBy('LOGIN_USUARIO')
                .whereBetween('DATA_CHECAGEM', [''+dataIni+'', ''+dataFim+'']);
                return result;
            } else{
                var result = await database.raw(`
                    select 
                        USUARIO_ID, 
                        LOGIN_USUARIO,
                        count(DATA_CHECAGEM) as ContagemChecagem
                    from DATA_REPLICACAO
                    inner join USUARIO on USUARIO.ID_USUARIO = USUARIO_ID
                    group by USUARIO_ID, LOGIN_USUARIO
                `);
                return result;
            }

        } catch(err) {
            return err;
        }
    }
}

module.exports = new Dashboard();