let NotaVersao = require("../models/NotaVersao")

class NotasVersoesController{
    async create(req, res){
        let titulo  = req.body.titulo;
        let descricao  = req.body.descricao;
        let idVersaoModulo = req.body.idVersaoModulo;
        var result = await NotaVersao.new(titulo, descricao, idVersaoModulo);

        if(result != undefined){
            res.status(200);
            res.send({success: 'Dados salvos com sucesso'});
        } else{
            res.status(406);
            res.send({err: "Não foi possível realizar a criação dos dados"})
        }
    }

    async get(req, res){
        var versoes = await NotaVersao.find();

        if(versoes != undefined){
            res.status(200);
            res.send({arrayVersoes: versoes});
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar os dados referentes a versão"})
        }
    }
    
    async edit(req, res){
        let id = req.params.id;
        let titulo  = req.body.titulo;
        let descricao  = req.body.descricao;
        let idVersaoModulo = req.body.idVersaoModulo;
        
        if(id == undefined) {
            res.status(406); 
            res.send({err: `ID da versão precisa ser informado`}); 
            return;
        }

        let notaVersaoDB = await NotaVersao.findById(id);
        if(!notaVersaoDB){
            res.status(406);
            res.send({ err: `Não foi possível encontrar a versão correspondente ao ID ${id}` });
            return;
        }
        let update = await NotaVersao.edit(id, titulo, descricao, idVersaoModulo);
        
        if(update != undefined){
            res.status(200);
            res.send({success: "Dados alterados com sucesso"});
        } else{
            res.status(406);
            res.send({err: "Não foi possível realizar a alteração dos dados"});
        }
    }
    
    async delete(req, res){
        let id = req.params.id;
        
        if(id == undefined) {
            res.status(406); 
            res.send({err: `ID da versão precisa ser informado`}); 
            return;
        }

        let notaVersaoDB = await NotaVersao.findById(id);
        if(!notaVersaoDB){
            res.status(406);
            res.send({ err: `Não foi possível encontrar a versão correspondente ao ID ${id}` });
            return;
        }

        let deletedData = await NotaVersao.delete(id);
        if(deletedData != undefined){
            res.status(200);
            res.send({success: "Dados alterados com sucesso"});
        } else{
            res.status(406);
            res.send({err: "Não foi possível realizar a alteração dos dados"});
        }
    }
}

module.exports = new NotasVersoesController();