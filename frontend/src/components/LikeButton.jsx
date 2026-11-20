import React, { useState } from 'react';
import { likeRecipe, unlikeRecipe } from '../services/recipeService';

export default function LikeButton({ recipeId, initialLikes = 0, initialIsLiked = false, onLikeChanged }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Optimistic Update
    const prevLikes = likes;
    const prevIsLiked = isLiked;

    const nextIsLiked = !prevIsLiked;
    const nextLikes = nextIsLiked ? prevLikes + 1 : Math.max(0, prevLikes - 1);

    setLikes(nextLikes);
    setIsLiked(nextIsLiked);
    setIsLoading(true);

    try {
      if (nextIsLiked) {
        const response = await likeRecipe(recipeId);
        if (response.likes !== undefined) {
          setLikes(response.likes);
        }
      } else {
        const response = await unlikeRecipe(recipeId);
        if (response.likes !== undefined) {
          setLikes(response.likes);
        }
      }
      if (onLikeChanged) {
        onLikeChanged(recipeId, nextLikes, nextIsLiked);
      }
    } catch (error) {
      console.error('Like toggle failed:', error);
      // Revert optimistic update
      setLikes(prevLikes);
      setIsLiked(prevIsLiked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      title={isLiked ? 'Unlike this recipe' : 'Like this recipe'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: 600,
        backgroundColor: isLiked ? 'var(--primary-light)' : '#F3F4F6',
        color: isLiked ? 'var(--primary)' : 'var(--text-secondary)',
        border: isLiked ? '1px solid rgba(231, 111, 81, 0.3)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isLiked ? 'scale(1.02)' : 'none'
      }}
    >
      <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{likes}</span>
    </button>
  );
}
