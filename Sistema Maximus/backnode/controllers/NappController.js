const Napp = require("../models/Napp");

class NappController{
    async getData(req, res) {
        var dataNapp;
        try{
            dataNapp = await Napp.findData();
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem de dados da Napp, segue a mensagem de erro: ${err}`});
            return;
        }
        res.status(200);
        res.send({dataNapp: dataNapp})
    }

    async getAllDataDetailed(req, res) {
        var dataNapp;
        try{
            dataNapp = await Napp.findAllData();
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem de dados da Napp, segue a mensagem de erro: ${err}`});
            return;
        }
        res.status(200);
        res.send({dataNapp: dataNapp})
    }

    async editStore(req, res){
        var CNPJ = await req.body.CNPJ
        var STATUS_LOJA = await req.body.STATUS_LOJA

        var update = await Napp.editStore(CNPJ, STATUS_LOJA);
        if(update != undefined){
            res.status(200);
            res.send({success: "Loja alterada com sucesso"})
        } else{
            res.status(406);
            res.send({err: "Não foi possível fazer a alteração da loja"})
        }
    }

    async create(req, res) {
        var CNPJ = await req.body.CNPJ;
        var RazaoSocial = await req.body.RazaoSocial;
        var store = await Napp.getStore(CNPJ)

        if(store != undefined && store.length > 0){
            res.status(200);
            res.send({success: 'Loja já possui cadastro.'})
            return;
        }

        if(CNPJ == undefined || CNPJ == null){
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja, CNPJ Inválido."})
            return;
        }

        if(RazaoSocial == undefined || RazaoSocial == null || RazaoSocial == ""){
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja, Razão Social Inválida."})
            return;
        }

        var result = await Napp.new(CNPJ, RazaoSocial)  
        if(result != undefined){
            res.status(200);
            res.send({success: 'Loja cadastrada com sucesso.'})
            return;
        } else{
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja."})
            return;
        }
    }

    async createDataNapp(req, res) {
        var CNPJ = await req.body.CNPJ;
        var DataVenda = await req.body.DataVenda;
        var DataCatalogo = await req.body.DataCatalogo;
        var MsgVendas = await req.body.MsgVendas;
        var MsgCatalogo = await req.body.MsgCatalogo;

        if(CNPJ == undefined || CNPJ == null){
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja, CNPJ Inválido."})
        } 

        var result = await Napp.newData(CNPJ, DataVenda, DataCatalogo, MsgVendas, MsgCatalogo)  
        if(result != undefined){
            res.status(200);
            res.send({success: 'Informação gravada com sucesso.'})
        } else{
            res.status(406);
            res.send({err: "Não foi possível gravar a informação."})
        }
    }
}

module.exports = new NappController();