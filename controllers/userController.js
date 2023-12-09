const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken'); 
const { Pool } = require('pg');
const pool = new Pool(); 

const registerUser = async (req, res) => {
    const { email, password, username, consent, full_name, date_of_birth, profile_picture_url, location } = req.body;
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sign_up_date = new Date().toISOString();
        const last_login = sign_up_date;

        const newUser = await UserModel.createUser({
            email,
            hashedPassword,
            username,
            sign_up_date,
            last_login,
            consent,
            full_name,
            date_of_birth,
            profile_picture_url,
            location
        });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
    } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error registering new user.');
    }
  };
  
const loginUser = async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await UserModel.findUserByLogin(login);
        if (user && await bcrypt.compare(password, user.password)) {
            const lastLoginDate = new Date().toISOString();
            await pool.query(
                'UPDATE users SET last_login = $1 WHERE id = $2',
                [lastLoginDate, user.id]
            );

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful!', token});
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
};


const deleteUser = async (req, res) => {
    const { email } = req.params;
  
    try {
      const rowCount = await UserModel.deleteUserByEmail(email);
      if (rowCount > 0) {
        res.status(200).json({ message: 'User successfully deleted' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Deletion error:', error);
      res.status(500).send('Error deleting user.');
    }
  };


module.exports = {
  registerUser, loginUser, deleteUser
};