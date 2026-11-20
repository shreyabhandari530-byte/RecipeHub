const db = require('../config/database');

// POST /api/recipes/:id/like
exports.likeRecipe = (req, res, next) => {
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
        message: 'X-Visitor-ID header is required to like a recipe.'
      });
    }

    // Verify recipe exists
    const recipe = db.prepare('SELECT id, likes FROM recipes WHERE id = ?').get(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.'
      });
    }

    // Check if already liked by this visitor
    const alreadyLiked = db.prepare('SELECT id FROM recipe_likes WHERE recipe_id = ? AND visitor_id = ?').get(recipeId, visitorId);
    if (alreadyLiked) {
      return res.status(409).json({
        success: false,
        message: 'You have already liked this recipe.',
        likes: recipe.likes
      });
    }

    // Transaction to insert like and increment recipe likes count
    const transaction = db.transaction(() => {
      db.prepare('INSERT INTO recipe_likes (recipe_id, visitor_id) VALUES (?, ?)').run(recipeId, visitorId);
      db.prepare('UPDATE recipes SET likes = likes + 1 WHERE id = ?').run(recipeId);
      const updated = db.prepare('SELECT likes FROM recipes WHERE id = ?').get(recipeId);
      return updated.likes;
    });

    const newLikesCount = transaction();

    res.json({
      success: true,
      message: 'Recipe liked successfully',
      likes: newLikesCount,
      is_liked: true
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/recipes/:id/like
exports.unlikeRecipe = (req, res, next) => {
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
        message: 'X-Visitor-ID header is required to unlike a recipe.'
      });
    }

    // Verify recipe exists
    const recipe = db.prepare('SELECT id, likes FROM recipes WHERE id = ?').get(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.'
      });
    }

    // Check if like exists
    const existingLike = db.prepare('SELECT id FROM recipe_likes WHERE recipe_id = ? AND visitor_id = ?').get(recipeId, visitorId);
    if (!existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this recipe yet.',
        likes: recipe.likes
      });
    }

    // Transaction to delete like and decrement recipe likes count safely (never below 0)
    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM recipe_likes WHERE recipe_id = ? AND visitor_id = ?').run(recipeId, visitorId);
      db.prepare('UPDATE recipes SET likes = MAX(0, likes - 1) WHERE id = ?').run(recipeId);
      const updated = db.prepare('SELECT likes FROM recipes WHERE id = ?').get(recipeId);
      return updated.likes;
    });

    const newLikesCount = transaction();

    res.json({
      success: true,
      message: 'Recipe unliked successfully',
      likes: newLikesCount,
      is_liked: false
    });
  } catch (error) {
    next(error);
  }
};
