var knex = require("../database/database");

class Store{
    async getStores() {
        try {
            var result = await knex.select().from("loja").leftOuterJoin('rede', 'rede.id', 'loja.redeid');
                return result;
        } catch(err) {
            return undefined;
        }
    }

    async new(NUMERO_LOJA, NOME_LOJA, IP_LOJA, REDEID, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, RAZAO_LOJA, CNPJ_LOJA, SISTEMA_LOJA, INTEGRACAO_LOJA, ENDERECO_LOJA, ACESSOREMOTO, SENHAACESSOREMOTO){
        try {
            var query = '';
            if(INTEGRACAO_LOJA == 1){
                // Query responsável por não permitir que uma loja tenha mais de 1 integração.
                query = `update loja set INTEGRACAO_LOJA = 0 where REDEID = '${REDEID}';`;
            }

            var result = await knex.raw(`
                ${query}

                insert into loja (NUMERO_LOJA, NOME_LOJA, IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, REDEID, RAZAO_LOJA, CNPJ_LOJA, SISTEMA_LOJA, INTEGRACAO_LOJA, ENDERECO_LOJA, ACESSOREMOTO, SENHAACESSOREMOTO)
                    values(${NUMERO_LOJA}, '${NOME_LOJA}', '${IP_LOJA}', ${PORTA_LOJA}, '${LOGIN_LOJA}', '${SENHA_LOJA}', ${REDEID}, '${RAZAO_LOJA}', '${CNPJ_LOJA}', ${SISTEMA_LOJA}, ${INTEGRACAO_LOJA}, '${ENDERECO_LOJA}', '${ACESSOREMOTO}', '${SENHAACESSOREMOTO}')
            `); 
            
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }
}

module.exports = new Store();
