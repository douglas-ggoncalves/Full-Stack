var jwt = require("jsonwebtoken");
var secret = "as55a6a5as5d4a5qvjnkalçKASNFJLkakfnJKKjknldjsn";

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization'];

    if(authToken != undefined) {
        const bearer = authToken.split(" ");
        var token = bearer[1];

        try{
            var decoded = jwt.verify(token, secret);
            if(decoded.role == 'M' || decoded.role == 'A') {
                next();
            } else{
                res.status(403);
                res.send({err:"Você não tem permissão para acessar essa página / função"});
                return;
            }
        } catch(err) {
            res.status(403);
            res.send({err:"Você não está autenticado"});
            return;
        }
    } else{
        res.status(403);
        res.send({err:"Você não está autenticado"});
        return;
    }
    
}



