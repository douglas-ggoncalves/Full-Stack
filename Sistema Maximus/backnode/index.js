var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser')
var router = require("./routes/routes")

app.use(bodyParser.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}))
app.use(bodyParser.json({limit: '50mb'}))
app.use("/",router);


const puppeteer = require('puppeteer');
const dir = __dirname + '/.dadosChrome';

(async () => {
    const browser = await puppeteer.launch({headless: false, defaultViewport: null, userDataDir: dir});
    const page = await browser.newPage();

    const allResultsSelector = '.devsite-suggest-all-results';
    await page.goto("https://web.whatsapp.com/")
    await timer(9000);
    console.log("terminou o timer");

    //await page.click('a._3aF8K');
    //await page.click('img.kqpxs.i0jNr');


})();

function timer (time){
    console.log("começou o timer");
   /* return new Promise(function(resolve){

    }, 4000 )*/
    return new Promise(function(resolve){
        setTimeout(resolve, time);
    })

}


app.listen(4000, function(err){
    console.log("logamos")
})

