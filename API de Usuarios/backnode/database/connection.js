var knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '93336848',
    database : 'apiusers'
  }
});

module.exports = knex