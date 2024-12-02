const Store = require("../models/Store");


class StoreController{
    async getStores(req, res) {
        var result = await Store.getStores();
        if(result != undefined){
            res.status(200);
            res.send({stores: result})
        }
    }
    
    async create(req, res) {
        var NUMERO_LOJA = req.body.NUMERO_LOJA;
        var NOME_LOJA = req.body.NOME_LOJA;
        var IP_LOJA = req.body.IP_LOJA;
        var REDEID = req.body.REDEID;
        var PORTA_LOJA = req.body.PORTA_LOJA;
        var LOGIN_LOJA = req.body.LOGIN_LOJA;
        var SENHA_LOJA = req.body.SENHA_LOJA;
        var RAZAO_LOJA = req.body.RAZAO_LOJA;
        var CNPJ_LOJA = req.body.CNPJ_LOJA.replace(".", "").replace(".", "").replace("-", "").replace("/", "");
        var SISTEMA_LOJA = req.body.SISTEMA_LOJA;
        var INTEGRACAO_LOJA = req.body.INTEGRACAO_LOJA;
        var ENDERECO_LOJA = req.body.ENDERECO_LOJA;
        var ACESSOREMOTO = req.body.ACESSOREMOTO;
        var SENHAACESSOREMOTO = req.body.SENHAACESSOREMOTO;

        var result = await Store.new(NUMERO_LOJA, NOME_LOJA, IP_LOJA, REDEID, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, RAZAO_LOJA, CNPJ_LOJA, SISTEMA_LOJA, INTEGRACAO_LOJA, ENDERECO_LOJA, ACESSOREMOTO, SENHAACESSOREMOTO)  
        if(result != undefined){
            res.status(200);
            res.send({success: 'Loja cadastrada com sucesso'})
        } else{
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja"})
        }
    }

}

module.exports = new StoreController();