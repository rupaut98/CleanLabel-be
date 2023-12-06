const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { parseIngredients } = require('../utilities/utils.js');

// POST endpoint for checking ingredient
router.post('/check-ingredient', async (req, res) => {
  const ingredientsInput = req.body.ingredients;
  const ingredients = parseIngredients(ingredientsInput);
  let foundIngredients = [];

  try {
    for (const ingredient of ingredients) {
      const result = await pool.query('SELECT * FROM unhealthy_ingredients WHERE name = $1', [ingredient]);
      if (result.rows.length > 0) {
        foundIngredients.push(...result.rows);
      }
    }

    if (foundIngredients.length > 0) {
      res.json(foundIngredients);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('Error querying the database', err.stack);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
