var Implantation = require("../models/Implantation")

class ImplantationController{

    create(req, res) {
        var IMP_IDSTORES = req.body.IMP_IDSTORES
        var itensSuccess = [];
        var itensErr = [];
        if(IMP_IDSTORES.length > 0) 
        {
            IMP_IDSTORES.forEach(element => {
                var descExist = Implantation.findImpById(element)
                if(descExist == undefined){
                    Implantation.newImp(element)
                    itensSuccess.push(element)
                } else{
                    itensErr.push(element)
                }
            })

            res.status(200);
            res.send({itensSuccess: itensSuccess, itensErr: itensErr})
            return;
        } else{
            res.status(406);
            res.send({err: 'Informe ao menos uma loja para associar a implantação'});
            return;
        }
    }
    async getImplants(req, res){
        var implants = await Implantation.findImplants();
        
        if(implants != undefined) 
        {
            res.status(200);
            res.send({implants: implants})
            return;
        } else{
            res.status(406);
            res.send({err: 'Não foi possível consultar as informações de implementação'});
            return;
        }

    }
}

module.exports = new ImplantationController();