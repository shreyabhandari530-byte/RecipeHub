import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getAllRecipes } from '../services/recipeService';
import '../styles/Home.css';

export default function Home({ onFavouriteChanged }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');

  // Data states
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync category from URL param if user clicked category link in footer or elsewhere
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat && urlCat !== category) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  // Fetch recipes whenever filters change
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllRecipes({
        search: searchTerm,
        category: category,
        difficulty: difficulty
      });

      if (response.success) {
        setRecipes(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch recipes.');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, difficulty]);

  useEffect(() => {
    // Debounce search slightly to prevent rapid spamming while typing
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  // Handlers
  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (selectedCat === 'All') newParams.delete('category');
      else newParams.set('category', selectedCat);
      return newParams;
    });
  };

  const handleDifficultySelect = (selectedDiff) => {
    setDifficulty(selectedDiff);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setDifficulty('All');
    setSearchParams({});
  };

  const handleLikeChanged = (recipeId, newLikes, isLiked) => {
    setRecipes(prev =>
      prev.map(r => r.id === recipeId ? { ...r, likes: newLikes, is_liked: isLiked } : r)
    );
  };

  const handleFavouriteToggle = (recipeId, isFav) => {
    setRecipes(prev =>
      prev.map(r => r.id === recipeId ? { ...r, is_favourite: isFav } : r)
    );
    if (onFavouriteChanged) onFavouriteChanged();
  };

  const scrollToRecipes = () => {
    const el = document.getElementById('recipes-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const hasActiveFilters = searchTerm.trim().length > 0 || category !== 'All' || difficulty !== 'All';

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          {/* Left Hero Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span>🌿</span> CodeNova Community Recipe Portal
            </div>

            <h1 className="hero-title">
              Discover, Cook & <span>Share</span> Your Favourite Recipes
            </h1>

            <p className="hero-description">
              Welcome to RecipeHub! Explore hundreds of community-crafted culinary masterpieces,
              follow interactive step-by-step ingredient checklists, and publish your own delicious creations.
            </p>

            <div className="hero-actions">
              <button onClick={scrollToRecipes} className="btn btn-primary btn-lg">
                Explore Recipes <span>🍽️</span>
              </button>
              <Link to="/add-recipe" className="btn btn-secondary btn-lg">
                Share a Recipe <span>✍️</span>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">{recipes.length > 0 ? `${recipes.length}+` : '8+'}</span>
                <span className="stat-label">Handcrafted Dishes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Free & Community-Led</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">4.9 ★</span>
                <span className="stat-label">Home Cook Rated</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="hero-image-wrapper">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1000&q=80"
                alt="Artisanal food preparation"
                className="hero-img"
              />
            </div>
            <div className="hero-floating-card">
              <span style={{ fontSize: '2rem' }}>👨‍🍳</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-brown)' }}>
                  Fresh & Homemade
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>
                  Interactive Ingredient Lists
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Recipes Section */}
      <section id="recipes-section" className="explore-section">
        <div className="container">
          {/* Section Header */}
          <div className="explore-header">
            <span className="section-tag">Community Kitchen</span>
            <h2 className="section-title">Explore Delicious Recipes</h2>
            <p className="section-subtitle">
              Filter by dietary preferences, search by ingredients in your fridge, or discover global cuisines.
            </p>
          </div>

          {/* Filter Bar Box */}
          <div className="filter-bar-container">
            {/* Search Bar */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearchSubmit={fetchRecipes}
            />

            {/* Category and Difficulty Filters */}
            <CategoryFilter
              activeCategory={category}
              onSelectCategory={handleCategorySelect}
              activeDifficulty={difficulty}
              onSelectDifficulty={handleDifficultySelect}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Results Status Bar */}
          <div className="results-status-bar">
            <span>
              {!loading && (
                <>
                  Showing <strong>{recipes.length}</strong> {recipes.length === 1 ? 'recipe' : 'recipes'}
                  {hasActiveFilters && ' (filtered)'}
                </>
              )}
            </span>
          </div>

          {/* Loading Indicator */}
          {loading && <Loading message="Loading community recipes..." />}

          {/* Error Message */}
          {error && <ErrorMessage message={error} onRetry={fetchRecipes} />}

          {/* Recipe Grid */}
          {!loading && !error && recipes.length > 0 && (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onFavouriteToggle={handleFavouriteToggle}
                  onLikeChanged={handleLikeChanged}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && recipes.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🍳</div>
              <h3 className="empty-state-title">No Recipes Found</h3>
              <p className="empty-state-desc">
                {hasActiveFilters
                  ? "We couldn't find any recipes matching your current filters. Try resetting the filters or searching for different ingredients."
                  : "No recipes have been posted yet. Be the first to share one with the community!"}
              </p>
              {hasActiveFilters ? (
                <button onClick={handleClearFilters} className="btn btn-secondary">
                  Reset All Filters
                </button>
              ) : (
                <Link to="/add-recipe" className="btn btn-primary">
                  Share the First Recipe
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
