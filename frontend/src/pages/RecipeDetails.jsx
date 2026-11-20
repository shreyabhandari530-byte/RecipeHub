import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import IngredientChecklist from '../components/IngredientChecklist';
import LikeButton from '../components/LikeButton';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getRecipeById, deleteRecipe, addFavourite, removeFavourite } from '../services/recipeService';
import '../styles/RecipeDetails.css';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80';

export default function RecipeDetails({ onFavouriteChanged }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Completed steps tracking (visual only in UI)
  const [completedSteps, setCompletedSteps] = useState({});

  // Favourites state
  const [isFavourite, setIsFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Delete modal confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecipeById(id);
      if (response.success && response.data) {
        setRecipe(response.data);
        setIsFavourite(Boolean(response.data.is_favourite));
      } else {
        setError(response.message || 'Recipe not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load recipe details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const toggleStep = (stepIdx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }));
  };

  const handleToggleFavourite = async () => {
    if (favLoading || !recipe) return;

    const nextState = !isFavourite;
    setIsFavourite(nextState);
    setFavLoading(true);

    try {
      if (nextState) {
        await addFavourite(recipe.id);
      } else {
        await removeFavourite(recipe.id);
      }
      if (onFavouriteChanged) onFavouriteChanged();
    } catch (err) {
      console.error('Favourite toggle failed:', err);
      setIsFavourite(!nextState);
    } finally {
      setFavLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await deleteRecipe(recipe.id);
      if (response.success) {
        if (onFavouriteChanged) onFavouriteChanged();
        navigate('/');
      } else {
        alert(response.message || 'Failed to delete recipe.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete recipe.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <Loading message="Gathering recipe ingredients and instructions..." />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <ErrorMessage
          message={error || 'Recipe not found.'}
          onRetry={fetchRecipe}
        />
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" className="btn btn-secondary">
            ← Back to All Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page fade-in">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="details-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/?category=${recipe.category}`}>{recipe.category}</Link>
          <span>/</span>
          <span>{recipe.title}</span>
        </div>

        {/* Recipe Header Card */}
        <div className="details-header-card">
          {/* Banner Media */}
          <div className="details-hero-banner">
            <img
              src={recipe.image_url || DEFAULT_FALLBACK_IMAGE}
              alt={recipe.title}
              className="details-hero-img"
              onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
            />
            <div className="details-banner-overlay">
              <div className="details-banner-content">
                <div className="details-badges-row" style={{ marginBottom: '10px' }}>
                  <span className={`badge badge-${recipe.category.toLowerCase()}`}>
                    {recipe.category}
                  </span>
                  <span className={`badge badge-${recipe.difficulty.toLowerCase()}`}>
                    {recipe.difficulty}
                  </span>
                  {recipe.cuisine && (
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--text-primary)' }}>
                      🌐 {recipe.cuisine}
                    </span>
                  )}
                </div>
                <h1 className="details-title-white">{recipe.title}</h1>
              </div>
            </div>
          </div>

          {/* Quick Summary Bar */}
          <div className="details-summary-bar">
            <div className="summary-meta-group">
              <div className="summary-meta-item">
                <span className="meta-icon">⏱️</span>
                <span>Prep Time: <strong>{recipe.preparation_time} mins</strong></span>
              </div>
              <div className="summary-meta-item">
                <span className="meta-icon">📊</span>
                <span>Level: <strong>{recipe.difficulty}</strong></span>
              </div>
              <div className="summary-meta-item">
                <span className="meta-icon">🥗</span>
                <span>Category: <strong>{recipe.category}</strong></span>
              </div>
            </div>

            {/* Actions: Likes, Favourites, Edit, Delete */}
            <div className="details-action-group">
              <LikeButton
                recipeId={recipe.id}
                initialLikes={recipe.likes || 0}
                initialIsLiked={recipe.is_liked}
              />

              <button
                onClick={handleToggleFavourite}
                disabled={favLoading}
                className="btn btn-secondary btn-sm"
                title={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
                style={{
                  color: isFavourite ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: isFavourite ? 'rgba(231, 111, 81, 0.4)' : 'var(--border-color)',
                  backgroundColor: isFavourite ? 'var(--primary-light)' : '#FFFFFF'
                }}
              >
                <span>{isFavourite ? '❤️ Saved' : '🤍 Favourite'}</span>
              </button>

              <Link
                to={`/recipes/${recipe.id}/edit`}
                className="btn btn-secondary btn-sm"
                title="Edit this recipe"
              >
                ✏️ Edit
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger btn-sm"
                title="Delete this recipe"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Recipe Description */}
          <div className="details-description-box">
            <p className="details-description-text">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Main Grid: Interactive Ingredients Checklist + Cooking Instructions */}
        <div className="recipe-main-grid">
          {/* Left Column: Interactive Ingredient Checklist */}
          <div className="ingredients-column">
            <IngredientChecklist ingredients={recipe.ingredients || []} />
          </div>

          {/* Right Column: Cooking Instructions */}
          <div className="instructions-column">
            <div className="instructions-card">
              <div className="instructions-header">
                <h3 className="instructions-title">Step-by-Step Instructions</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Click step to mark completed
                </span>
              </div>

              <div className="instructions-list">
                {(recipe.instructions || []).map((step, idx) => {
                  const isDone = Boolean(completedSteps[idx]);
                  return (
                    <div
                      key={idx}
                      className={`instruction-step ${isDone ? 'completed' : ''}`}
                      onClick={() => toggleStep(idx)}
                    >
                      <div className="step-num-circle">
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <p className="step-text">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Delete Recipe?</h3>
            <p className="modal-message">
              Are you sure you want to delete <strong>"{recipe.title}"</strong>? This will permanently remove the recipe, along with all associated likes and favourites from the database.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
