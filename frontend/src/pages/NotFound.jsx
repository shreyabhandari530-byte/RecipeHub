import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container fade-in" style={{
      textAlign: 'center',
      padding: '80px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🍳</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-brown)', marginBottom: '12px' }}>
        404 - Recipe Not Found
      </h1>
      <p style={{
        fontSize: '1.15rem',
        color: 'var(--text-secondary)',
        maxWidth: '480px',
        lineHeight: '1.6',
        marginBottom: '28px'
      }}>
        Looks like this recipe burnt to a crisp or the page has moved out of the kitchen!
      </p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/" className="btn btn-primary btn-lg">
          ← Back to Recipe Feed
        </Link>
        <Link to="/add-recipe" className="btn btn-secondary btn-lg">
          Add a Recipe ✍️
        </Link>
      </div>
    </div>
  );
}
