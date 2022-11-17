const fs = require('fs');

class BotWhatsapp{
    async initBot(){
        var today = new Date();
            
        if(today.getHours() >= 8 && today.getHours() <= 18){

           setInterval(function () {
                try{
                
                var USUARIO = [
                    { LOGIN_USUARIO: 'Raynaldo', DIA_TRAB:'2-6', HORARIO_TRAB: '8-13', INTERVALO: '13-15', NUMEROTELEFONE: '62 8641-7471'},
                    { LOGIN_USUARIO: 'Maurício Xavier', DIA_TRAB:'1-6', HORARIO_TRAB: '10-20', INTERVALO: '13-15', NUMEROTELEFONE: '64 9949-2801'},
                    //{ LOGIN_USUARIO: 'Jonas Marcelo', DIA_TRAB:'1-6', HORARIO_TRAB: '08-17', INTERVALO: '13-14', NUMEROTELEFONE: '62 8421-9096'},
                    { LOGIN_USUARIO: 'Gyselle Mairinck ', DIA_TRAB:'1-6', HORARIO_TRAB: '14-18', INTERVALO: '10-11', NUMEROTELEFONE: '62 9377-7353'},
                    { LOGIN_USUARIO: 'Eduardo Gabriel', DIA_TRAB:'1-6', HORARIO_TRAB: '07-16', INTERVALO: '13-15', NUMEROTELEFONE: '62 9478-0815'},
                    // { LOGIN_USUARIO: 'Rafael', DIA_TRAB:'1-6', HORARIO_TRAB: '07-16', INTERVALO: '13-15', NUMEROTELEFONE: '62 8219-0431'},
                    // { LOGIN_USUARIO: 'Gabriel Lopes', DIA_TRAB:'1-6', HORARIO_TRAB: '08-16', INTERVALO: '13-15', NUMEROTELEFONE: '62 8271-0012'},
                    // { LOGIN_USUARIO: 'Gabriel Maximus', DIA_TRAB:'1-6', HORARIO_TRAB: '08-16', INTERVALO: '13-15', NUMEROTELEFONE: '62 9665-5837'},
                ]
                
                var arrFiltered = [];
                
                (async () => {
                    const puppeteer = require('puppeteer');
                    const dir = __dirname + '/.dadosChrome';
                    const browser = await puppeteer.launch(
                        {
                            headless: false, 
                            defaultViewport: null, 
                            userDataDir: dir
                        });
                    const page = await browser.newPage();
                
                    //if(today.getHours(today.getHours() >= 8 && today.getHours() <= 18))
                    if(today.getDay() == 0){ // Domingo
                        
                    } else if(today.getDay() == 6){ // Sábado
                
                    } else{ // Segunda a Sexta
                        selectPerson();
                        
                    }
                    await page.goto("https://web.whatsapp.com/")
                
                    await page.waitForSelector('[data-testid="search"]')
                        .then(()=>  page.click('[data-testid="search"]', {
                        delay: 7000//3000
                        })
                    )
                
                    await page.type("._13NKt", "Mx versões teste"); // GRUPO DO SUPORTE MX
                    await page.keyboard.press("Enter");
                    await page.type(".p3_M1", "*Bot: Tarefa Checar replicação das lojas*");
                
                    console.log("escolhido " + arrFiltered[0].LOGIN_USUARIO)
                    if(today.getDay() >= 1 && today.getDay() <= 6){
                        await page.keyboard.down("ShiftLeft")
                        await page.keyboard.press("Enter")
                        timer(2000)
                        await page.keyboard.press("Enter")
                        timer(2000)
                        await page.type(".p3_M1", `Destinado para a tarefa: ${arrFiltered[0].LOGIN_USUARIO}`);
                        await page.keyboard.up("ShiftLeft")
                    }
                
                    arrFiltered = [];
                    timer(2000)
                    await page.keyboard.press("Enter");
                    timer(10000);
                    //await browser.close();
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
                            if(today.getHours() >= parseInt(element.HORARIO_TRAB.split("-")[0]) && today.getHours() < element.HORARIO_TRAB.split("-")[1]){ // se o funcionário já estiver dentro do horário de serviço e fora do intervalo
                                if(today.getDay() >= element.DIA_TRAB.split("-")[0] && today.getDay() <= element.DIA_TRAB.split("-")[1]){
                                    arrFiltered.push(element)
                                }
                            }
                        }
                    })
                
                    while(arrFiltered.length != 1){
                        arrFiltered = arrFiltered.filter(element => element.LOGIN_USUARIO == arrFiltered[getRandomInt(arrFiltered.length-1)].LOGIN_USUARIO)
                    }
                }
            }   
            catch(error) {
                fs.writeFile(`C:\\Det\\${new Date().toLocaleDateString()}.txt`, error, (err) => {
                    if(err) throw err;
                    console.log("O arquivo foi criado")
                })
            }
            }, 3600000); // 60 minutos = 3600000 // set interval acaba aqui
        }
    }
}

module.exports = new BotWhatsapp();