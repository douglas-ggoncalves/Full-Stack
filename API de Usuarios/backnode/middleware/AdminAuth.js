var jwt = require("jsonwebtoken");
var secret = "151515f15b1sf5vada5s1v5ad1vaf";

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization'];

    if(authToken != undefined) {
        const bearer = authToken.split(" ");
        var token = bearer[1];

        try{
            var decoded = jwt.verify(token, secret);
            console.log(decoded)
            if(decoded.role == 1) {
                next();
            } else{
                res.status(403);
                console.log(decoded.role)
                res.send({err: "Você não tem permissão para isso"});
                return;
            }
        } catch(err) {
            res.status(403);
            res.send({err: "Você não está autenticado"});
            return;
        }
    } else{
        res.status(403);
        res.send({err: "Você não está autenticado"});
        return;
    }
}



