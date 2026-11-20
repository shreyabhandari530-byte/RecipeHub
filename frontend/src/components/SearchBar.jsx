import React from 'react';

export default function SearchBar({ searchTerm, onSearchChange, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--border-color)',
        padding: '6px 14px 6px 18px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)'
      }}>
        {/* Search icon */}
        <span style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginRight: '10px' }}>
          🔍
        </span>

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by recipe title, ingredient (e.g. avocado, garlic), or cuisine..."
          aria-label="Search recipes"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.98rem',
            color: 'var(--text-primary)',
            backgroundColor: 'transparent'
          }}
        />

        {/* Clear button if text present */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#E5E7EB',
              color: '#4B5563',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginRight: '8px'
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}

        {/* Action Button */}
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ padding: '8px 18px' }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
