const knex = require('knex')({
  client: 'mssql',
  connection: {
    host : 'localhost',
    port : 3739,
    user : 'sa',
    password : 'd120588$788455',
    database : 'MAXIMUS'
  }
});
  
module.exports = knex;
