const knex = require('knex')({
  client: 'mssql',
  connection: {
    host : 'localhost',
    port : 3739,
    user : 'sa',
    password : 'D12$5664mn',
    database : 'MAXIMUS'
  }
});
  
module.exports = knex;
