var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser')
var router = require("./routes/routes")
var botWhatsapp = require("../backnode/controllers/BotWhatsapp")
const connection = require("../connection/frontConnection.json")
app.use(bodyParser.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}))
app.use(bodyParser.json({limit: '50mb'}))
app.use("/",router);
var http = require("http").createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origins: [connection.address]
    }
  });

io.on("connection", (socket) => {

    console.log("Usuário conectado: " + socket.id)

    socket.on("disconnect", () => {
        console.log("X desconectou: " + socket.id)
    })

    socket.on('my message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('replicInfo', (msg) => {
        io.emit("showmsg", msg);
    });

    socket.on('refreshItems', (msg) => {
        socket.broadcast.emit("itemsRefresh", msg); // Emitimos o evento para todo mundo do server menos para quem enviou
    });
})

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

http.listen(4000, function(err){ // app.listen(4000, function(err){
    //console.log("logamos")
})

