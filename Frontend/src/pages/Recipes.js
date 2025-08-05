import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const navigate = useNavigate();


  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterAndSortRecipes();
  }, [recipes, searchTerm, difficultyFilter, sortBy]);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRecipes = () => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'time':
          return (a.prep_time + a.cook_time) - (b.prep_time + b.cook_time);
        default:
          return 0;
      }
    });

    setFilteredRecipes(filtered);
  };

  const handleFavoriteChange = (recipeId, favorited) => {
    // Update the local state if needed
    console.log(`Recipe ${recipeId} favorited: ${favorited}`);
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="recipes-page">
      <div className="container">
        <div className="page-header">
          <h1>All Recipes</h1>
          <p>Discover delicious recipes from our community</p>
        </div>

        {/* Filters and Search */}
        <div className="recipes-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="latest">Latest</option>
                <option value="time">Quickest</option>
              </select>
            </div>

            <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '8px' 
      }}
    >
      {/* add a recipe */}
      <button
        onClick={() => navigate('/create-recipe')}
        className="btn btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        aria-label="Create new recipe"
      >
        <Plus size={20} />
      </button>
    </div>
          </div>
        </div>

        {/* Results */}
        <div className="recipes-results">
          <p className="results-count">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>

          {filteredRecipes.length > 0 ? (
            <div className="recipes-grid">
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No recipes found matching your criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;