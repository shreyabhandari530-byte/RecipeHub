import React from 'react';

const CATEGORIES = [
  { id: 'All', label: 'All Recipes', icon: '🍽️' },
  { id: 'Breakfast', label: 'Breakfast', icon: '🥞' },
  { id: 'Lunch', label: 'Lunch', icon: '🥗' },
  { id: 'Dessert', label: 'Dessert', icon: '🍰' },
  { id: 'Vegan', label: 'Vegan', icon: '🌱' }
];

const DIFFICULTIES = [
  { id: 'All', label: 'Any Difficulty' },
  { id: 'Easy', label: 'Easy' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Hard', label: 'Hard' }
];

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
  activeDifficulty,
  onSelectDifficulty,
  onClearFilters,
  hasActiveFilters
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center'
      }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.92rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                boxShadow: isActive ? '0 4px 10px rgba(231, 111, 81, 0.25)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Row: Difficulty Filters & Clear Filters Button */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        paddingTop: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Difficulty:
          </span>
          {DIFFICULTIES.map((diff) => {
            const isActive = activeDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onSelectDifficulty(diff.id)}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--secondary)' : 'var(--bg-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--secondary)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {diff.label}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--danger)',
              backgroundColor: 'var(--danger-light)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(230, 57, 70, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>✕</span> Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
}
