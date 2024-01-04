var knex = require("../database/database");
const selectPadrao = 
    `
    select top(1) 
        coalesce(Substancia, '') as Substancia,
        coalesce(CNPJ, '') as CNPJ,
        coalesce(Laboratorio, '') as Laboratorio,
        coalesce(CodigoGGREM, '') as CodigoGGREM,
        coalesce(Registro, '') as Registro,
        coalesce(EAN1, '') as EAN1,
        coalesce(EAN2, '') as EAN2,
        coalesce(EAN3, '') as EAN3,
        coalesce(Produto, '') as Produto,
        coalesce(Apresentacao, '') as Apresentacao,
        coalesce(ClasseTerapeutica, '') as ClasseTerapeutica,
        coalesce(TipoProdutoStatus, '') as TipoProdutoStatus,
        coalesce(RegimePreco, '') as RegimePreco,
        coalesce(PFSemImpostos, 0) as PFSemImpostos,
        coalesce(PF0, 0) as PF0,
        coalesce(PF12, 0) as PF12,
        coalesce(PF12_ALC, 0) as PF12_ALC,
        coalesce(PF17, 0) as PF17,
        coalesce(PF17_ALC, 0) as PF17_ALC,
        coalesce(PF17_5, 0) as PF17_5,
        coalesce(PF17_5_ALC, 0) as PF17_5_ALC,
        coalesce(PF18, 0) as PF18,
        coalesce(PF18_ALC, 0) as PF18_ALC,
        coalesce(PF19, 0) as PF19,
        coalesce(PF19_ALC, 0) as PF19_ALC,
        coalesce(PF19_5, 0) as PF19_5,
        coalesce(PF20, 0) as PF20,
        coalesce(PF20_ALC, 0) as PF20_ALC,
        coalesce(PF20_5, 0) as PF20_5,
        coalesce(PF21, 0) as PF21,
        coalesce(PF21_ALC, 0) as PF21_ALC,
        coalesce(PF22, 0) as PF22,
        coalesce(PMC0, 0) as PMC0,
        coalesce(PMC12, 0) as PMC12,
        coalesce(PMC12_ALC, 0) as PMC12_ALC,
        coalesce(PMC17, 0) as PMC17,
        coalesce(PMC17_ALC, 0) as PMC17_ALC,
        coalesce(PMC17_5, 0) as PMC17_5,
        coalesce(PMC17_5_ALC, 0) as PMC17_5_ALC,
        coalesce(PMC18, 0) as PMC18,
        coalesce(PMC18_ALC, 0) as PMC18_ALC,
        coalesce(PMC19, 0) as PMC19,
        coalesce(PMC20, 0) as PMC20,
        coalesce(PMC20_ALC, 0) as PMC20_ALC,
        coalesce(PMC20_5, 0) as PMC20_5,
        coalesce(PMC21, 0) as PMC21,
        coalesce(PMC21_ALC, 0) as PMC21_ALC,
        coalesce(PMC22, 0) as PMC22,
        coalesce(PMC22_ALC, 0) as PMC22_ALC,
        coalesce(RestricaoHospitalar, '') as RestricaoHospitalar,
        coalesce(CAP, '') as CAP,
        coalesce(CONFAZ87, '') as CONFAZ87,
        coalesce(ICMS0, '') as ICMS0,
        coalesce(AnaliseRecursal, '') as AnaliseRecursal,
        coalesce(ListaConcessaoCreditoTributario, '') as ListaConcessaoCreditoTributario,
        coalesce(Comercializacao2022, '') as Comercializacao2022,
        coalesce(Tarja, '') as Tarja,
        0 as PrecoFabrica,
        0 as PrecoMaximo
    from MEDICAMENTOS`

class CMED{
    async findData(codBarrasPrincipal, codBarrasAUX){
        try {
            var result = await knex.raw(selectPadrao + ` where EAN1 = '${codBarrasPrincipal}' or EAN2 = '${codBarrasPrincipal}'`);

            if(result == '' && codBarrasAUX != "-1"){
                result = await knex.raw(selectPadrao + ` where EAN1 = '${codBarrasAUX}' or EAN2 = '${codBarrasAUX}'`)
            }
    
            return result;
        } catch(err) {
            return err;
        }
    }

    async findList(codUf){
        try {
            var result = await knex.raw(` 
                select 
                    coalesce(Substancia, '') as Substancia,
                    coalesce(Laboratorio, '') as Laboratorio,
                    coalesce(EAN1, '') as EAN1,
                    coalesce(EAN2, '') as EAN2,
                    coalesce(EAN3, '') as EAN3,
                    coalesce(PF${codUf}, 0) as PrecoFabrica,
                    coalesce(PMC${codUf}, 0) as PrecoMaximo
                from MEDICAMENTOS
            `);
    
            return result;
        } catch(err) {
            return err;
        }
    }

    async findUltAtt(DATA_ULTIMA_ATUALIZACAO){
        try {
            var result = await knex.raw(`select case when cast(DATA_ULTIMA_ATUALIZACAO as datetime) <= cast('${DATA_ULTIMA_ATUALIZACAO}' as datetime) then 1 else 0 end as Atualiza, DATA_ULTIMA_ATUALIZACAO as DataUltimaAtualizacao from CMED_ATUALIZACAO`);

            return result;
        } catch(err) {
            return err;
        }
    }
}

module.exports = new CMED();