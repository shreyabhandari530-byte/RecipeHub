import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--accent-brown)',
      color: '#FDFBF7',
      padding: '48px 0 24px 0',
      marginTop: '64px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '36px',
        marginBottom: '36px'
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.8rem' }}>🍳</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Recipe<span style={{ color: 'var(--primary)' }}>Hub</span>
            </span>
          </div>
          <p style={{ color: '#D1D5DB', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
            A collaborative open-source community platform where home cooks, culinary students, and food enthusiasts discover, cook, and share authentic recipes worldwide.
          </p>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(231, 111, 81, 0.2)',
            color: '#F4A261',
            fontSize: '0.78rem',
            fontWeight: 600
          }}>
            CodeNova Full Stack Internship • Task 4
          </span>
        </div>

        {/* Explore Categories */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>
            Explore Categories
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/?category=Breakfast" style={{ color: '#D1D5DB', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                🥞 Breakfast & Brunch
              </Link>
            </li>
            <li>
              <Link to="/?category=Lunch" style={{ color: '#D1D5DB', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                🥗 Healthy Lunches
              </Link>
            </li>
            <li>
              <Link to="/?category=Dessert" style={{ color: '#D1D5DB', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                🍰 Artisanal Desserts
              </Link>
            </li>
            <li>
              <Link to="/?category=Vegan" style={{ color: '#D1D5DB', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                🌱 Plant-Based & Vegan
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/" style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>
                Home & Recipe Feed
              </Link>
            </li>
            <li>
              <Link to="/add-recipe" style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>
                Share Your Recipe
              </Link>
            </li>
            <li>
              <Link to="/favourites" style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>
                Saved Favourites
              </Link>
            </li>
          </ul>
        </div>

        {/* Culinary Tip */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>
            Chef's Kitchen Tip
          </h4>
          <p style={{
            fontStyle: 'italic',
            color: '#E5E7EB',
            fontSize: '0.88rem',
            lineHeight: '1.6',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '14px',
            borderRadius: '12px',
            borderLeft: '3px solid var(--primary)'
          }}>
            "Cooking is an art, but baking is a science. Always measure your ingredients with care and taste as you season!"
          </p>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: '#9CA3AF',
        gap: '12px'
      }}>
        <p>© {new Date().getFullYear()} RecipeHub. Built for CodeNova Full Stack Web Development Internship.</p>
        <p>Crafted with React, Express, and SQLite.</p>
      </div>
    </footer>
  );
}
