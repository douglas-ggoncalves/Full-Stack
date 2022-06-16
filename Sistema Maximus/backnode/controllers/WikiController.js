var slugify = require('slugify')
var Wiki = require("../models/Wiki")

class WikiController{
    async create(req, res){
        var title = req.body.title
        var slug = slugify(title.toLowerCase())
        var desc = req.body.desc
        var status = req.body.status
        var moduleId = req.body.moduleId
        var existPost = await Wiki.findByTitle(title);
        if(existPost != undefined){
            res.status(406);
            res.send({err: "Já existe uma postagem com este título"})
            return;
        } else{
            var result = await Wiki.new(title, slug, desc, status, moduleId)  

            if(result != undefined){
                res.status(200);
                res.send({success: 'Postagem salva com sucesso'})
            } else{
                res.status(406);
                res.send({err: "Não foi possível cadastrar a postagem"})
            }
        }
    }

    async getPosts(req, res){
        var posts = await Wiki.findPosts();

        if(posts != undefined){
            res.status(200);
            res.send({arrayPosts: posts})
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar as postagens"})
        }
    }
    
    async getPost(req, res){
        var slug = req.query.slug
        var post = await Wiki.findBySlug(slug);

        if(post != undefined){
            res.status(200);
            res.send({post: post})
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar a postagem"})
        }
    }
    
    async editPost(req, res){
        var idPost = req.body.idPost
        var title = req.body.title
        var slug = slugify(title.toLowerCase())
        var desc = req.body.desc
        var status = req.body.status
        var moduleId = req.body.moduleId

        var existPost = await Wiki.findByTitle(title);
        if(existPost != undefined){
            if(existPost.ID_POST != idPost){
                res.status(406);
                res.send({err: "Já existe uma postagem com este título"})
                return;
            } else{
                var update = await Wiki.editPost(idPost, title, slug, desc, status, moduleId)
    
                if(update != undefined){
                    res.status(200);
                    res.send({success: "Postagem alterada com sucesso", slug: slug})
                } else{
                    res.status(406);
                    res.send({success: "Não foi possível fazer a alteração da postagem"})
                }
            }
        } else{
            var update = await Wiki.editPost(idPost, title, slug, desc, status, moduleId)
    
            if(update != undefined){
                res.status(200);
                res.send({success: "Postagem alterada com sucesso", slug: slug})
            } else{
                res.status(406);
                res.send({success: "Não foi possível fazer a alteração da postagem"})
            }
        }
    }

    async deletePost(req, res){
        var slug = req.params.slug
        var post = await Wiki.findBySlug(slug);

        if(post != undefined){
            var deletePost = await Wiki.deletePost(slug);

            if(deletePost != undefined){
                res.status(200);
                res.send({success: "Postagem excluida com sucesso"})
            } else{
                res.status(406);
                res.send({err: "Não foi possível carregar a postagem"}) 
            }
        } else{
            res.status(406);
            res.send({err: "Não foi possível carregar a postagem"})
        }
    }
}

module.exports = new WikiController();