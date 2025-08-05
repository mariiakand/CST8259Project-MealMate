import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RecipeCard = ({ recipe, onFavoriteChange }) => {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(
    recipe.favorited_by?.some(fav => fav.id === user?.id) || false
  );
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await api.post(`/recipes/${recipe.id}/favorite`);
      setFavorited(response.data.favorited);
      if (onFavoriteChange) {
        onFavoriteChange(recipe.id, response.data.favorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-card">
      <Link to={`/recipes/${recipe.id}`}>
        {recipe.image_url && (
          <img 
            src={recipe.image_url} 
            alt={recipe.title}
            className="recipe-image"
          />
        )}
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-description">{recipe.description}</p>
          
          <div className="recipe-meta">
            <div className="meta-item">
              <Clock size={16} />
              <span>{recipe.prep_time + recipe.cook_time} min</span>
            </div>
            <div className="meta-item">
              <Users size={16} />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          
          <div className="recipe-footer">
            <span className="recipe-author">By {recipe.user?.name}</span>
            <span className={`difficulty ${recipe.difficulty}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </Link>
      
      {user && (
        <button
          onClick={handleFavorite}
          disabled={loading}
          className={`favorite-btn ${favorited ? 'favorited' : ''}`}
        >
          <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      )}
    </div>
  );
};

export default RecipeCard;