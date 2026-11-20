import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import RecipeDetails from './pages/RecipeDetails';
import EditRecipe from './pages/EditRecipe';
import Favourites from './pages/Favourites';
import NotFound from './pages/NotFound';
import { getFavourites } from './services/recipeService';
import './styles/App.css';

export default function App() {
  const [favouritesCount, setFavouritesCount] = useState(0);

  const refreshFavouritesCount = async () => {
    try {
      const response = await getFavourites();
      if (response.success && Array.isArray(response.data)) {
        setFavouritesCount(response.data.length);
      }
    } catch {
      // Graceful fallback if server offline
    }
  };

  useEffect(() => {
    refreshFavouritesCount();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar favouritesCount={favouritesCount} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home onFavouriteChanged={refreshFavouritesCount} />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipes/:id" element={<RecipeDetails onFavouriteChanged={refreshFavouritesCount} />} />
            <Route path="/recipes/:id/edit" element={<EditRecipe />} />
            <Route path="/favourites" element={<Favourites onFavouriteChanged={refreshFavouritesCount} />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
