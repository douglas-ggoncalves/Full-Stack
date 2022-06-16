var knex = require("../database/database");

class Wiki{
    async new(title, slug, desc, status, moduleId){
        try {
            var result = await knex.insert({TITULO: title, SLUG: slug , DESCRICAO: desc, ATIVO: status, CODMODULO: moduleId}).table("POSTAGEM");
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async findByTitle(title){
        var result = await knex.select().where({TITULO: title}).table("POSTAGEM")

        if(result.length > 0) {
            return result[0];
        } else {
            return undefined;
        }
    }
    async findBySlug(slug){
        var result = await knex.select().where({SLUG: slug}).table("POSTAGEM")

        if(result.length > 0) {
            return result[0];
        } else {
            return undefined;
        }
    }

    async findPosts(){
        var result = knex.select().table("POSTAGEM").orderBy("CODMODULO")
        return result;
    }

    async editPost(idPost, title, slug, desc, status, moduleId){
        try {
            var result = await knex.where('ID_POST', '=', idPost).update({ TITULO: title, SLUG: slug, DESCRICAO: desc, ATIVO: status, CODMODULO: moduleId }).table("POSTAGEM")
            return result;
        } catch(err) {
            return undefined;
        }
    }

    async deletePost(slug){
        try {
            var result = await knex.select().where({SLUG: slug}).from("POSTAGEM").del();
            return result;
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }
}

module.exports = new Wiki();


