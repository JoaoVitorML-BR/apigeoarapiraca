const pg = require('knex')({
  client: 'pg',
  connection: {
    host: "localhost",
    port: "5433",
    user: "joaovtsu",
    database: "geoara",
    password: "fita1904",
  }
});

module.exports = pg;