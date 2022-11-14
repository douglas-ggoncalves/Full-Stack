var Network = require("../models/Network")

class NetworkController{
    async getNetworks(req, res){
        var networks = await Network.findAll()
        if(networks != undefined){
            res.status(200);
            res.send({networks: networks});
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar as redes"})
        }
    }

    async create(req, res) {

        var NOME_REDE = await req.body.NOME_REDE
        var RADMIN_NOMEREDE = await req.body.RADMIN_NOMEREDE
        var RADMIN_SENHAREDE = await req.body.RADMIN_SENHAREDE
        var REDE_REPLICA = await req.body.REDE_REPLICA
        var ISATIVA = await req.body.ISATIVA
  
        var existLogin = await Network.findByName(NOME_REDE);
        if(existLogin != undefined){
            res.status(406);
            res.send({err: "Já existe uma rede com este nome"})
            return;
        }

        try{
            var select = await Network.newNetwork(NOME_REDE, RADMIN_NOMEREDE, RADMIN_SENHAREDE, REDE_REPLICA, ISATIVA);
            if(select != undefined){
                res.status(200);
                res.send({success: 'Rede salva com sucesso'});
            } else{
                res.status(406);
                res.send({err: "Não foi possível cadastrar a rede"})
            }
        } catch(error) {
            res.status(406);
            res.send({err: `Ocorreu um erro na inserção da rede ${NOME_REDE}, segue a mensagem de erro: ${error}`});
            return;
        }
        res.status(200);
        res.send({success: "Rede cadastrada com sucesso!"})
    }

    async editNetwork(req, res){
        var id = req.body.id
        var NOME_REDE = req.body.NOME_REDE
        var RADMIN_NOMEREDE = req.body.RADMIN_NOMEREDE
        var RADMIN_SENHAREDE = req.body.RADMIN_SENHAREDE
        var REDE_REPLICA = req.body.REDE_REPLICA
        var ISATIVA = req.body.ISATIVA
        
        var existLogin = await Network.findByName(NOME_REDE);
        if(existLogin != undefined){
            if(existLogin.id != id){
                res.status(406);
                res.send({err: "Já existe uma rede com este nome"})
                return;
            } 
        }

        var update = await Network.editNetwork(id, NOME_REDE, RADMIN_NOMEREDE, RADMIN_SENHAREDE, REDE_REPLICA, ISATIVA);
        if(update != undefined){
            res.status(200);
            res.send({success: "Rede alterada com sucesso"})
        } else{
            res.status(406);
            res.send({success: "Não foi possível fazer a alteração da rede"})
        }
    }
}

module.exports = new NetworkController();