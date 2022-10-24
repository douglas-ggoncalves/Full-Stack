const { json } = require("body-parser");
var knex = require("../database/database")

class Implantation{

    findImpById(IMP_CODLOJA) {
        try {
            var result = knex.select().where({IMP_CODLOJA: IMP_CODLOJA}).from("IMPLANTACAO");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }

    newImp(ID_STORE) {
        try {
            var result = knex.raw(`
                declare @IMP_CODIMP as int = (select isNull(max(IMP_CODIMP), 0) from IMPLANTACAO) + 1

                insert into IMPLANTACAO (IMP_CODIMP, IMP_CODLOJA, IMP_CODITEM, IMP_STATUSOK, ETAPA_CODETAPA , ITEM_CODETAPA) 
                (   
                    select @IMP_CODIMP, ${ID_STORE}, itens.COD_ITEM, 0, etapas.COD_ETAPA, itens.ITEM_CODETAPA from ITENS_IMPLANTACAO itens 
                    inner join ETAPAS_IMPLANTACAO etapas on itens.ITEM_CODETAPA = etapas.COD_ETAPA 
                )

                insert into DATAS_IMPLANTACAO (DATASIMP_CODETAPA, CODIMP_IMP, DATASIMP_CODLOJA, DATASIMP_DATAINICIAL, DATASIMP_DATAFINAL, DATAIMP_CODIGO)
                (
            	    select distinct ITEM_CODETAPA, IMP_CODIMP, IMP_CODLOJA, convert(date,GETDATE()), '', cast(IMP_CODIMP as varchar) + '' + cast(IMP_CODLOJA as varchar) + '' + cast(ETAPA_CODETAPA as varchar) from IMPLANTACAO where IMP_CODIMP = @IMP_CODIMP
                )

            `).then(res => {
                console.log('res ' + res)
            }).catch(err => {
                console.log('err ' + err)
            });
            return result;
        } catch(err) {
            return undefined;
        }
    }
}

module.exports = new Implantation();