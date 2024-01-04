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

    async getDataStore(CNPJ){
        try {
            var result = await knex.raw(`
                select 
                    EMPRESAS_NAPP.CNPJ, 
                    EMPRESAS_NAPP.RazaoSocial, 
                    LOJA.NUMERO_LOJA,
                    LOJA.IP_LOJA, 
                    LOJA.PORTA_LOJA,
                    LOJA.LOGIN_LOJA,
                    LOJA.SENHA_LOJA
                from EMPRESAS_NAPP 
                inner join LOJA on Loja.CNPJ_LOJA = EMPRESAS_NAPP.CNPJ
                where EMPRESAS_NAPP.CNPJ = '${CNPJ}'
            `); 
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async insertDataStore(codEmpresa, dataInicial, dataFinal, CNPJ){
        try {
            var result = await knex.raw(`
                insert into SolicitacoesNapp (CodEmpresa, DataInicial, DataFinal, DataCriacao, Status, CNPJ)
                values(${codEmpresa}, cast('${dataInicial}' as datetime), cast('${dataFinal}' as datetime), cast(getDate() as datetime), 0, '${CNPJ}') 
            `); 
                
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async findReqData(codEmpresa, CNPJ){
        try {
            var result = await knex.raw(`
                select
                    CodEmpresa,
                    IDSolicitacao,
                    DataInicial,
                    DataFinal,
                    DataCriacao,
                    Status,
                    CNPJ
                from SolicitacoesNapp
                where CodEmpresa = ${codEmpresa}
                and CNPJ = '${CNPJ}'
                and Status <> 1
            `);

            return result;
        } catch(err) {
            return err;
        }
    }

    async editStatusRequest(codEmpresa, CNPJ){
        try {
            var result = await knex.raw(`
                update SolicitacoesNapp
                    set Status = 1
                where CodEmpresa = ${codEmpresa}
                and CNPJ = '${CNPJ}'
            `); 
                
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async findVersion(IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA){
        try {
            var result = await knex.raw(`
                select * from openrowset('SQLNCLI','${IP_LOJA},${PORTA_LOJA}';'${LOGIN_LOJA}';'${SENHA_LOJA}',
                    'select Valor_cfg from detnew..ConfigGeral where Chave_cfg = ''W_VERSAO'''
                );
            `).timeout(30000); // tempo limite de 30 segundos para a consulta ser realizada;

            return result;
        } catch(err) {
            return err;
        }
    }

    async findVersionMXService(IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA){
        try {
            var result = await knex.raw(`
                select * from openrowset('SQLNCLI','${IP_LOJA},${PORTA_LOJA}';'${LOGIN_LOJA}';'${SENHA_LOJA}',
                    'select top(1) cast(cast(Valor_cfg as varchar) as datetime) as Valor_cfg from detnew..ConfigGeral where Chave_cfg = ''MX_SERVICE_VERSAO'''
                );
            `).timeout(30000); // tempo limite de 30 segundos para a consulta ser realizada;

            return result;
        } catch(err) {
            return err;
        }
    }

    async updateCNPJJJ() {
        try {
            var result = await knex.raw(`
                SELECT NUMERO_LOJA, IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, CNPJ_LOJA
                FROM loja
                WHERE LEN(COALESCE(CNPJ_LOJA, '')) < 13
                AND IP_LOJA <> ''
                AND PORTA_LOJA <> ''
                AND LOGIN_LOJA <> ''
                AND SENHA_LOJA <> ''
            `).timeout(10000);
    
            if (result) {
                for (const element of result) {
                    try {
                        if (element) {
                            var resultLoja = await knex.raw(`
                                SELECT * FROM openrowset('SQLNCLI','${element.IP_LOJA},${element.PORTA_LOJA}';'${element.LOGIN_LOJA}';'${element.SENHA_LOJA}',
                                    'SELECT Cnpj FROM detnew..EmpresaNf WHERE CodEmpresa = ${element.NUMERO_LOJA}'
                                );
                            `).timeout(30000);

                            if (resultLoja && resultLoja[0]) {
                                var cnpj = await resultLoja[0].Cnpj;
                                
                                await knex('loja')
                                    .where({ IP_LOJA: element.IP_LOJA, NUMERO_LOJA: element.NUMERO_LOJA })
                                    .update({ CNPJ_LOJA: cnpj });
                            }
                        }
                    } catch (innerError) {
                        console.error("Erro na iteração: ", innerError);
                        // Continua para a próxima iteração mesmo se houver um erro
                    }
                }
            }
    
            return result;
        } catch (err) {
            return err;
        }
    }
}

module.exports = new Napp();
