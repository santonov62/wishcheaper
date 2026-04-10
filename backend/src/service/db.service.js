const { Pool } = require('pg');
const connectionString = require('../../knexfile')[process.env.NODE_ENV].connection;
const pool = new Pool({ connectionString: connectionString });

module.exports = pool;