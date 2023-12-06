const express = require('express');
const ingredientRoutes = require('./routes/ingredientRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/', ingredientRoutes);

const port = 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
