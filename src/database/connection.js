const pg = require('knex')({
  client: 'pg',
  connection: {
    host: "geoara",
    port: "5432",
    user: "geoara",
    database: "geoara",
    password: "login123",
  }
});

module.exports = pg;