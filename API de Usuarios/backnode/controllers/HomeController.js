class HomeController{
    async index(req, res){
        res.send("App");
    }

    async validate(req, res) {
        res.send({success: "Ok"});
    }
}

module.exports = new HomeController();

