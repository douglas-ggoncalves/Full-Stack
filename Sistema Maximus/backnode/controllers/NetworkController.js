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
}

module.exports = new NetworkController();