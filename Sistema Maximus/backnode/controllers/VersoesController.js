let Versao = require("../models/Versao");
let NotaVersao = require("../models/NotaVersao");
let VersaoModulo = require("../models/VersaoModulo");

class VersoesController{
    async create(req, res){
        let dataPublicacao = req.body.dataPublicacao;
        let result = await Versao.new(dataPublicacao);

        if(result != undefined){
            res.status(200);
            res.send({success: 'Versão salva com sucesso'})
        } else{
            res.status(406);
            res.send({err: "Não foi possível cadastrar a versão"})
        }
    }

    async get(req, res){
        let versoes = await Versao.find();
        let notasVersoes = await NotaVersao.find();
        let versoesModulos = await VersaoModulo.find();

        if(versoes != undefined){
            res.status(200);
            res.send({arrayVersoes: versoes, notasVersoes: notasVersoes, versoesModulos: versoesModulos})
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar as versões"})
        }
    }
    
    async getByID(req, res){
        let id = req.params.id;

        let versaoDB = await Versao.findById(id, true);
        if(versaoDB != undefined){
            res.status(200);
            res.send(versaoDB)
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar as versões"})
        }
    }
    
    async edit(req, res){
        let id = req.params.id;
        let dataPublicacao = req.body.dataPublicacao;

        if(id == undefined) {
            res.status(406); 
            res.send({err: `ID da versão precisa ser informado`}); 
            return;
        }

        let versaoDB = await Versao.findById(id);
        if(!versaoDB){
            res.status(406);
            res.send({ err: `Não foi possível encontrar a versão correspondente ao ID ${id}` });
            return;
        }
        let update = await Versao.edit(id, dataPublicacao)
        
        if(update != undefined){
            res.status(200);
            res.send({success: "Versão alterada com sucesso"})
        } else{
            res.status(406);
            res.send({err: "Não foi possível fazer a alteração da versão"})
        }
    }
    
    async putEdit(req, res){
        let id = req.params.id;
        let base64 = req.body.base64;
        if(id == undefined) {
            res.status(406); 
            res.send({err: `ID da versão precisa ser informado`}); 
            return;
        }

        let versaoDB = await Versao.findById(id);
        if(!versaoDB){
            res.status(406);
            res.send({ err: `Não foi possível encontrar a versão correspondente ao ID ${id}` });
            return;
        }
        let update = await Versao.editPdfBase64(id, base64)
        
        if(update != undefined){
            res.status(200);
            res.send({success: "PDF atualizado com sucesso."})
        } else{
            res.status(406);
            res.send({err: "Não foi possível fazer a alteração os dados do PDF"})
        }
    }
}

module.exports = new VersoesController();