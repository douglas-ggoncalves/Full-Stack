const Napp = require("../models/Napp");

class NappController{
    async getData(req, res) {
        var dataNapp;
        try{
            dataNapp = await Napp.findData();
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem de dados da Napp, segue a mensagem de erro: ${err}`});
            return;
        }
        res.status(200);
        res.send({dataNapp: dataNapp})
    }

    async getAllDataDetailed(req, res) {
        var dataNapp;
        try{
            dataNapp = await Napp.findAllData();
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem de dados da Napp, segue a mensagem de erro: ${err}`});
            return;
        }
        res.status(200);
        res.send({dataNapp: dataNapp})
    }

    async editStore(req, res){
        var CNPJ = await req.body.CNPJ
        var STATUS_LOJA = await req.body.STATUS_LOJA

        var update = await Napp.editStore(CNPJ, STATUS_LOJA);
        if(update != undefined){
            res.status(200);
            res.send({success: "Loja alterada com sucesso"})
        } else{
            res.status(406);
            res.send({err: "Não foi possível fazer a alteração da loja"})
        }
    }

    async create(req, res) {
        var CNPJ = await req.body.CNPJ;
        var RazaoSocial = await req.body.RazaoSocial;
        var store = await Napp.getStore(CNPJ)

        if(store != undefined && store.length > 0){
            res.status(200);
            res.send({success: 'Loja já possui cadastro.'})
            return;
        }

        if(CNPJ == undefined || CNPJ == null){
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja, CNPJ Inválido."})
            return;
        }

        if(RazaoSocial == undefined || RazaoSocial == null || RazaoSocial == ""){
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja, Razão Social Inválida."})
            return;
        }

        var result = await Napp.new(CNPJ, RazaoSocial)  
        if(result != undefined){
            res.status(200);
            res.send({success: 'Loja cadastrada com sucesso.'})
            return;
        } else{
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja."})
            return;
        }
    }

    async createDataNapp(req, res) {
        var CNPJ = await req.body.CNPJ;
        var DataVenda = await req.body.DataVenda;
        var DataCatalogo = await req.body.DataCatalogo;
        var MsgVendas = await req.body.MsgVendas;
        var MsgCatalogo = await req.body.MsgCatalogo;

        if(CNPJ == undefined || CNPJ == null){
            res.status(406);
            res.send({err: "Não foi possível cadastrar a Loja, CNPJ Inválido."});
            return;
        } 

        var result = await Napp.newData(CNPJ, DataVenda, DataCatalogo, MsgVendas, MsgCatalogo)  
        if(result != undefined){
            res.status(200);
            res.send({success: 'Informação gravada com sucesso.'})
        } else{
            res.status(406);
            res.send({err: "Não foi possível gravar a informação."})
        }
    }

    async requestDataNapp(req, res) {
        var CNPJ = await req.body.CNPJ;
        var DataInicial = await req.body.dataInicial;
        var DataFinal = await req.body.dataFinal;
        
        if(CNPJ == undefined || CNPJ == null){
            res.status(406);
            res.send({err: "Não foi possível obter os dados, CNPJ Inválido."})
            return;
        } 
        
        var result = await Napp.getDataStore(CNPJ);
        
        if(result != undefined && result[0]){ // existe no banco
            var IP_LOJA = await result[0].IP_LOJA;
            var PORTA_LOJA = await result[0].PORTA_LOJA;
            var LOGIN_LOJA = await result[0].LOGIN_LOJA;
            var SENHA_LOJA = await result[0].SENHA_LOJA;

            var findVersion = await Napp.findVersion(IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA);

            if(findVersion != undefined){
                var valueVersion = await parseInt(findVersion[0].Valor_cfg);
                
                if(valueVersion < 3123){
                    res.status(406);
                    res.send({err: "A solicitação de dados não pode ser processada, pois a data da versão da loja deve ser igual ou posterior a 29/11/2023, comunique o suporte técnico."});
                    return;
                }
            }
            else{
                res.status(406);
                res.send({err: "Não foi possível consultar a data da versão da loja, comunique o suporte técnico."});
                return;
            }

            var findVersionMXService = await Napp.findVersionMXService(IP_LOJA, PORTA_LOJA, LOGIN_LOJA, SENHA_LOJA);
            
            // Verifica se o resultado está definido e se há um valor em Valor_cfg
            if(findVersionMXService && findVersionMXService[0] && findVersionMXService[0].Valor_cfg) {
                // Converte o valor para um objeto Date
                var valueVersionDate = await new Date(findVersionMXService[0].Valor_cfg);

                // Verifica se a conversão para data foi bem-sucedida
                if(isNaN(valueVersionDate.getTime())) {
                    res.status(406);
                    res.send({err: "Formato de data inválido retornado pelo Maximus Service, comunique o suporte técnico."});
                    return;
                }

                // Data limite para comparação
                var targetDate = await new Date('2023-11-29T14:00:00');

                // Verifica se a data é menor que a data alvo
                if(valueVersionDate < targetDate){
                    res.status(406);
                    res.send({err: "A solicitação de dados não pode ser processada, pois a data da versão do Maximus Service deve ser igual ou posterior a 29/11/2023, comunique o suporte técnico."});
                    return;
                }
            } else {
                // Caso o resultado do select seja indefinido ou não tenha um valor em Valor_cfg
                res.status(406);
                res.send({err: "A consulta da data da versão do Maximus Service não pôde ser realizada. Uma atualização manual do sistema é necessária, comunique o suporte técnico."});
                return;
            }
            
            var codEmpresa = await result[0].NUMERO_LOJA;
            var result = await Napp.insertDataStore(codEmpresa, DataInicial, DataFinal, CNPJ)  
            
            if(result == undefined){
                res.status(406);
                res.send({err: "O procedimento falhou devido a um erro no processo. Por favor, contate o suporte técnico."});
                return;
            }
            else{
                res.status(200);
                res.send({success: 'Requisição feita com sucesso.'});
                return;
            }
            
        } else{
            res.status(406);
            res.send({err: "O procedimento não pôde ser concluído, pois alguns dados da loja estão ausentes na base de dados. Por favor, contate o suporte técnico."});
            return;
        }
    }

    async requestsData(req, res) {
        var dataNapp;
        var CodEmpresa = await req.body.CodEmpresa;
        var CNPJ = await req.body.CNPJ;

        try{
            dataNapp = await Napp.findReqData(CodEmpresa, CNPJ);
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados de checagem de dados da Napp, segue a mensagem de erro: ${err}`});
            return;
        }

        res.status(200);
        res.send({dataNapp: dataNapp})
    }

    async requestsUpdateData(req, res){
        var CodEmpresa = await req.body.CodEmpresa;
        var CNPJ = await req.body.CNPJ;

        var update = await Napp.editStatusRequest(CodEmpresa, CNPJ);
        if(update != undefined){
            res.status(200);
            res.send({success: "Dado(s) alterados com sucesso."})
        } else{
            res.status(406);
            res.send({err: "Não foi realizar as alterações."})
        }
    }

    async setDataStore(req, res) {
        var getDataStore = await Napp.updateCNPJJJ();
        res.status(200);
    }
}

module.exports = new NappController();