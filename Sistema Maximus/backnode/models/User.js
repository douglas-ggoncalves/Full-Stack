var knex = require("../database/database");
var bcrypt = require("bcrypt");

class User{
    async findLogin(login) {
        try {
            var result = await knex.raw(
            `
                select 
                    distinct ID_USUARIO, 
                    LOGIN_USUARIO, 
                    EMAIL_USUARIO,
                    CARGO_USUARIO,
                    SENHA_USUARIO,
                    IS_FUNCIONARIO,
                    IMG_USUARIO,
                    stuff(
                    (select ', ' + cast(UR.REDE_ID as varchar(10))
                    from USUARIO_REDE UR
                    where UR.USUARIO_ID = USUARIO.ID_USUARIO
                    for xml path('')), 1, 2, '') as RedesAssociadas
                from USUARIO
                left join USUARIO_REDE on USUARIO_REDE.USUARIO_ID = USUARIO.ID_USUARIO
                left join REDE on REDE.id = USUARIO_REDE.REDE_ID
                where LOGIN_USUARIO = '${login}'
            `
            );

            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findEmail(email) {
        try {
            var result = await knex.raw(
                `
                    select 
                        distinct ID_USUARIO, 
                        LOGIN_USUARIO, 
                        EMAIL_USUARIO,
                        CARGO_USUARIO,
                        SENHA_USUARIO,
                        IS_FUNCIONARIO,
                        IMG_USUARIO,
                        stuff(
                        (select ', ' + cast(UR.REDE_ID as varchar(10))
                        from USUARIO_REDE UR
                        where UR.USUARIO_ID = USUARIO.ID_USUARIO
                        for xml path('')), 1, 2, '') as RedesAssociadas
                    from USUARIO
                    left join USUARIO_REDE on USUARIO_REDE.USUARIO_ID = USUARIO.ID_USUARIO
                    left join REDE on REDE.id = USUARIO_REDE.REDE_ID
                    where EMAIL_USUARIO = '${email}'
                `
            );
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findUserById(id) {
        try {
            var result = await knex.raw(
                `
                    select 
                        distinct ID_USUARIO, 
                        LOGIN_USUARIO, 
                        EMAIL_USUARIO,
                        CARGO_USUARIO,
                        SENHA_USUARIO,
                        IS_FUNCIONARIO,
                        IMG_USUARIO,
                        stuff(
                        (select ', ' + cast(UR.REDE_ID as varchar(10))
                        from USUARIO_REDE UR
                        where UR.USUARIO_ID = USUARIO.ID_USUARIO
                        for xml path('')), 1, 2, '') as RedesAssociadas
                    from USUARIO
                    left join USUARIO_REDE on USUARIO_REDE.USUARIO_ID = USUARIO.ID_USUARIO
                    left join REDE on REDE.id = USUARIO_REDE.REDE_ID
                    where ID_USUARIO = ${id}
                `
            );
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async newUser(login, email, password, role, network, isFuncNew){
        try {
            var hash = await bcrypt.hash(password, 10);
            var result = await knex.insert({LOGIN_USUARIO: login, EMAIL_USUARIO: email, CARGO_USUARIO: role, SENHA_USUARIO: hash, IS_FUNCIONARIO: isFuncNew}).table("USUARIO");
            var idUser = await knex.raw(` select ID_USUARIO from USUARIO where LOGIN_USUARIO = '${login}' `);
            console.log("idUser " + JSON.stringify(idUser))
            
            if(idUser != undefined){
                console.log("idUser " + idUser[0].ID_USUARIO)

                
                var sql = "";
                    
                await network.forEach( element => {
                    sql += ` insert into USUARIO_REDE (USUARIO_ID, REDE_ID) values (${idUser[0].ID_USUARIO}, ${element}) `;
                });

                await knex.raw(sql)
                
            }
            
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async deleteUser(login){
        try {
            var result = await knex.select().where({LOGIN_USUARIO: login}).from("USUARIO").del();
            return result;
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findAllUser(){
        try {
            var result = await knex.raw(
            `
                select 
                    distinct ID_USUARIO, 
                    LOGIN_USUARIO, 
                    EMAIL_USUARIO,
                    CARGO_USUARIO,
                    SENHA_USUARIO,
                    IS_FUNCIONARIO,
                    IMG_USUARIO,
                    stuff(
                    (select ', ' + cast(UR.REDE_ID as varchar(10))
                    from USUARIO_REDE UR
                    where UR.USUARIO_ID = USUARIO.ID_USUARIO
                    for xml path('')), 1, 2, '') as RedesAssociadas
                from USUARIO
                left join USUARIO_REDE on USUARIO_REDE.USUARIO_ID = USUARIO.ID_USUARIO
                left join REDE on REDE.id = USUARIO_REDE.REDE_ID
            `
            );
            return result;
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    async editUser(login, role, network, idUser, passwordUser, alterPassword, editIsFunc){
        try {
            if(alterPassword){
                var hash = await bcrypt.hash(passwordUser, 10);
                var result = await knex.where('ID_USUARIO', '=', idUser).update({ LOGIN_USUARIO: login, CARGO_USUARIO: role, SENHA_USUARIO: hash, IS_FUNCIONARIO: editIsFunc }).table("USUARIO")
            }
            else{
                var result = await knex.where('ID_USUARIO', '=', idUser).update({ LOGIN_USUARIO: login, CARGO_USUARIO: role, IS_FUNCIONARIO: editIsFunc}).table("USUARIO")
            }
            
            await knex.raw(` delete USUARIO_REDE where USUARIO_ID = ${idUser}` )
            var sql = "";

            await network.forEach( element => {
                sql += ` insert into USUARIO_REDE (USUARIO_ID, REDE_ID) values (${idUser}, ${element}) `;
            });

            await knex.raw(sql)

            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async editUserPassword(idUser, img){
        try {
            var result = await knex.where('ID_USUARIO', '=', idUser).update({ IMG_USUARIO: img }).table("USUARIO")
            return result;
        } catch(err) {
            console.log(err)
            return undefined;
        }
    }

    async editPasswordUser(password, idUser){
        try {
            var hash = await bcrypt.hash(password, 10);
            var result = await knex.where('ID_USUARIO', '=', idUser).update({ SENHA_USUARIO: hash }).table("USUARIO")
            return result;
        } catch(err) {
            return undefined;
        }
    }
}

module.exports = new User();


