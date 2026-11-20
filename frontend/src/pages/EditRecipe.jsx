import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById, updateRecipe } from '../services/recipeService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/AddRecipe.css';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('Breakfast');
  const [cuisine, setCuisine] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Dynamic Lists
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);

  // UI States
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch recipe data on load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await getRecipeById(id);
        if (response.success && response.data) {
          const r = response.data;
          setTitle(r.title);
          setDescription(r.description);
          setPrepTime(String(r.preparation_time));
          setDifficulty(r.difficulty);
          setCategory(r.category);
          setCuisine(r.cuisine || '');
          setImageUrl(r.image_url || '');
          setIngredients(r.ingredients && r.ingredients.length > 0 ? r.ingredients : ['']);
          setInstructions(r.instructions && r.instructions.length > 0 ? r.instructions : ['']);
        } else {
          setFetchError(response.message || 'Recipe not found.');
        }
      } catch (err) {
        setFetchError(err.message || 'Failed to load recipe data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

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

  // Client Validation
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Recipe title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a short description.';
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
      const response = await updateRecipe(id, recipeData);

      if (response.success) {
        setSuccessMsg('Recipe updated successfully! Saving changes...');
        setTimeout(() => {
          navigate(`/recipes/${id}`);
        }, 1200);
      } else {
        setFormError(response.message || 'Failed to update recipe.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to update recipe. Please verify backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <Loading message="Loading recipe details for editing..." />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <ErrorMessage message={fetchError} />
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" className="btn btn-secondary">
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-form-page fade-in">
      <div className="container">
        <div className="recipe-form-header">
          <h1 className="recipe-form-title">Edit Recipe</h1>
          <p className="recipe-form-subtitle">
            Update ingredients, instructions, and details for "{title}".
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
                <label className="form-label" htmlFor="edit-title">
                  Recipe Title <span className="required">*</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.title}</span>}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-desc">
                  Short Description <span className="required">*</span>
                </label>
                <textarea
                  id="edit-desc"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.description}</span>}
              </div>

              {/* Prep Time, Difficulty, Category */}
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-time">
                    Prep Time (Mins) <span className="required">*</span>
                  </label>
                  <input
                    id="edit-time"
                    type="number"
                    min="1"
                    className="form-control"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                  />
                  {errors.prepTime && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.prepTime}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-difficulty">
                    Difficulty <span className="required">*</span>
                  </label>
                  <select
                    id="edit-difficulty"
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
                  <label className="form-label" htmlFor="edit-category">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="edit-category"
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
                  <label className="form-label" htmlFor="edit-cuisine">
                    Cuisine Type
                  </label>
                  <input
                    id="edit-cuisine"
                    type="text"
                    className="form-control"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-image">
                    Image URL
                  </label>
                  <input
                    id="edit-image"
                    type="url"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {errors.imageUrl && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.imageUrl}</span>}
                </div>
              </div>

              {/* Image Preview */}
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
              <Link to={`/recipes/${id}`} className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Saving Changes...' : 'Save Changes ✓'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
