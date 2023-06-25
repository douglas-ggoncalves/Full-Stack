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

    async getUsersImplants(req, res){
        var codImp = await req.query.codImp;
        var codLoja = await req.query.codLoja;

        var usersImplants = await Implantation.findUserImplants(codImp, codLoja);
        
        if(usersImplants != undefined) 
        {
            res.status(200);
            res.send({usersImplants: usersImplants})
            return;
        } else{
            res.status(406);
            res.send({err: 'Não foi possível consultar as informações dos usuários'});
            return;
        }
    }

    async editUsers(req, res){
        var DATASIMP_CODLOJA = await req.body.DATASIMP_CODLOJA
        var DATASIMP_CODETAPA = await req.body.DATASIMP_CODETAPA
        var CODIMP_IMP = await req.body.CODIMP_IMP
        var DATASIMP_USUARIOS = await req.body.DATASIMP_USUARIOS

        var update = await Implantation.usersEdit(DATASIMP_CODLOJA, DATASIMP_CODETAPA, CODIMP_IMP, DATASIMP_USUARIOS);
        if(update != undefined){
            res.status(200);
            res.send({success: "Alteração gravada com sucesso"})
        } else{
            res.status(406);
            res.send({success: "Não foi possível fazer a alteração dos usuários"})
        }
    }

    async editUserItemImp(req, res){
        var IMP_CODLOJA = await req.body.IMP_CODLOJA
        var ETAPA_CODETAPA = await req.body.ETAPA_CODETAPA
        var IMP_CODIMP = await req.body.IMP_CODIMP
        var IMP_USUARIOSITEM = await req.body.IMP_USUARIOSITEM
        var IMP_CODITEM = await req.body.IMP_CODITEM

        var update = await Implantation.usersEditImp(IMP_CODLOJA, ETAPA_CODETAPA, IMP_CODIMP, IMP_USUARIOSITEM, IMP_CODITEM);
        if(update != undefined){
            res.status(200);
            res.send({success: "Alteração gravada com sucesso"})
        } else{
            res.status(406);
            res.send({success: "Não foi possível fazer a alteração dos usuários"})
        }
    }
    

    async editImplant(req, res){
        var IMP_CODIMP = await req.body.IMP_CODIMP
        var IMP_CODLOJA = await req.body.IMP_CODLOJA
        var IMP_STATUSOK = await req.body.IMP_STATUSOK
        var IMP_CODITEM = await req.body.IMP_CODITEM
        var ETAPA_CODETAPA = await req.body.ETAPA_CODETAPA
        var ITEM_CODETAPA = await req.body.ITEM_CODETAPA

        var update = await Implantation.editImplant(IMP_CODIMP, IMP_CODLOJA, IMP_STATUSOK, IMP_CODITEM, ETAPA_CODETAPA, ITEM_CODETAPA);
        if(update != undefined){
            res.status(200);
            res.send({success: "Alteração gravada com sucesso"})
        } else{
            res.status(406);
            res.send({success: "Não foi possível fazer a gravação da alteração"})
        }
    }
}

module.exports = new ImplantationController();