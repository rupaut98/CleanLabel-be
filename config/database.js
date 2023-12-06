// config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'rupakraut',
  host: 'localhost',
  database: 'rupakraut',
  password: 'rupak123@',
  port: 5432,
});

module.exports = pool;
