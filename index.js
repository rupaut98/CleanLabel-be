const express = require('express');
const ingredientRoutes = require('./routes/ingredientRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/', ingredientRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
