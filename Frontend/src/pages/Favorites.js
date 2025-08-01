import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await api.get('/user');
            // Assuming the user object includes favorites
            const userResponse = await api.get('/recipes');
            const allRecipes = userResponse.data;

            // Filter recipes that are favorited by the user
            // This is a simplified approach - in a real app, you'd have a dedicated favorites endpoint
            const favoriteRecipes = allRecipes.filter(recipe =>
                recipe.favorited_by?.some(user => user.id === response.data.id)
            );

            setFavorites(favoriteRecipes);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteChange = (recipeId, favorited) => {
        if (!favorited) {
            // Remove from favorites list
            setFavorites(favorites.filter(recipe => recipe.id !== recipeId));
        }
    };

    if (loading) {
        return <div className="loading">Loading your favorites...</div>;
    }

    return (
        <div className="favorites-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Favorite Recipes</h1>
                    <p>Your saved recipes for quick access</p>
                </div>

                {favorites.length > 0 ? (
                    <div className="recipes-grid">
                        {favorites.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onFavoriteChange={handleFavoriteChange}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Heart size={64} />
                        <h2>No favorites yet</h2>
                        <p>Start exploring recipes and add your favorites here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;