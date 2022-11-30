const knex = require('knex')({
  client: 'mssql',
  connection: {
    host : '26.173.58.85',
    port : 3738,
    user : 'sa',
    password : 'd120588$788455',
    database : 'SistemaMaximus'
  }
});
  
module.exports = knex;
