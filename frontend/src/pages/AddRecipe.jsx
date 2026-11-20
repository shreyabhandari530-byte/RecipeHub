import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createRecipe } from '../services/recipeService';
import '../styles/AddRecipe.css';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80';

export default function AddRecipe() {
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('20');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('Breakfast');
  const [cuisine, setCuisine] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Dynamic Lists
  const [ingredients, setIngredients] = useState(['', '', '']);
  const [instructions, setInstructions] = useState(['', '']);

  // UI States
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Ingredient Handlers
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length <= 1) {
      setIngredients(['']);
      return;
    }
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  // Dynamic Instruction Handlers
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstructionField = (index) => {
    if (instructions.length <= 1) {
      setInstructions(['']);
      return;
    }
    setInstructions(instructions.filter((_, idx) => idx !== index));
  };

  // Client-side Validation
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Recipe title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a short description of the dish.';
    }

    const timeNum = Number(prepTime);
    if (!prepTime || isNaN(timeNum) || timeNum <= 0) {
      newErrors.prepTime = 'Preparation time must be a positive number of minutes.';
    }

    const validIngredients = ingredients.map(i => i.trim()).filter(Boolean);
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Please provide at least one non-empty ingredient.';
    }

    const validInstructions = instructions.map(i => i.trim()).filter(Boolean);
    if (validInstructions.length === 0) {
      newErrors.instructions = 'Please provide at least one step-by-step instruction.';
    }

    if (imageUrl.trim()) {
      try {
        new URL(imageUrl.trim());
      } catch {
        newErrors.imageUrl = 'Please provide a valid image URL starting with http:// or https://.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!validate()) {
      setFormError('Please resolve the highlighted validation errors above.');
      return;
    }

    setSubmitting(true);

    const recipeData = {
      title: title.trim(),
      description: description.trim(),
      preparation_time: parseInt(prepTime, 10),
      difficulty,
      category,
      cuisine: cuisine.trim() || 'General',
      image_url: imageUrl.trim() || null,
      ingredients: ingredients.map(i => i.trim()).filter(Boolean),
      instructions: instructions.map(i => i.trim()).filter(Boolean)
    };

    try {
      const response = await createRecipe(recipeData);

      if (response.success) {
        setSuccessMsg('Recipe created successfully! Redirecting...');
        setTimeout(() => {
          navigate(`/recipes/${response.data.id}`);
        }, 1200);
      } else {
        setFormError(response.message || 'Failed to create recipe.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save recipe. Please check your backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recipe-form-page fade-in">
      <div className="container">
        <div className="recipe-form-header">
          <h1 className="recipe-form-title">Share Your Recipe</h1>
          <p className="recipe-form-subtitle">
            Contribute your culinary creation to the RecipeHub community!
          </p>
        </div>

        <div className="recipe-form-card">
          {formError && (
            <div className="alert-banner alert-error">
              <span>⚠️ {formError}</span>
              <button onClick={() => setFormError(null)}>✕</button>
            </div>
          )}

          {successMsg && (
            <div className="alert-banner alert-success">
              <span>🎉 {successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1: Overview */}
            <div className="form-section">
              <h2 className="form-section-title">
                <span>📝</span> Recipe Overview
              </h2>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="recipe-title">
                  Recipe Title <span className="required">*</span>
                </label>
                <input
                  id="recipe-title"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Grandma's Lemon Rosemary Roasted Chicken"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.title}</span>}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="recipe-desc">
                  Short Description <span className="required">*</span>
                </label>
                <textarea
                  id="recipe-desc"
                  className="form-control"
                  placeholder="Briefly describe what makes this recipe unique, its flavor profile, and why people will love it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.description}</span>}
              </div>

              {/* Prep Time, Difficulty, Category */}
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="recipe-time">
                    Prep Time (Mins) <span className="required">*</span>
                  </label>
                  <input
                    id="recipe-time"
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="25"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                  />
                  {errors.prepTime && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.prepTime}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="recipe-difficulty">
                    Difficulty <span className="required">*</span>
                  </label>
                  <select
                    id="recipe-difficulty"
                    className="form-control"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="recipe-category">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="recipe-category"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              {/* Cuisine & Image URL */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="recipe-cuisine">
                    Cuisine Type
                  </label>
                  <input
                    id="recipe-cuisine"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Italian, Mexican, Asian, Indian"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="recipe-image">
                    Image URL (Optional)
                  </label>
                  <input
                    id="recipe-image"
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/photo.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {errors.imageUrl && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.imageUrl}</span>}
                </div>
              </div>

              {/* Live Image Preview */}
              {imageUrl && (
                <div className="image-preview-box">
                  <img
                    src={imageUrl}
                    alt="Recipe preview"
                    className="image-preview-img"
                    onError={(e) => {
                      e.target.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                </div>
              )}
            </div>

            {/* Section 2: Ingredients */}
            <div className="form-section">
              <h2 className="form-section-title">
                <span>🥑</span> Ingredients List <span className="required">*</span>
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Add quantities and ingredients. Users will be able to check these off interactively.
              </p>

              {errors.ingredients && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '8px' }}>
                  {errors.ingredients}
                </div>
              )}

              {ingredients.map((ing, idx) => (
                <div key={idx} className="dynamic-item-row">
                  <span className="item-number-badge">{idx + 1}</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`e.g. 2 cups all-purpose flour`}
                    value={ing}
                    onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => removeIngredientField(idx)}
                    title="Remove ingredient"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn-add-item"
                onClick={addIngredientField}
              >
                + Add Another Ingredient
              </button>
            </div>

            {/* Section 3: Cooking Instructions */}
            <div className="form-section">
              <h2 className="form-section-title">
                <span>📋</span> Cooking Instructions <span className="required">*</span>
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Detail the step-by-step preparation and cooking process clearly.
              </p>

              {errors.instructions && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '8px' }}>
                  {errors.instructions}
                </div>
              )}

              {instructions.map((step, idx) => (
                <div key={idx} className="dynamic-item-row" style={{ alignItems: 'flex-start' }}>
                  <span className="item-number-badge" style={{ marginTop: '10px' }}>{idx + 1}</span>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder={`Step ${idx + 1}: e.g. Preheat oven to 375°F (190°C) and grease a baking pan...`}
                    value={step}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-remove-item"
                    style={{ marginTop: '6px' }}
                    onClick={() => removeInstructionField(idx)}
                    title="Remove step"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn-add-item"
                onClick={addInstructionField}
              >
                + Add Another Step
              </button>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <Link to="/" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Publishing Recipe...' : 'Publish Recipe 🚀'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
