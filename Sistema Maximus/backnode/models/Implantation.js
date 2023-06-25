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

                insert into IMPLANTACAO (IMP_CODIMP, IMP_CODLOJA, IMP_CODITEM, IMP_STATUSOK, ETAPA_CODETAPA, ITEM_CODETAPA) 
                (   
                    select @IMP_CODIMP, ${ID_STORE}, itens.COD_ITEM, 0, etapas.COD_ETAPA, itens.ITEM_CODETAPA from ITENS_IMPLANTACAO itens 
                    inner join ETAPAS_IMPLANTACAO etapas on itens.ITEM_CODETAPA = etapas.COD_ETAPA 
                )

                insert into DATAS_IMPLANTACAO (DATASIMP_CODETAPA, CODIMP_IMP, DATASIMP_CODLOJA, DATASIMP_DATAINICIAL, DATASIMP_DATAFINAL, DATASIMP_CODIGO, DATASIMP_USUARIOS, DATASIMP_OBSMARCADA, DATASIMP_OBSETAPA)
                (
            	    select distinct ITEM_CODETAPA, IMP_CODIMP, IMP_CODLOJA, convert(date,GETDATE()), '', cast(IMP_CODIMP as varchar) + '' + cast(IMP_CODLOJA as varchar) + '' + cast(ETAPA_CODETAPA as varchar), (select USADESC_ETAPA from ETAPAS_IMPLANTACAO where COD_ETAPA = ETAPA_CODETAPA), 0, (select DESCTEXT_ETAPA from ETAPAS_IMPLANTACAO where COD_ETAPA = ETAPA_CODETAPA) from IMPLANTACAO where IMP_CODIMP = @IMP_CODIMP
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

    async findImplants(){
        try {
            var result = await knex.raw(`
                select IMP_CODIMP, loja.RAZAO_LOJA, loja.CNPJ_LOJA, loja.ID_LOJA, loja.ENDERECO_LOJA, loja.SISTEMA_LOJA, etapas.COD_ETAPA, etapas.DESC_ETAPA, itens.COD_ITEM, itens.DESC_ITEM, implantacao.IMP_STATUSOK, implantacao.IMP_USUARIOSITEM, datas.DATASIMP_DATAINICIAL, datas.DATASIMP_DATAFINAL, datas.DATASIMP_USUARIOS from IMPLANTACAO implantacao
                inner join loja loja on loja.ID_LOJA = implantacao.IMP_CODLOJA
                inner join ETAPAS_IMPLANTACAO etapas on etapas.COD_ETAPA = implantacao.ETAPA_CODETAPA
                inner join ITENS_IMPLANTACAO itens on implantacao.IMP_CODITEM = itens.COD_ITEM
                inner join DATAS_IMPLANTACAO datas on datas.DATASIMP_CODIGO = cast(implantacao.IMP_CODIMP as varchar) + cast(loja.ID_LOJA as varchar) + cast(etapas.COD_ETAPA as varchar)
            `)
            return result;
        } catch(err) {
            return undefined;
        }
    }
    
    async findUserImplants(IMP_CODIMP, IMP_CODLOJA){
        try {
            var result = await knex.raw(`
                select 
                    CODIMP_IMP, 
                    DATASIMP_CODLOJA, 
                    DATASIMP_CODETAPA, 
                    DATASIMP_CODIGO, 
                    DATASIMP_USUARIOS 
                from DATAS_IMPLANTACAO
                where CODIMP_IMP = ${IMP_CODIMP}
	            and DATASIMP_CODLOJA = ${IMP_CODLOJA}
            `)
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async editImplant(IMP_CODIMP, IMP_CODLOJA, IMP_STATUSOK, IMP_CODITEM, ETAPA_CODETAPA, ITEM_CODETAPA){
        try {
            var result = await knex.where('IMP_CODIMP', '=', IMP_CODIMP).
            where("IMP_CODITEM", "=", IMP_CODITEM).
            where("IMP_CODLOJA", "=", IMP_CODLOJA).
            where("ETAPA_CODETAPA", "=", ETAPA_CODETAPA).
            where("ITEM_CODETAPA", "=", ITEM_CODETAPA).
            update({
                IMP_STATUSOK: IMP_STATUSOK
            }).table("IMPLANTACAO")

            return result;
        } catch(err) {
            return undefined;
        }
    }

    async usersEdit(DATASIMP_CODLOJA, DATASIMP_CODETAPA, CODIMP_IMP, DATASIMP_USUARIOS){
        try {
            var result = await knex.where('DATASIMP_CODLOJA', '=', DATASIMP_CODLOJA).
            where('DATASIMP_CODETAPA', '=', DATASIMP_CODETAPA).
            where('CODIMP_IMP', '=', CODIMP_IMP).
            update({ 
                DATASIMP_USUARIOS: DATASIMP_USUARIOS.toString() 
            }).table("DATAS_IMPLANTACAO")
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async usersEditImp(IMP_CODLOJA, ETAPA_CODETAPA, IMP_CODIMP, IMP_USUARIOSITEM, IMP_CODITEM){
        try {
            var result = await knex.where('IMP_CODLOJA', '=', IMP_CODLOJA).
            where('ETAPA_CODETAPA', '=', ETAPA_CODETAPA).
            where('IMP_CODIMP', '=', IMP_CODIMP).
            where('IMP_CODITEM', '=', IMP_CODITEM).
            update({ 
                IMP_USUARIOSITEM: IMP_USUARIOSITEM.toString() 
            }).table("IMPLANTACAO")
            return result;
        } catch(err) {
            return undefined;
        }
    }
    
}

module.exports = new Implantation();