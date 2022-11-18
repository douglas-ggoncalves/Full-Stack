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

    async new(NUMERO_LOJA, NOME_LOJA, IP_LOJA, REDEID, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, RAZAO_LOJA, CNPJ_LOJA, SISTEMA_LOJA, ENDERECO_LOJA, ACESSOREMOTO, SENHAACESSOREMOTO){
        try {
            var result = await knex.raw(`
            insert into loja (NUMERO_LOJA, NOME_LOJA, IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, REDEID, RAZAO_LOJA, CNPJ_LOJA, SISTEMA_LOJA, ENDERECO_LOJA, ACESSOREMOTO, SENHAACESSOREMOTO)
                values(${NUMERO_LOJA}, '${NOME_LOJA}', '${IP_LOJA}', ${PORTA_LOJA}, '${LOGIN_LOJA}', '${SENHA_LOJA}', ${REDEID}, '${RAZAO_LOJA}', '${CNPJ_LOJA}', ${SISTEMA_LOJA}, '${ENDERECO_LOJA}', '${ACESSOREMOTO}', '${SENHAACESSOREMOTO}')
            `); 
            /*
                var result = await knex.insert({NUMERO_LOJA: NUMERO_LOJA, NOME_LOJA: NOME_LOJA, IP_LOJA: IP_LOJA, REDEID: REDEID, PORTA_LOJA: PORTA_LOJA,
                    LOGIN_LOJA: LOGIN_LOJA, SENHA_LOJA: SENHA_LOJA, RAZAO_LOJA: RAZAO_LOJA, CNPJ_LOJA: CNPJ_LOJA, SISTEMA_LOJA: SISTEMA_LOJA,
                    ENDERECO_LOJA: ENDERECO_LOJA, ACESSOREMOTO: ACESSOREMOTO, SENHAACESSOREMOTO: SENHAACESSOREMOTO
                }).table("loja");
            */
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }
}

module.exports = new Store();
