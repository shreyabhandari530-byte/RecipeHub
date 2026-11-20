import { apiRequest } from './api';

/**
 * Fetch all recipes with optional filters (search, category, difficulty, cuisine)
 */
export async function getAllRecipes(filters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    queryParams.append('search', filters.search.trim());
  }
  if (filters.category && filters.category !== 'All') {
    queryParams.append('category', filters.category);
  }
  if (filters.difficulty && filters.difficulty !== 'All') {
    queryParams.append('difficulty', filters.difficulty);
  }
  if (filters.cuisine && filters.cuisine.trim()) {
    queryParams.append('cuisine', filters.cuisine.trim());
  }

  const queryString = queryParams.toString();
  const endpoint = `/recipes${queryString ? `?${queryString}` : ''}`;
  return await apiRequest(endpoint, { method: 'GET' });
}

/**
 * Fetch a single recipe by its ID
 */
export async function getRecipeById(id) {
  return await apiRequest(`/recipes/${id}`, { method: 'GET' });
}

/**
 * Create a new recipe
 */
export async function createRecipe(recipeData) {
  return await apiRequest('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData)
  });
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(id, recipeData) {
  return await apiRequest(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipeData)
  });
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id) {
  return await apiRequest(`/recipes/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Like a recipe (optimistic update compatible)
 */
export async function likeRecipe(id) {
  return await apiRequest(`/recipes/${id}/like`, {
    method: 'POST'
  });
}

/**
 * Unlike a recipe (optimistic update compatible)
 */
export async function unlikeRecipe(id) {
  return await apiRequest(`/recipes/${id}/like`, {
    method: 'DELETE'
  });
}

/**
 * Add a recipe to favourites
 */
export async function addFavourite(id) {
  return await apiRequest(`/recipes/${id}/favourite`, {
    method: 'POST'
  });
}

/**
 * Remove a recipe from favourites
 */
export async function removeFavourite(id) {
  return await apiRequest(`/recipes/${id}/favourite`, {
    method: 'DELETE'
  });
}

/**
 * Fetch all favourite recipes for the current visitor
 */
export async function getFavourites() {
  return await apiRequest('/favourites', {
    method: 'GET'
  });
}

export default {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  addFavourite,
  removeFavourite,
  getFavourites
};
