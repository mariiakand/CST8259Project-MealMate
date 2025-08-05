import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    Users,
    Star,
    Heart,
    Edit,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RecipeDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorited, setFavorited] = useState(false);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const response = await api.get(`/recipes/${id}`);
            setRecipe(response.data);

            if (user) {
                // Check if user has favorited this recipe
                setFavorited(
                    response.data.favorited_by?.some(fav => fav.id === user.id) || false
                );
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
            navigate('/recipes');
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async () => {
        if (!user) return;

        try {
            const response = await api.post(`/recipes/${id}/favorite`);
            setFavorited(response.data.favorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) {
            return;
        }

        try {
            await api.delete(`/recipes/${id}`);
            navigate('/recipes');
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading recipe...</div>;
    }

    if (!recipe) {
        return <div className="error">Recipe not found</div>;
    }

    const isOwner = user && recipe.user_id === user.id;

    return (
        <div className="recipe-detail">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Recipes
                </button>

                <div className="recipe-header">
                    {recipe.image_url && (
                        <div className="recipe-image-container">
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                className="recipe-detail-image"
                            />
                            {user && (
                                <button
                                    onClick={handleFavorite}
                                    className={`favorite-btn-large ${favorited ? 'favorited' : ''}`}
                                >
                                    <Heart size={24} fill={favorited ? 'currentColor' : 'none'} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="recipe-info">
                        <div className="recipe-title-section">
                            <h1>{recipe.title}</h1>
                            {isOwner && (
                                <div className="recipe-actions">
                                    <button className="btn btn-secondary btn-sm">
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-danger btn-sm"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="recipe-description">{recipe.description}</p>

                        <div className="recipe-meta-detail">
                            <div className="meta-item">
                                <Clock size={20} />
                                <div>
                                    <span className="meta-label">Total Time</span>
                                    <span className="meta-value">
                                        {recipe.prep_time + recipe.cook_time} minutes
                                    </span>
                                </div>
                            </div>

                            <div className="meta-item">
                                <Users size={20} />
                                <div>
                                    <span className="meta-label">Servings</span>
                                    <span className="meta-value">{recipe.servings}</span>
                                </div>
                            </div>

                            <div className="meta-item">
                                <span className={`difficulty-badge ${recipe.difficulty}`}>
                                    {recipe.difficulty}
                                </span>
                            </div>
                        </div>

                        <div className="recipe-author">
                            <span>Created by {recipe.user?.name}</span>
                            <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="recipe-content">
                    <div className="recipe-main">
                        <section className="recipe-section">
                            <h2>Ingredients</h2>
                            <ul className="ingredients-list-detail">
                                {recipe.ingredients?.map((ingredient, index) => (
                                    <li key={index} className="ingredient-item">
                                        <span className="ingredient-quantity">
                                            {ingredient.pivot.quantity} {ingredient.pivot.unit}
                                        </span>
                                        <span className="ingredient-name">{ingredient.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="recipe-section">
                            <h2>Instructions</h2>
                            <div className="instructions">
                                {recipe.instructions.split('\n').map((step, index) => (
                                    <p key={index} className="instruction-step">
                                        {step}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;