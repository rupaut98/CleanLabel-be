const { Pool } = require('pg');
const pool = new Pool(); // Your database configuration from database.js

const createUser = async (email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0]; // Return the first user matching the email or undefined
};

const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0]; // Return the user matching the ID or undefined
};

const deleteUserByEmail = async (email) => {
  const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
  return result.rowCount; // Return the number of rows affected (should be 1 if a user was deleted)
};


module.exports = {
  createUser, 
  findUserByEmail,
  deleteUserByEmail,
  findUserById,
};