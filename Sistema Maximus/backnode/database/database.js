const connection = require("../../connection/backConnection.json")

const knex = require('knex')({
  client: 'mssql',
  connection: {
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
    database: connection.database,
    timezone: 'UTC',
    typeCast: function (field, next) {
      console.log("Field type: " + field.type)
      if (field.type == 'DATETIME') {
        return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
      }
      return next();
    }
  },
});
  
module.exports = knex;
