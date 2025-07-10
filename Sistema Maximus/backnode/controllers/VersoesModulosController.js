let VersaoModulo = require("../models/VersaoModulo");

class VersoesModulosController{
    async create(req, res){
        let idModulo = req.body.idModulo;
        let numeroVersao = req.body.numeroVersao;
        let dataVersao = req.body.dataVersao;
        let idVersao = req.body.idVersao;
        let versaoModuloDB = await VersaoModulo.findByIdModuleAndVersionNumber(idModulo, numeroVersao);
        if(versaoModuloDB){
            res.status(406);
            res.send({ err: "Já existe uma versão registrada com esse módulo e número de versão." });
            return;
        }

        let result = await VersaoModulo.new(idModulo, numeroVersao, dataVersao, idVersao);

        if(result != undefined){
            res.status(200);
            res.send({success: 'Dados registrados com sucesso'})
        } else{
            res.status(406);
            res.send({err: "Não foi possível cadastrar a versão"})
        }
    }

    async get(req, res){
        let versoesModulos = await VersaoModulo.find();

        if(versoesModulos != undefined){
            res.status(200);
            res.send({versoesModulos: versoesModulos})
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar as versões"})
        }
    }
    
    async edit(req, res){
        let id = req.params.id;
        let idModulo = req.body.idModulo;
        let numeroVersao = req.body.numeroVersao;
        let dataVersao = req.body.dataVersao;
        let idVersao = req.body.idVersao;

        if(id == undefined) {
            res.status(406); 
            res.send({err: `ID da versão precisa ser informado`}); 
            return;
        }

        let versaoDB = await VersaoModulo.findById(id);
        if(!versaoDB){
            res.status(406);
            res.send({ err: `Não foi possível encontrar a versão correspondente ao ID ${id}` });
            return;
        }
        let update = await VersaoModulo.edit(id, idModulo, numeroVersao, dataVersao, idVersao)
        
        if(update != undefined){
            res.status(200);
            res.send({success: "Dados alterados com sucesso"})
        } else{
            res.status(406);
            res.send({err: "Não foi possível fazer a alteração da versão"})
        }
    }
    
    async delete(req, res){
        let id = req.params.id;

        if(id == undefined) {
            res.status(406); 
            res.send({err: `ID da versão precisa ser informado`}); 
            return;
        }

        let versaoDB = await VersaoModulo.findById(id);
        if(!versaoDB){
            res.status(406);
            res.send({ err: `Não foi possível encontrar a versão correspondente ao ID ${id}` });
            return;
        }

        let deletedData = await VersaoModulo.delete(id)
        if(deletedData != undefined){
            res.status(200);
            res.send({success: "Dados deletados com sucesso"})
        } else{
            res.status(406);
            res.send({err: "Não foi possível fazer a deleção da versão"})
        }
    }
}

module.exports = new VersoesModulosController();