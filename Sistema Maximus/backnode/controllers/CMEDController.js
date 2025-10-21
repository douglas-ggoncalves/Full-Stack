var CMED = require("../models/CMED")
var knex = require("../database/database");

class CMEDController{

    async getPreco(req, res) {
        var codBarrasPrincipal = await req.params.codBarrasPrincipal;
        var codBarrasAUX = await req.params.codBarrasAUX;

        try{
            var dataCMED = await CMED.findData(codBarrasPrincipal, codBarrasAUX);

            if(dataCMED == ""){
                res.status(406);
                res.send({err: `Não foram encontrados dados para o(s) código(s) de barras fornecido(s).`});
                return;
            }
            else{
                res.status(200);
                res.send({dataCMED: dataCMED})
            }
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados, comunique o suporte técnico.`, exception: err});
            return;
        }
    }

    async getListPreco(req, res) {
        var codUF = await req.params.codUf;

        try{
            var dataCMED = await CMED.findList(codUF);

            if(dataCMED == ""){
                res.status(406);
                res.send({err: `Não foram encontrados dados para o UF ${codUF} fornecido.`});
                return;
            }
            else{
                res.status(200);
                res.send({dataCMED: dataCMED})
            }
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados, comunique o suporte técnico.`, exception: err});
            return;
        }
    }

    async getDataUltimaAtualizacao(req, res) {
        var data = await req.params.data;

        try{
            var resUltAtt = await CMED.findUltAtt(data);
            res.status(200);
            res.send({atualizado: resUltAtt})
        }
        catch(err){
            res.status(406);
            res.send({err: `Ocorreu um erro na busca dos dados, comunique o suporte técnico.`, exception: err});
            return;
        }
    }

    async postData(req, res) {
        var LISTA_CMED = req.body.LISTA_CMED;

        let deleteQuery = " delete MEDICAMENTOS ";
        knex.raw(deleteQuery)
            .then(() => {
                console.log("Dados CMED deletados com sucesso.");
            })
            .catch(error => {
                console.error("Erro ao inserir dados.", error);
                return;
            });
                
        console.log("Tamanho de Items lista CMED + " + LISTA_CMED.length)

        // const columns = [
        //     "Substancia", "CNPJ", "Laboratorio", "CodigoGGREM", "Registro", "EAN1", "EAN2", "EAN3", "Produto", 
        //     "Apresentacao", "ClasseTerapeutica", "TipoProdutoStatus", "RegimePreco", "PFSemImpostos", 
        //     "PF0", "PF12", "PF12_ALC", "PF17", "PF17_ALC", "PF17_5", "PF17_5_ALC", "PF18", "PF18_ALC", "PF19", "PF19_ALC", "PF19_5", "PF19_5_ALC", 
        //     "PF20", "PF20_ALC", "PF20_5", "PF21", "PF21_ALC", "PF22", "PF22_ALC", "PMCSemImpostos", "PMC0", "PMC12", "PMC12_ALC", "PMC17", "PMC17_ALC", "PMC17_5", "PMC17_5_ALC", 
        //     "PMC18", "PMC18_ALC", "PMC19", "PMC19_ALC", "PMC19_5", "PMC19_5_ALC", "PMC20", "PMC20_ALC", "PMC20_5", "PMC21", "PMC21_ALC", "PMC22", "PMC22_ALC", "RestricaoHospitalar", "CAP", 
        //     "CONFAZ87", "ICMS0", "AnaliseRecursal", "ListaConcessaoCreditoTributario", "Comercializacao2022", "Tarja"
        // ];

       const decimalColumns = new Set([
    "PFSemImpostos", "PF0", "PF12", "PF12_ALC", "PF17", "PF17_ALC", "PF17_5", "PF17_5_ALC", "PF18", "PF18_ALC",
    "PF19", "PF19_ALC", "PF19_5", "PF19_5_ALC", "PF20", "PF20_ALC", "PF20_5", "PF20_5_ALC", "PF21", "PF21_ALC",
    "PF22", "PF22_ALC", "PF22_5", "PF22_5_ALC", "PF23", "PF23_ALC", "PMCSemImpostos", "PMC0", "PMC12", "PMC12_ALC",
    "PMC17", "PMC17_ALC", "PMC17_5", "PMC17_5_ALC", "PMC18", "PMC18_ALC", "PMC19", "PMC19_ALC", "PMC19_5",
    "PMC19_5_ALC", "PMC20", "PMC20_ALC", "PMC20_5", "PMC20_5_ALC", "PMC21", "PMC21_ALC", "PMC22", "PMC22_ALC",
    "PMC22_5", "PMC22_5_ALC", "PMC23", "PMC23_ALC"
]);

const columns = [
    "Substancia", "CNPJ", "Laboratorio", "CodigoGGREM", "Registro", "EAN1", "EAN2", "EAN3", "Produto",
    "Apresentacao", "ClasseTerapeutica", "TipoProdutoStatus", "RegimePreco", "PFSemImpostos",
    "PF0", "PF12", "PF12_ALC", "PF17", "PF17_ALC", "PF17_5", "PF17_5_ALC", "PF18", "PF18_ALC", "PF19", "PF19_ALC",
    "PF19_5", "PF19_5_ALC", "PF20", "PF20_ALC", "PF20_5", "PF20_5_ALC", "PF21", "PF21_ALC", "PF22", "PF22_ALC",
    "PF22_5", "PF22_5_ALC", "PF23", "PF23_ALC", "PMCSemImpostos", "PMC0", "PMC12", "PMC12_ALC", "PMC17",
    "PMC17_ALC", "PMC17_5", "PMC17_5_ALC", "PMC18", "PMC18_ALC", "PMC19", "PMC19_ALC", "PMC19_5", "PMC19_5_ALC",
    "PMC20", "PMC20_ALC", "PMC20_5", "PMC20_5_ALC", "PMC21", "PMC21_ALC", "PMC22", "PMC22_ALC", "PMC22_5",
    "PMC22_5_ALC", "PMC23", "PMC23_ALC", "RestricaoHospitalar", "CAP", "CONFAZ87", "ICMS0", "AnaliseRecursal",
    "ListaConcessaoCreditoTributario", "Comercializacao2024", "Tarja"
];

LISTA_CMED.forEach((elementArray) => {
    if (!Array.isArray(elementArray)) {
        console.error("Erro: Elemento não é uma array:", elementArray);
        return;
    }

    const treatedValues = elementArray.map((value, index) => {
        const column = columns[index];

        if (value === null || value.trim() === '' || value.trim() === '-' || value.trim() === '- (*)') {
            return 'NULL';
        }

        // Aplica sua limpeza original
        let cleaned = value.replace(/'/g, "").replace(/\*$/g, "").trim();

        if (decimalColumns.has(column)) {
            // Substitui vírgula por ponto e não coloca aspas
            const numericValue = cleaned.replace(',', '.');
            return isNaN(Number(numericValue)) ? 'NULL' : numericValue;
        } else {
            // Campo string, envolve com aspas simples
            return `'${cleaned}'`;
        }
    });

    const insertQuery = `INSERT INTO MEDICAMENTOS (${columns.join(", ")}) VALUES (${treatedValues.join(", ")});`;

    knex.raw(insertQuery)
        .then(() => {
            // console.log("Dados inseridos com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao inserir dados:", error);
        });
});



        console.log("Finalizado Inserção dos Medicamentos")

        var updateDataAtualizacao = " update CMED_ATUALIZACAO set DATA_ULTIMA_ATUALIZACAO = cast(getdate() as datetime) ";

        knex.raw(updateDataAtualizacao)
            .then(() => {
                // console.log("Dados inseridos com sucesso!");
            })
            .catch(error => {
                console.error("Erro ao atualizar data de atualização CMED: ", error);
            });
    }
}

module.exports = new CMEDController();