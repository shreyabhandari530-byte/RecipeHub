const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const VALID_CATEGORIES = ['Breakfast', 'Lunch', 'Dessert', 'Vegan'];

function validateRecipe(req, res, next) {
  const {
    title,
    description,
    preparation_time,
    difficulty,
    category,
    cuisine,
    image_url,
    ingredients,
    instructions
  } = req.body;

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Recipe title is required and must be at least 3 characters long.'
    });
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Recipe description is required.'
    });
  }

  // Preparation time validation
  const prepTime = Number(preparation_time);
  if (!Number.isInteger(prepTime) || prepTime <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Preparation time must be a positive whole number (in minutes).'
    });
  }

  // Difficulty validation
  if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}.`
    });
  }

  // Category validation
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`
    });
  }

  // Ingredients validation
  let parsedIngredients = ingredients;
  if (typeof ingredients === 'string') {
    try {
      parsedIngredients = JSON.parse(ingredients);
    } catch {
      parsedIngredients = [ingredients];
    }
  }

  if (!Array.isArray(parsedIngredients)) {
    return res.status(400).json({
      success: false,
      message: 'Ingredients must be provided as an array of items.'
    });
  }

  const cleanIngredients = parsedIngredients
    .map(i => (typeof i === 'string' ? i.trim() : ''))
    .filter(i => i.length > 0);

  if (cleanIngredients.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one non-empty ingredient is required.'
    });
  }

  // Instructions validation
  let parsedInstructions = instructions;
  if (typeof instructions === 'string') {
    try {
      parsedInstructions = JSON.parse(instructions);
    } catch {
      parsedInstructions = [instructions];
    }
  }

  if (!Array.isArray(parsedInstructions)) {
    return res.status(400).json({
      success: false,
      message: 'Instructions must be provided as an array of steps.'
    });
  }

  const cleanInstructions = parsedInstructions
    .map(i => (typeof i === 'string' ? i.trim() : ''))
    .filter(i => i.length > 0);

  if (cleanInstructions.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one non-empty cooking instruction step is required.'
    });
  }

  // Image URL validation (optional, but if provided must be valid URL)
  if (image_url && typeof image_url === 'string' && image_url.trim().length > 0) {
    try {
      new URL(image_url.trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Provided image URL is invalid. Please supply a valid web URL or leave it blank for the default image.'
      });
    }
  }

  // Attach sanitized data to request body
  req.body.title = title.trim();
  req.body.description = description.trim();
  req.body.preparation_time = prepTime;
  req.body.difficulty = difficulty;
  req.body.category = category;
  req.body.cuisine = cuisine && typeof cuisine === 'string' ? cuisine.trim() : 'General';
  req.body.image_url = image_url && image_url.trim() ? image_url.trim() : null;
  req.body.ingredients = cleanIngredients;
  req.body.instructions = cleanInstructions;

  next();
}

module.exports = validateRecipe;
