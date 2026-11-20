const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const likeController = require('../controllers/likeController');
const favouriteController = require('../controllers/favouriteController');
const validateRecipe = require('../middleware/validateRecipe');

// Recipe CRUD
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/', validateRecipe, recipeController.createRecipe);
router.put('/:id', validateRecipe, recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

// Likes
router.post('/:id/like', likeController.likeRecipe);
router.delete('/:id/like', likeController.unlikeRecipe);

// Favourites under recipe resource
router.post('/:id/favourite', favouriteController.addFavourite);
router.delete('/:id/favourite', favouriteController.removeFavourite);

module.exports = router;
