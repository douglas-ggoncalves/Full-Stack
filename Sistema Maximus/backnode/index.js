var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser')
var router = require("./routes/routes")

app.use(bodyParser.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}))
app.use(bodyParser.json({limit: '50mb'}))
app.use("/",router);

var USUARIO = [
    /*{ ID_USUARIO: 1, LOGIN_USUARIO: 'Rafael', IMG_USUARIO: 'Rafael' },
    { ID_USUARIO: 2, LOGIN_USUARIO: 'Gabriel', IMG_USUARIO: 'Gabriel' },
    { ID_USUARIO: 3, LOGIN_USUARIO: 'Jonas', IMG_USUARIO: 'Jonas' },
    { ID_USUARIO: 4, LOGIN_USUARIO: 'Gyselle', IMG_USUARIO: 'Gyselle' },
    { ID_USUARIO: 5, LOGIN_USUARIO: 'Eduardo', IMG_USUARIO: 'Eduardo' },
    { ID_USUARIO: 6, LOGIN_USUARIO: 'Maurício Xavier', IMG_USUARIO: '' },
    { ID_USUARIO: 7, LOGIN_USUARIO: 'Raynaldo Macedo', IMG_USUARIO: '' },*/

    { LOGIN_USUARIO: 'Raynaldo Macedo', HORARIO_TRAB: '8-13', INTERVALO: '13-15'},
    { LOGIN_USUARIO: 'Maurício Xavier', HORARIO_TRAB: '10-20', INTERVALO: '13-15'},

]

const puppeteer = require('puppeteer');
const dir = __dirname + '/.dadosChrome';

(async () => {
    //const browser = await puppeteer.launch({headless: false, defaultViewport: null, userDataDir: dir});
    //const page = await browser.newPage();

    var today = new Date();

  //  console.log(today.getHours());
//    console.log(today.getDay());

    selectPerson();

    if(today.getDay() == 0){ // domingo

    } else if(today.getDay() == 6){ // sábado

    } else{ // segunda a sexta

    }

    
    /*
    await page.goto("https://web.whatsapp.com/")

    await page.waitForSelector('[data-testid="search"]')
        .then(()=>  page.click('[data-testid="search"]', {
          delay: 7000//3000
        })
    )

    await page.type("._13NKt", "Caroline Santos");
    await page.keyboard.press("Enter");
    await page.type(".p3_M1", "Tarefa: Checar replicação das lojas teste da vez");

    await page.keyboard.down("ShiftLeft")
    await page.keyboard.press("Enter")
    timer(2000)
    await page.keyboard.press("Enter")
    timer(2000)
    await page.type(".p3_M1", "Destinado para a tarefa: @Jonas");

    await page.keyboard.up("ShiftLeft")


    timer(2000)
    await page.keyboard.press("Enter");
    
    console.log(getRandomInt(3));
    */
})();

function timer (time){
    return new Promise(function(resolve){
        setTimeout(resolve, time);
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function selectPerson (){ // percorrer a lista de usuários e escolher um
    var today = new Date();

    USUARIO.forEach(element => {
        if(today.getHours() < element.INTERVALO.split("-")[0] || today.getHours() > element.INTERVALO.split("-")[1]){ // se não tiver no intervalo
            console.log('passou do 1º if ' +element.LOGIN_USUARIO)
            if(today.getHours() > parseInt(element.HORARIO_TRAB.split("-")[0]) && today.getHours() < element.HORARIO_TRAB.split("-")[1]){ // se o funcionário já estiver dentro do horário de serviço e fora do intervalo
                console.log(element.LOGIN_USUARIO)
            }
        }

        //console.log(element)
    })
    //return "Jonas Marcelo";
}


app.listen(4000, function(err){
    //console.log("logamos")
})

