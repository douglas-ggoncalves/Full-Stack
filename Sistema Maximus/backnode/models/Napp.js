var knex = require("../database/database");

class Napp{
    async findData(){
        try {
            var result = await knex.raw(`
                select
                    empresasNapp.CNPJ,
                    empresasNapp.RazaoSocial,
                    max(dataNapp.DataVendaEnviada) as DataVendaEnviada,
                    max(dataNapp.DataCatalogoEnviado) as DataCatalogoEnviado,
                    datediff(day, (cast((case when max(dataNapp.DataVendaEnviada) > max(dataNapp.DataCatalogoEnviado) then max(dataNapp.DataCatalogoEnviado) else max(dataNapp.DataVendaEnviada) end) as date)), (cast(getDate() as date))) as DiasSemEnvio,
                    Status,
                    (
                        select
                            count(DataVendaEnviada) as DataVendaEnviada 
                        from DATA_NAPP dataNapp
                        inner join EMPRESAS_NAPP empresasNapp on dataNapp.CNPJ = empresasNapp.CNPJ
                        where DataVendaEnviada is not null
                    ) as TotalVendasEnviadas,
                    (
                        select
                            count(DataCatalogoEnviado) as DataCatalogoEnviado
                        from DATA_NAPP dataNapp
                        inner join EMPRESAS_NAPP empresasNapp on dataNapp.CNPJ = empresasNapp.CNPJ
                        where DataCatalogoEnviado is not null
                    )  as TotalCatalogosEnviados
                from DATA_NAPP dataNapp
                inner join EMPRESAS_NAPP empresasNapp on dataNapp.CNPJ = empresasNapp.CNPJ
                where empresasNapp.Status = 1
                group by empresasNapp.CNPJ, empresasNapp.RazaoSocial, Status
            `);

            return result;
        } catch(err) {
            return err;
        }
    }

    async findAllData(){
        try {
            var result = await knex.raw(`
                select
                    empresasNapp.CNPJ,
                    empresasNapp.RazaoSocial,
                    DataVendaEnviada,
                    DataCatalogoEnviado,
                    Status,
                    MsgCatalogo,
                    MsgVendas,
                    (
                        select
                            count(DataVendaEnviada) as DataVendaEnviada 
                        from DATA_NAPP dataNapp
                        inner join EMPRESAS_NAPP subEmpresasNapp on dataNapp.CNPJ = subEmpresasNapp.CNPJ
                        where DataVendaEnviada is not null
                        and empresasNapp.CNPJ = subEmpresasNapp.CNPJ
                    ) as TotalVendasEnviadas,
                    (
                        select
                            count(DataCatalogoEnviado) as DataCatalogoEnviado
                        from DATA_NAPP dataNapp
                        inner join EMPRESAS_NAPP subEmpresasNapp on dataNapp.CNPJ = subEmpresasNapp.CNPJ
                        where DataCatalogoEnviado is not null
                        and empresasNapp.CNPJ = subEmpresasNapp.CNPJ
                    )  as TotalCatalogosEnviados
                from DATA_NAPP dataNapp
                inner join EMPRESAS_NAPP empresasNapp on dataNapp.CNPJ = empresasNapp.CNPJ
                where empresasNapp.Status = 1
                group by 
                    empresasNapp.CNPJ, 
                    empresasNapp.RazaoSocial, 
                    DataVendaEnviada, 
                    DataCatalogoEnviado, 
                    Status, 
                    MsgCatalogo, 
                    MsgVendas
                order by 
					DataVendaEnviada desc, 
					DataCatalogoEnviado desc
            `);

            return result;
        } catch(err) {
            return err;
        }
    }

    async editStore(CNPJ, STATUS_LOJA){
        try {
            var result = await knex.where('CNPJ', '=', CNPJ).update({ Status: STATUS_LOJA }).table("EMPRESAS_NAPP")
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async getStore(CNPJ){
        try {
            var result = await knex.raw(`
                select CNPJ, RazaoSocial, Status from EMPRESAS_NAPP where CNPJ = '${CNPJ}'
            `); 
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async new(CNPJ, RazaoSocial){
        try {
            var result = await knex.raw(`
                insert into EMPRESAS_NAPP (CNPJ, RazaoSocial, Status) values('${CNPJ}','${RazaoSocial}', 1)
            `); 
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async newData(CNPJ, DataVenda, DataCatalogo, MsgVendas, MsgCatalogo){
        try {
            var valorDataVenda = DataVenda == "" || DataVenda == null ? `cast(null as datetime)` : `cast('${DataVenda}' as datetime)`;
            var valorDataCatalogo = DataCatalogo == "" || DataCatalogo == null ? `cast(null as datetime)` : `cast('${DataCatalogo}' as datetime)`;

            var result = await knex.raw(`
                insert into DATA_NAPP (CNPJ, DataVendaEnviada, DataCatalogoEnviado, MsgVendas, MsgCatalogo)
                values('${CNPJ}', ${valorDataVenda}, ${valorDataCatalogo}, '${MsgVendas}', '${MsgCatalogo}')
            `); 
            return result;
        } catch(err) {
            console.log("erro " + err)
            return undefined;
        }
    }
}

module.exports = new Napp();
