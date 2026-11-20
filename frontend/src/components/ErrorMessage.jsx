import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      margin: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <p style={{ color: '#991B1B', fontWeight: 600, fontSize: '0.98rem' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{ borderColor: '#FCA5A5', color: '#991B1B' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
