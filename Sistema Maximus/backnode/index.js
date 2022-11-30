var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser')
var router = require("./routes/routes")
var botWhatsapp = require("../backnode/controllers/BotWhatsapp")
app.use(bodyParser.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}))
app.use(bodyParser.json({limit: '50mb'}))
app.use("/",router);


/*
setInterval(function () {
    var today = new Date();
    if(today.getMinutes() == 56){ // 0 indica que acabou de começar o horário
        botWhatsapp.initBot();
        clearInterval(this);
        console.log("Conectado")
    }
}, 1000); // 60000 é a cada 1 minuto
*/

app.listen(4000, function(err){
    //console.log("logamos")
})

