const db = require('../config/database');

// Default fallback image if none provided
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80';

// Helper to parse DB row into recipe object
function formatRecipe(row, visitorId = null) {
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

  const recipe = {
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
    created_at: row.created_at,
    updated_at: row.updated_at
  };

  // If row has liked/favourite flags from query, format as boolean
  if (row.is_liked !== undefined) {
    recipe.is_liked = Boolean(row.is_liked);
  }
  if (row.is_favourite !== undefined) {
    recipe.is_favourite = Boolean(row.is_favourite);
  }

  return recipe;
}

// GET /api/recipes
exports.getAllRecipes = (req, res, next) => {
  try {
    const { search, category, cuisine, difficulty } = req.query;
    const visitorId = req.headers['x-visitor-id'] || '';

    let baseQuery = `
      SELECT r.*,
        CASE WHEN rl.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
        CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_favourite
      FROM recipes r
      LEFT JOIN recipe_likes rl ON rl.recipe_id = r.id AND rl.visitor_id = ?
      LEFT JOIN favourites f ON f.recipe_id = r.id AND f.visitor_id = ?
      WHERE 1=1
    `;

    const params = [visitorId, visitorId];

    // Filter by Category
    if (category && category !== 'All') {
      baseQuery += ' AND r.category = ?';
      params.push(category);
    }

    // Filter by Difficulty
    if (difficulty && difficulty !== 'All') {
      baseQuery += ' AND r.difficulty = ?';
      params.push(difficulty);
    }

    // Filter by Cuisine
    if (cuisine && cuisine.trim()) {
      baseQuery += ' AND LOWER(r.cuisine) LIKE ?';
      params.push(`%${cuisine.trim().toLowerCase()}%`);
    }

    // Search by title, ingredient keyword, or cuisine type
    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      baseQuery += ` AND (
        LOWER(r.title) LIKE ? OR
        LOWER(r.cuisine) LIKE ? OR
        LOWER(r.description) LIKE ? OR
        LOWER(r.ingredients) LIKE ?
      )`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    baseQuery += ' ORDER BY r.created_at DESC';

    const rows = db.prepare(baseQuery).all(...params);
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

// GET /api/recipes/:id
exports.getRecipeById = (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeId = parseInt(id, 10);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format.'
      });
    }

    const visitorId = req.headers['x-visitor-id'] || '';

    const query = `
      SELECT r.*,
        CASE WHEN rl.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
        CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_favourite
      FROM recipes r
      LEFT JOIN recipe_likes rl ON rl.recipe_id = r.id AND rl.visitor_id = ?
      LEFT JOIN favourites f ON f.recipe_id = r.id AND f.visitor_id = ?
      WHERE r.id = ?
    `;

    const row = db.prepare(query).get(visitorId, visitorId, recipeId);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.'
      });
    }

    res.json({
      success: true,
      data: formatRecipe(row, visitorId)
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/recipes
exports.createRecipe = (req, res, next) => {
  try {
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

    const stmt = db.prepare(`
      INSERT INTO recipes (
        title, description, preparation_time, difficulty, category, cuisine,
        image_url, ingredients, instructions, likes
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, 0
      )
    `);

    const result = stmt.run(
      title,
      description,
      preparation_time,
      difficulty,
      category,
      cuisine,
      image_url,
      JSON.stringify(ingredients),
      JSON.stringify(instructions)
    );

    const newRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: formatRecipe(newRecipe)
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/recipes/:id
exports.updateRecipe = (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeId = parseInt(id, 10);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format.'
      });
    }

    const existing = db.prepare('SELECT id FROM recipes WHERE id = ?').get(recipeId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found to update.'
      });
    }

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

    const stmt = db.prepare(`
      UPDATE recipes
      SET title = ?,
          description = ?,
          preparation_time = ?,
          difficulty = ?,
          category = ?,
          cuisine = ?,
          image_url = ?,
          ingredients = ?,
          instructions = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title,
      description,
      preparation_time,
      difficulty,
      category,
      cuisine,
      image_url,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      recipeId
    );

    const visitorId = req.headers['x-visitor-id'] || '';
    const updated = db.prepare(`
      SELECT r.*,
        CASE WHEN rl.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
        CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_favourite
      FROM recipes r
      LEFT JOIN recipe_likes rl ON rl.recipe_id = r.id AND rl.visitor_id = ?
      LEFT JOIN favourites f ON f.recipe_id = r.id AND f.visitor_id = ?
      WHERE r.id = ?
    `).get(visitorId, visitorId, recipeId);

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: formatRecipe(updated, visitorId)
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/recipes/:id
exports.deleteRecipe = (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeId = parseInt(id, 10);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format.'
      });
    }

    const existing = db.prepare('SELECT id FROM recipes WHERE id = ?').get(recipeId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found to delete.'
      });
    }

    // ON DELETE CASCADE will clean up recipe_likes and favourites
    db.prepare('DELETE FROM recipes WHERE id = ?').run(recipeId);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
