const { Pool } = require('pg');
const pool = new Pool(); 

const createUser = async (userData) => {
  const { email, hashedPassword, username, sign_up_date, last_login, consent, full_name, date_of_birth, profile_picture_url, location } = userData;

  try {
    // Start transaction
    await pool.query('BEGIN');

    // Insert into users table
    const userResult = await pool.query(
      'INSERT INTO users (email, password, username, sign_up_date, last_login) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, hashedPassword, username, sign_up_date, last_login]
    );
    
    const userId = userResult.rows[0].id;

    // Insert into user_details table
    await pool.query(
      'INSERT INTO user_details (id, consent, full_name, date_of_birth, profile_picture_url) VALUES ($1, $2, $3, $4, $5)',
      [userId, consent, full_name, date_of_birth, profile_picture_url]
    );

    // Insert into user_locations table
    await pool.query(
      'INSERT INTO user_locations (id, location) VALUES ($1, $2)',
      [userId, location]
    );

    // Commit transaction
    await pool.query('COMMIT');

    return { id: userId, email, username, sign_up_date, last_login };
  } catch (error) {
    // Rollback transaction if any error occurs
    await pool.query('ROLLBACK');
    throw error;
  }
};


const findUserByLogin = async (login) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 OR username = $1', 
    [login]
  );
  return result.rows[0]; 
};


const deleteUserByEmail = async (email) => {
  const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
  return result.rowCount; 
};


module.exports = {
  createUser, 
  findUserByLogin,
  deleteUserByEmail,
};