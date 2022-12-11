const connection = require("../../connection/backConnection.json")

const knex = require('knex')({
  client: 'mssql',
  connection: {
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
    database: connection.database
  }
});
  
module.exports = knex;
