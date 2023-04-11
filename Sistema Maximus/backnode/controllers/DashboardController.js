var database = require("../database/database");
var Dashboard = require("../models/Dashboard");

class DashboardController{
    async create(req, res) {
        var id = await req.body.id;

        try{
            await database.raw(`
                insert into DATA_REPLICACAO (USUARIO_ID, DATA_CHECAGEM) values (${id}, cast(getDate() as datetime))
            `); 
        } catch(error) {
            res.status(406);
            res.send({err: `Ocorreu um erro na inserção da informação de checagem da replicação, segue a mensagem de erro: ${error}`});
            return;
        }
        res.send({success: `Informação salva com sucesso.`})
    }

    async getUsers(req, res) {
        var users;
        try{
            users = await Dashboard.findUsers();
        }
        catch(error){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem da replicação, segue a mensagem de erro: ${error}`});
            return;
        }
        res.status(200);
        res.send({replic: users})
    }

    async getCountUsers(req, res) {
        var users;
        var dataIni = await req.query.dataIni;
        var dataFim = await req.query.dataFim;

        if(dataIni != undefined && dataIni != null){
            const [yearIni, monthIni, dayIni] = dataIni.split('-')
            var dataInicial = `${yearIni}-${monthIni}-${dayIni} 00:00:00.000`
    
            const [yearFim, monthFim, dayFim] = dataFim.split('-')
            var dataFinal = `${yearFim}-${monthFim}-${dayFim} 23:59:59.000`
        }
        
        try{
            users = await Dashboard.countDataUsers(dataInicial, dataFinal);
        }
        catch(error){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem da replicação, segue a mensagem de erro: ${error}`});
            return;
        }
        res.status(200);
        res.send({replic: users})
    }
}

module.exports = new DashboardController();
