const knex = require('knex')({
  client: 'mssql',
  connection: {
    host : 'localhost',
    port : 3739,
    user : 'sa',
    password : 'passwordEditable',
    database : 'MAXIMUS'
  }
});
  
module.exports = knex;