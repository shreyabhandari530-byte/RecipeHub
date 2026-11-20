import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import { addFavourite, removeFavourite } from '../services/recipeService';
import '../styles/RecipeCard.css';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80';

export default function RecipeCard({
  recipe,
  onFavouriteToggle,
  onLikeChanged
}) {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(Boolean(recipe.is_favourite));
  const [favLoading, setFavLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(recipe.image_url || DEFAULT_IMAGE);

  const handleCardClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleToggleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (favLoading) return;

    const nextState = !isFavourite;
    setIsFavourite(nextState);
    setFavLoading(true);

    try {
      if (nextState) {
        await addFavourite(recipe.id);
      } else {
        await removeFavourite(recipe.id);
      }
      if (onFavouriteToggle) {
        onFavouriteToggle(recipe.id, nextState);
      }
    } catch (err) {
      console.error('Failed to update favourite:', err);
      // Revert state
      setIsFavourite(!nextState);
    } finally {
      setFavLoading(false);
    }
  };

  const getCategoryClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'breakfast': return 'badge-breakfast';
      case 'lunch': return 'badge-lunch';
      case 'dessert': return 'badge-dessert';
      case 'vegan': return 'badge-vegan';
      default: return 'badge-breakfast';
    }
  };

  const getDifficultyClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return 'badge-easy';
    }
  };

  return (
    <article className="recipe-card" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Media & Badges */}
      <div className="card-media">
        <img
          src={imgSrc}
          alt={recipe.title}
          className="card-img"
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />
        <div className="card-badges">
          <span className={`badge ${getCategoryClass(recipe.category)}`}>
            {recipe.category}
          </span>
          <span className={`badge ${getDifficultyClass(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Favourite Button */}
        <button
          className={`card-fav-btn ${isFavourite ? 'active' : ''}`}
          onClick={handleToggleFavourite}
          disabled={favLoading}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFavourite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-meta">
          <span className="card-meta-item">
            ⏱️ {recipe.preparation_time} mins
          </span>
          {recipe.cuisine && (
            <span className="card-meta-item">
              🌐 {recipe.cuisine}
            </span>
          )}
        </div>

        <h3 className="card-title">{recipe.title}</h3>
        <p className="card-description">{recipe.description}</p>

        {/* Footer Actions */}
        <div className="card-footer" onClick={(e) => e.stopPropagation()}>
          <LikeButton
            recipeId={recipe.id}
            initialLikes={recipe.likes || 0}
            initialIsLiked={recipe.is_liked}
            onLikeChanged={onLikeChanged}
          />

          <Link
            to={`/recipes/${recipe.id}`}
            className="card-btn-view"
            onClick={(e) => e.stopPropagation()}
          >
            View Recipe <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
