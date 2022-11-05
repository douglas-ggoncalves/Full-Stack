const Stage = require("../models/Stage");

class StageController{
    async create(req, res) {
        var DESC_ETAPA = await req.body.DESC_ETAPA;
        var USADESC_ETAPA = await req.body.USADESC_ETAPA;
        var DESCTEXT_ETAPA = await req.body.DESCTEXT_ETAPA;
        
        try{
            if(DESC_ETAPA != undefined ){
                var descExists = await Stage.findDesc(DESC_ETAPA);
                
                if(descExists != undefined){
                    res.status(404)
                    res.send({err: "Já existe uma etapa com essa descrição"})
                    return;
                } else{
                    var create = await Stage.newStage(DESC_ETAPA, USADESC_ETAPA, DESCTEXT_ETAPA);
                    if(create != undefined){
                        res.status(200);
                        res.send({success: "Etapa criada com sucesso"})
                        return;
                    } else {
                        res.status(406);
                        res.send({err: 'Ocorreu um erro ao tentar cadastrar a etapa, verifique os dados informados e tente novamente'});
                        return;
                    }
                }
            }
        } catch(err)  {
            res.send({err: 'Ocorreu um erro ' + err});
            res.status(406);
            return;
        }
    }

    async getStages(req, res) {
        try{
            var result = await Stage.findAll();

            if(result.length > 0){
                res.status(200)
                res.send(result)
                return;
            } else{
                res.status(200);
                res.send({err: 'Não foram encontrados as etapas ' + err});
                return;
            }
        }
        catch(err) {
            res.send({err: 'Ocorreu um erro ' + err});
            res.status(406);
            return;
        }
    }

}

module.exports = new StageController();