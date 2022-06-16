var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
const axios = require('axios')
var bodyParser = require('body-parser')
var router = require("./routes/routes")

app.use(bodyParser.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}))
app.use(bodyParser.json({limit: '50mb'}))
app.use("/",router);

app.listen(4000, function(err){
    console.log("logamos")
})