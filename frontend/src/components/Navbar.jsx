import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar({ favouritesCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleExploreClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('/');
    // Smooth scroll down to recipes section
    setTimeout(() => {
      const exploreSection = document.getElementById('recipes-section');
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <span>🍳</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">Recipe<span>Hub</span></span>
            <span className="brand-tagline">Community Kitchen</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <a
              href="#recipes-section"
              className="nav-link"
              onClick={handleExploreClick}
            >
              Explore Recipes
            </a>
          </li>
          <li>
            <NavLink
              to="/favourites"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Favourites
              {favouritesCount > 0 && (
                <span className="nav-fav-badge">{favouritesCount}</span>
              )}
            </NavLink>
          </li>
          <li>
            <Link
              to="/add-recipe"
              className="nav-btn-add"
              onClick={closeMenu}
            >
              <span>+</span> Share Recipe
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
