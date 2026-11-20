-- RecipeHub Database Schema
-- Enables foreign keys
PRAGMA foreign_keys = ON;

-- Table 1: recipes
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    preparation_time INTEGER NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
    category TEXT NOT NULL CHECK(category IN ('Breakfast', 'Lunch', 'Dessert', 'Vegan')),
    cuisine TEXT,
    image_url TEXT,
    ingredients TEXT NOT NULL, -- Stored as JSON array string
    instructions TEXT NOT NULL, -- Stored as JSON array string
    likes INTEGER DEFAULT 0 CHECK(likes >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: recipe_likes
CREATE TABLE IF NOT EXISTS recipe_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    visitor_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE(recipe_id, visitor_id)
);

-- Table 3: favourites
CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    visitor_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE(recipe_id, visitor_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_visitor ON recipe_likes(visitor_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe ON recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favourites_visitor ON favourites(visitor_id);
CREATE INDEX IF NOT EXISTS idx_favourites_recipe ON favourites(recipe_id);
