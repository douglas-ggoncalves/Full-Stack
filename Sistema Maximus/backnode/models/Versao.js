var knex = require("../database/database");

class Versao{
    async new(dataPublicacao){
        try {
            var result = await knex.insert({DataPublicacao: dataPublicacao}).table("Versoes");
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async find(){
        let result = await knex.raw(`
            select 
                Versoes.ID, 
                Versoes.DataPublicacao, 
                count(VersoesModulos.IdVersao) as QtdModificacoes,
                case when coalesce(Versoes.PdfBase64, '') <> '' then 1 else 0 end as PdfDisponivel
            from Versoes 
            left join VersoesModulos on VersoesModulos.IdVersao = Versoes.ID
            group by 
                Versoes.ID, 
                Versoes.DataPublicacao,
                Versoes.PdfBase64    
        `)

        return result;
    }
    
    async findById(id, getPdfBase64){
         try {
            // Define os campos que deseja retornar
            const columns = ["ID", "DataPublicacao"];

            if (getPdfBase64) {
                columns.push("PdfBase64"); // adiciona apenas se for necessário
            }
            
            let result = await knex.select(columns).where({ID: id}).from("Versoes");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            return undefined;
        }
    }

    async edit(id, dataPublicacao){
        try {
            let set = dataPublicacao ? `DataPublicacao = cast('${dataPublicacao}' as datetime)` : `DataPublicacao = null`;
            let updateDataAtualizacao = `update Versoes set ${set} where ID = ${id} `; 
                
           let result = await knex.raw(updateDataAtualizacao)
           
            return result;
        } catch(err) {
            console.error("Erro ao atualizar data de publicação: ", err);

            return undefined;
        }
    }
    
    async editPdfBase64(id, base64){
        try {
            let set = base64 ? `PdfBase64 = '${base64}'` : `PdfBase64 = null`;
            let updateDataAtualizacao = `update Versoes set ${set} where ID = ${id} `; 
                
           let result = await knex.raw(updateDataAtualizacao)
           
            return result;
        } catch(err) {
            console.error("Erro ao atualizar o base 64 do PDF: ", err);

            return undefined;
        }
    }
}

module.exports = new Versao();