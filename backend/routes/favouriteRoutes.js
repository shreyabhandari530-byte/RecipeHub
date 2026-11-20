const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');

// GET /api/favourites
router.get('/', favouriteController.getFavourites);

module.exports = router;
