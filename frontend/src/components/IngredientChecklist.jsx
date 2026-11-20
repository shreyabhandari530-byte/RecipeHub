import React, { useState } from 'react';

export default function IngredientChecklist({ ingredients = [] }) {
  // Local state for checked indexes (persisted only in view state)
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSelectAll = () => {
    const allChecked = {};
    ingredients.forEach((_, idx) => {
      allChecked[idx] = true;
    });
    setCheckedItems(allChecked);
  };

  const handleReset = () => {
    setCheckedItems({});
  };

  const total = ingredients.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header & Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-brown)' }}>
            Ingredients Checklist
          </h3>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: progressPercent === 100 ? 'var(--secondary)' : 'var(--primary)',
            backgroundColor: progressPercent === 100 ? 'var(--secondary-light)' : 'var(--primary-light)',
            padding: '3px 10px',
            borderRadius: '999px'
          }}>
            {completed} of {total} ready ({progressPercent}%)
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#F3F4F6',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: progressPercent === 100 ? 'var(--secondary)' : 'var(--primary)',
            borderRadius: '999px',
            transition: 'width 0.3s ease, background-color 0.3s ease'
          }} />
        </div>

        {/* Quick controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleSelectAll}
            style={{
              fontSize: '0.75rem',
              color: 'var(--secondary)',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--secondary-light)',
              cursor: 'pointer'
            }}
          >
            ✓ Check All
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: '#F3F4F6',
              cursor: 'pointer'
            }}
          >
            ↺ Reset Checklist
          </button>
        </div>
      </div>

      {/* Checklist items */}
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ingredients.map((item, idx) => {
          const isChecked = Boolean(checkedItems[idx]);
          return (
            <li
              key={idx}
              onClick={() => toggleItem(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isChecked ? 'rgba(42, 157, 143, 0.08)' : 'var(--bg-primary)',
                border: isChecked ? '1px solid rgba(42, 157, 143, 0.3)' : '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // Handled by parent li click
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--secondary)',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: '0.95rem',
                color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: isChecked ? 'line-through' : 'none',
                fontWeight: isChecked ? 400 : 500,
                transition: 'all 0.15s ease',
                flex: 1
              }}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
