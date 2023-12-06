const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createUser(email, hashedPassword);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error registering new user.');
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findUserByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        res.json({ message: 'Login successful!' });
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