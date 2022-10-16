const Store = require("../models/Store");


class StoreController{
    async getStores(req, res) {

        var result = await Store.getStores();
        if(result != undefined){
            res.status(200);
            res.send({stores: result})
        }
    }

}

module.exports = new StoreController();