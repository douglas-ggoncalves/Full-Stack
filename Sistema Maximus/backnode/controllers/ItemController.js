const Item = require("../models/Item");

class ItemController{
    async create(req, res) {
        var DESC_ITEM = await req.body.DESC_ITEM;
        var ITEM_CODETAPA = await req.body.ITEM_CODETAPA;
        try{
            if(DESC_ITEM != undefined && ITEM_CODETAPA != undefined ){
                var descExists = await Item.findDesc(DESC_ITEM);
                if(descExists != undefined){
                    res.status(404)
                    res.send({err: "Já existe um item com essa descrição"})
                    return;
                } else{
                    var create = await Item.newItem(DESC_ITEM, ITEM_CODETAPA);
                    if(create != undefined){
                        res.status(200);
                        res.send({success: "Item criada com sucesso"})
                        return;
                    } else {
                        res.status(406);
                        res.send({err: 'Ocorreu um erro ao tentar cadastrar o item, verifique os dados informados e tente novamente'});
                        return;
                    }
                }
            }
            else{
                res.status(406);
                res.send({err: 'A descrição e etapa do item devem ser preenchidos'});
                return;
            }
        } catch(err)  {
            res.send({err: 'Ocorreu um erro ' + err});
            res.status(406);
            return;
        }
    }

    async getItems(req, res){
        var items = await Item.findImplants();
        
        if(items != undefined) 
        {
            res.status(200);
            res.send({items: items})
            return;
        } else{
            res.status(406);
            res.send({err: 'Não foi possível consultar as informações de implementação'});
            return;
        }
    }
}

module.exports = new ItemController();