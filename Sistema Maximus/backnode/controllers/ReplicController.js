var database = require("../database/database");

class ReplicController{
    async getData(req, res) {
        try{
            var networks = await database.raw(`
                select rede.NOME_REDE, rede.id from rede as rede
                left join loja on rede.id = loja.redeid
                group by rede.NOME_REDE, rede.id
            `);

            var stores = await database.raw(`
                select * from loja loja
                left join rede on rede.id = loja.redeid
                order by REDEID, NUMERO_LOJA
            `);
        } catch(error) {
            res.status(406);
            res.send({err: "Ocorreu um erro na consulta do banco de dados  "+ error});
            return;
        }
        res.send({success: "Tudo OK", networks: networks, stores: stores})
    }

    async searchComands(req, res) {
        var array;

        try{
            array = await req.body.array
            var result = await database.raw(`
        
            `).timeout(10000); // tempo limite de 10 segundos para a consulta ser realizada

            if(result.length == 0){
                array["result"] = await [{semComandos: 'Não existem comandos pendentes'}];
                res.send({success: "Requisição feita com sucesso", newArray: array})
            } else {
                array["result"] = await result;
                res.send({success: "Requisição feita com sucesso", newArray: array})
            }

        } catch(error) {
            res.status(406);
            array["err"] = "Ocorreu um erro de conexão";
            res.send({newArray: array, err: "Ocorreu um erro de conexão"});
            return;
        }
    }

    async getNetworks(req, res) {
        try{
            var networks  = await database.raw(`
	            select NOME_REDE from rede
            `)
        } catch(error){
            res.status(406);
            res.send({err: `Ocorreu um erro na inserção da rede ${networkName}, segue a mensagem de erro: ${error}`});
            return;
        } 
    }

    async postNetworks(req, res) {
        var networkName = await req.body.network;
        try{
            var networks  = await database.raw(`
	            select NOME_REDE from rede
            `)

            for(var x=0; x < networks.length; x++){
                if(JSON.stringify(networks[x].NOME_REDE.toUpperCase()).match(networkName.toUpperCase())){
                    res.status(406);
                    res.send({err: `Já existe uma rede criada com o nome ${networkName}`});
                    return;
                }
            }

            var select = await database.raw(`
                insert into rede (NOME_REDE) values ('${networkName}')
            `); 
        } catch(error) {
            res.status(406);
            res.send({err: `Ocorreu um erro na inserção da rede ${networkName}, segue a mensagem de erro: ${error}`});
            return;
        }

        res.send({success: "Rede cadastrada com sucesso!"})
    }

    async postStores(req, res) {
        var numberStoreNewStore =  req.body.numberStoreNewStore;
        var nameStore =  req.body.nameStore;
        var ipStore =  req.body.ipStore;
        var selected =  req.body.selected;
        var doorIP =  req.body.doorIP;
        var login =  req.body.login;
        var password =  req.body.password;

        try{
            await database.raw(`
                insert into loja (NUMERO_LOJA, NOME_LOJA, IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA, REDEID)
                values('${numberStoreNewStore}', '${nameStore}', '${ipStore}', ${doorIP}, '${login}', '${password}', '${selected}')
            `); 
            
        } catch(error) {
            res.status(406);
            res.send({err: `Ocorreu um erro na inserção da ${nameStore}, segue a mensagem de erro: ${error}`});
            return;
        }
        res.send({success: `Loja cadastrada com sucesso`})
    }

    async patchStores(req, res) {
        var idStore = req.body.idStore + 1; 
        var editNumberStoreNewStore = req.body.editNumberStoreNewStore;
        var editNameStore = req.body.editNameStore;
        var editIpStore = req.body.editIpStore;
        var editSelected = req.body.editSelected;
        var editDoorIP = req.body.editDoorIP;
        var editLogin =  req.body.editLogin; 

        try{
            await database.raw(`
                update loja set NUMERO_LOJA = '${editNumberStoreNewStore}', NOME_LOJA = '${editNameStore}', 
				IP_LOJA = '${editIpStore}', PORTA_LOJA = '${editDoorIP}', LOGIN_LOJA = '${editLogin}', REDEID = '${editSelected}'
				where ID_LOJA = '${idStore}'
            `); 
        } catch(error) {
            res.status(406);
            res.send({err: `Ocorreu um erro na inserção da ${nameStore}, segue a mensagem de erro: ${error}`});
            return;
        }
        res.send({success: `Loja alterada com sucesso`})
    }

    async delete(req, res) {
        var id = req.params.id;
        
        try {
            await database.select().where({ID_LOJA: id}).from("LOJA").del();
        } catch(err) {
            res.status(406);
            res.send({err: 'Ocorreu um erro ' +err})
            return;
        }

        res.send({success: `Loja excluida com sucesso`})
    }
}

module.exports = new ReplicController();