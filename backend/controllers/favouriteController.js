const db = require('../config/database');

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80';

function formatRecipe(row, visitorId) {
  if (!row) return null;

  let ingredients = [];
  try {
    ingredients = JSON.parse(row.ingredients);
  } catch {
    ingredients = [row.ingredients];
  }

  let instructions = [];
  try {
    instructions = JSON.parse(row.instructions);
  } catch {
    instructions = [row.instructions];
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    preparation_time: row.preparation_time,
    difficulty: row.difficulty,
    category: row.category,
    cuisine: row.cuisine || 'General',
    image_url: row.image_url || DEFAULT_FALLBACK_IMAGE,
    ingredients,
    instructions,
    likes: row.likes || 0,
    is_liked: Boolean(row.is_liked),
    is_favourite: true, // It is in favourites
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// POST /api/recipes/:id/favourite
exports.addFavourite = (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeId = parseInt(id, 10);
    const visitorId = req.headers['x-visitor-id'];

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format.'
      });
    }

    if (!visitorId || typeof visitorId !== 'string' || !visitorId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'X-Visitor-ID header is required to favourite a recipe.'
      });
    }

    // Verify recipe exists
    const recipe = db.prepare('SELECT id FROM recipes WHERE id = ?').get(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.'
      });
    }

    // Check if already in favourites
    const existing = db.prepare('SELECT id FROM favourites WHERE recipe_id = ? AND visitor_id = ?').get(recipeId, visitorId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Recipe is already in your favourites.',
        is_favourite: true
      });
    }

    db.prepare('INSERT INTO favourites (recipe_id, visitor_id) VALUES (?, ?)').run(recipeId, visitorId);

    res.status(201).json({
      success: true,
      message: 'Recipe added to favourites successfully',
      is_favourite: true
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/recipes/:id/favourite
exports.removeFavourite = (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeId = parseInt(id, 10);
    const visitorId = req.headers['x-visitor-id'];

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format.'
      });
    }

    if (!visitorId || typeof visitorId !== 'string' || !visitorId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'X-Visitor-ID header is required to remove favourite.'
      });
    }

    // Verify recipe exists
    const recipe = db.prepare('SELECT id FROM recipes WHERE id = ?').get(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.'
      });
    }

    const result = db.prepare('DELETE FROM favourites WHERE recipe_id = ? AND visitor_id = ?').run(recipeId, visitorId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recipe was not found in your favourites.',
        is_favourite: false
      });
    }

    res.json({
      success: true,
      message: 'Recipe removed from favourites successfully',
      is_favourite: false
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/favourites
exports.getFavourites = (req, res, next) => {
  try {
    const visitorId = req.headers['x-visitor-id'];

    if (!visitorId || typeof visitorId !== 'string' || !visitorId.trim()) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const query = `
      SELECT r.*,
        CASE WHEN rl.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
        1 AS is_favourite,
        f.created_at AS favourited_at
      FROM favourites f
      JOIN recipes r ON r.id = f.recipe_id
      LEFT JOIN recipe_likes rl ON rl.recipe_id = r.id AND rl.visitor_id = ?
      WHERE f.visitor_id = ?
      ORDER BY f.created_at DESC
    `;

    const rows = db.prepare(query).all(visitorId, visitorId);
    const recipes = rows.map(row => formatRecipe(row, visitorId));

    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};
