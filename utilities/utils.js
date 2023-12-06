function parseIngredients(ingredientsString) {
    let cleanedString = ingredientsString.replace(/[\[\]{}()*\n\t]/g, ',');
    let ingredients = cleanedString.split(',')
                          .map(ingredient => ingredient.trim())
                          .filter(ingredient => ingredient);

    
    ingredients = ingredients.map(ingredient => ingredient.replace(/\s+/g, ' ')
                                                           .replace(/\.$/, '').trim().toLowerCase());

    return ingredients;
}

module.exports = { parseIngredients };
