import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getFavourites } from '../services/recipeService';

export default function Favourites({ onFavouriteChanged }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavourites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFavourites();
      if (response.success) {
        setFavourites(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch favourites.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load saved favourites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleFavouriteToggle = (recipeId, isFav) => {
    if (!isFav) {
      // If removed, filter out from the active favourites page list immediately
      setFavourites(prev => prev.filter(r => r.id !== recipeId));
    }
    if (onFavouriteChanged) onFavouriteChanged();
  };

  const handleLikeChanged = (recipeId, newLikes, isLiked) => {
    setFavourites(prev =>
      prev.map(r => r.id === recipeId ? { ...r, likes: newLikes, is_liked: isLiked } : r)
    );
  };

  return (
    <div className="container fade-in" style={{ padding: '48px 24px 64px 24px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-lunch" style={{ marginBottom: '12px' }}>
          ❤️ Saved Collection
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-brown)', marginBottom: '8px' }}>
          My Favourite Recipes
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto' }}>
          Your personal cookbook of saved recipes. Easily accessible whenever you are ready to prepare your next meal.
        </p>
      </div>

      {/* Loading */}
      {loading && <Loading message="Loading your favourite recipes..." />}

      {/* Error */}
      {error && <ErrorMessage message={error} onRetry={fetchFavourites} />}

      {/* Grid of favourites */}
      {!loading && !error && favourites.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem'
          }}>
            <span>You have <strong>{favourites.length}</strong> saved {favourites.length === 1 ? 'recipe' : 'recipes'}</span>
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              + Discover more recipes
            </Link>
          </div>

          <div className="recipes-grid">
            {favourites.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onFavouriteToggle={handleFavouriteToggle}
                onLikeChanged={handleLikeChanged}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && favourites.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h3 className="empty-state-title">No Favourites Saved Yet</h3>
          <p className="empty-state-desc">
            You haven't added any recipes to your favourites yet. Click the heart icon on any recipe card to save it here!
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Explore Community Recipes 🍽️
          </Link>
        </div>
      )}
    </div>
  );
}
