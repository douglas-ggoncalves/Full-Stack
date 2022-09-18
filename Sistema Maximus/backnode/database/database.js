const knex = require('knex')({
  client: 'mssql',
  connection: {
    host : 'localhost',
    port : 5759,
    user : 'sa',
    password : 'password',
    database : 'MAXIMUS'
  }
});
  
module.exports = knex;
