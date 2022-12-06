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

    async editImplant(req, res){
        console.log("está chegando no edit Implant")
        var IMP_CODIMP = await req.body.IMP_CODIMP
        var IMP_CODLOJA = await req.body.IMP_CODLOJA
        var IMP_STATUSOK = await req.body.IMP_STATUSOK
        var IMP_CODITEM = await req.body.IMP_CODITEM
        var ETAPA_CODETAPA = await req.body.ETAPA_CODETAPA
        var ITEM_CODETAPA = await req.body.ITEM_CODETAPA
        var IMP_USUARIOSITEM = await req.body.IMP_USUARIOSITEM
        console.log("IMP_CODIMP " + IMP_CODIMP)
        console.log("IMP_CODLOJA " + IMP_CODLOJA)
        console.log("IMP_STATUSOK " + IMP_STATUSOK)
        console.log("IMP_CODITEM " + IMP_CODITEM)
        console.log("ETAPA_CODETAPA " + ETAPA_CODETAPA)
        console.log("ITEM_CODETAPA " + ITEM_CODETAPA)
        console.log("IMP_USUARIOSITEM " + IMP_USUARIOSITEM)

        var update = await Implantation.editImplant(IMP_CODIMP, IMP_CODLOJA, IMP_STATUSOK, IMP_CODITEM, ETAPA_CODETAPA, ITEM_CODETAPA, IMP_USUARIOSITEM);
        if(update != undefined){
            res.status(200);
            res.send({success: "Alterada gravada com sucesso"})
        } else{
            res.status(406);
            res.send({success: "Não foi possível fazer a gravação da alteração"})
        }
    }
}

module.exports = new ImplantationController();