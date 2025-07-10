var database = require("../database/database");

class ReplicController{
    async getData(req, res) {
        try{
            var networks = await database.raw(`
                select rede.NOME_REDE, rede.id from rede as rede
                left join loja on rede.id = loja.redeid
                where rede.rede_replica = '1'
                group by rede.NOME_REDE, rede.id
            `);

            var stores = await database.raw(`
                select * from loja loja
                left join rede on rede.id = loja.redeid
                order by REDEID, NUMERO_LOJA
            `);
        } catch(error) {
            res.status(406);
            res.send({err: "Ocorreu um erro na consulta do banco de dados: " + error});
            return;
        }
        res.send({success: "Tudo OK", networks: networks, stores: stores})
    }

    async searchComands(req, res) {
        var array;

        try{
             array = await req.body.array
                var result = await database.raw(`
                select * FROM OPENROWSET('SQLNCLI','${array.IP_LOJA},${array.PORTA_LOJA}';'${array.LOGIN_LOJA}';'${array.SENHA_LOJA}',
                    'select idloja as ''IDLojaDestino'', count(*) as ''QuantidadesDeComandos'' from historico..comandoreplicacao group by idloja order by idloja'
                );
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

    async postStores(req, res) {
        var numberStoreNewStore = req.body.numberStoreNewStore;
        var nameStore = req.body.nameStore;
        var ipStore = req.body.ipStore;
        var selected = req.body.selected;
        var doorIP = req.body.doorIP;
        var login = req.body.login;
        var password = req.body.password;

        if(numberStoreNewStore == undefined) {
            res.status(406); 
            res.send({err: `Número da loja precisa ser preenchido`}); 
            return;
        }
        if(nameStore == undefined) {
            res.status(406); 
            res.send({err: `Nome da loja precisa ser preenchido`}); 
            return;
        }
        if(ipStore == undefined) {
            res.status(406); 
            res.send({err: `IP da loja precisa ser preenchido`}); 
            return;
        }
        if(selected == undefined) {
            res.status(406); 
            res.send({err: `Rede da loja precisa ser preenchido`}); 
            return;
        }
        if(doorIP == undefined) {
            res.status(406); 
            res.send({err: `Porta da loja precisa ser preenchido`}); 
            return;
        }
        if(login == undefined) {
            res.status(406); 
            res.send({err: `Login da loja precisa ser preenchido`}); 
            return;
        }
        if(password == undefined) {
            res.status(406); 
            res.send({err: `Senha da loja precisa ser preenchido`}); 
            return;
        }

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
        var idStore = req.body.idStore; 
        var editNumberStoreNewStore = req.body.editNumberStoreNewStore;
        var editNameStore = req.body.editNameStore;
        var editIpStore = req.body.editIpStore;
        var editSelected = req.body.editSelected;
        var editDoorIP = req.body.editDoorIP;
        var editLogin =  req.body.editLogin; 
        var SENHA_LOJA = req.body.SENHA_LOJA;
        var RAZAO_LOJA = req.body.RAZAO_LOJA;
        var CNPJ_LOJA = req.body.CNPJ_LOJA.replace(".", "").replace(".", "").replace("-", "").replace("/", "");
        var SISTEMA_LOJA = req.body.SISTEMA_LOJA;
        var INTEGRACAO_LOJA = req.body.INTEGRACAO_LOJA;
        var ENDERECO_LOJA = req.body.ENDERECO_LOJA;
        var ACESSOREMOTO = req.body.ACESSOREMOTO;
        var SENHAACESSOREMOTO = req.body.SENHAACESSOREMOTO;

        if(idStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o id da loja`});
            return;
        }
        if(editNumberStoreNewStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o número da loja`});
            return;
        }
        if(editNameStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o nome da loja`});
            return;
        }
        if(editIpStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o IP da loja`});
            return;
        }
        if(editSelected == undefined){
            res.status(406);
            res.send({err: `Não foi informado o id da rede para esta loja`});
            return;
        }
        if(editDoorIP == undefined){
            res.status(406);
            res.send({err: `Não foi informado a porta da loja`});
            return;
        }
        if(editLogin == undefined){
            res.status(406);
            res.send({err: `Não foi informado o login da loja`});
            return;
        }

        var result = await database.select().where({ID_LOJA: idStore}).from("LOJA");
        if(result == ''){
            res.status(406);
            res.send({err: `Não foi encontrada nenhuma loja com o id informado`});
            return;
        } else{
            try{
                var query = '';
                if(INTEGRACAO_LOJA == 1){
                    // Query responsável por não permitir que uma loja tenha mais de 1 integração.
                    query = `update loja set INTEGRACAO_LOJA = 0 where REDEID = '${editSelected}';`;
                }

                await database.raw(`
                    ${query}

                    update loja set NUMERO_LOJA = '${editNumberStoreNewStore}', NOME_LOJA = '${editNameStore}', 
                    IP_LOJA = '${editIpStore}', PORTA_LOJA = '${editDoorIP}', LOGIN_LOJA = '${editLogin}', 
                    SENHA_LOJA = '${SENHA_LOJA}', RAZAO_LOJA = '${RAZAO_LOJA}', CNPJ_LOJA = '${CNPJ_LOJA}',
                    SISTEMA_LOJA = '${SISTEMA_LOJA}', INTEGRACAO_LOJA = ${INTEGRACAO_LOJA}, ENDERECO_LOJA = '${ENDERECO_LOJA}', ACESSOREMOTO = '${ACESSOREMOTO}',
                    SENHAACESSOREMOTO = '${SENHAACESSOREMOTO}', REDEID = '${editSelected}'
                    where ID_LOJA = '${idStore}'
                `); 
            } catch(error) {
                res.status(406);
                res.send({err: `Ocorreu um erro na edição da ${nameStore}, segue a mensagem de erro: ${error}`});
                return;
            }
        }
        res.status(200);
        res.send({success: `Loja alterada com sucesso`})
    }
    
    async edit(req, res) {
        var idStore = req.body.idStore; 
        var editNumberStoreNewStore = req.body.editNumberStoreNewStore;
        var editNameStore = req.body.editNameStore;
        var editIpStore = req.body.editIpStore;
        var editSelected = req.body.editSelected;
        var editDoorIP = req.body.editDoorIP;
        var editLogin =  req.body.editLogin; 
        var ACESSOREMOTO =  req.body.ACESSOREMOTO; 
        var SENHAACESSOREMOTO =  req.body.SENHAACESSOREMOTO; 
        var INTEGRACAO_LOJA = req.body.INTEGRACAO_LOJA; 

        if(idStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o id da loja`});
            return;
        }
        if(editNumberStoreNewStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o número da loja`});
            return;
        }
        if(editNameStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o nome da loja`});
            return;
        }
        if(editIpStore == undefined){
            res.status(406);
            res.send({err: `Não foi informado o IP da loja`});
            return;
        }
        if(editSelected == undefined){
            res.status(406);
            res.send({err: `Não foi informado o id da rede para esta loja`});
            return;
        }
        if(editDoorIP == undefined){
            res.status(406);
            res.send({err: `Não foi informado a porta da loja`});
            return;
        }
        if(editLogin == undefined){
            res.status(406);
            res.send({err: `Não foi informado o login da loja`});
            return;
        }

        var result = await database.select().where({ID_LOJA: idStore}).from("LOJA");
        if(result == ''){
            res.status(406);
            res.send({err: `Não foi encontrada nenhuma loja com o id informado`});
            return;
        } else{
            try{
                await database.raw(`
                    update loja set NUMERO_LOJA = '${editNumberStoreNewStore}', NOME_LOJA = '${editNameStore}', 
                    IP_LOJA = '${editIpStore}', PORTA_LOJA = '${editDoorIP}', LOGIN_LOJA = '${editLogin}', 
                    ACESSOREMOTO = '${ACESSOREMOTO}', SENHAACESSOREMOTO = '${SENHAACESSOREMOTO}', INTEGRACAO_LOJA = ${INTEGRACAO_LOJA}, REDEID = '${editSelected}'
                    where ID_LOJA = '${idStore}'
                `); 
            } catch(error) {
                res.status(406);
                res.send({err: `Ocorreu um erro na edição da ${nameStore}, segue a mensagem de erro: ${error}`});
                return;
            }
        }
        res.status(200);
        res.send({success: `Loja alterada com sucesso`})
    }

    async delete(req, res) {
        var id = req.params.id;
        
        try {
            var result = await database.select().where({ID_LOJA: id}).from("LOJA").del();
            if(result == 0){
                res.status(406);
                res.send({err: 'Nenhuma loja foi encontrada com os parâmetros informados'})
                return;
            } else if(result == 1){
                res.status(200);
                res.send({success: `Loja excluida com sucesso`})
                return;
            } 
        } catch(err) {
            res.status(406);
            res.send({err: 'Ocorreu um erro ' +err})
            return;
        }
    }
}

module.exports = new ReplicController();