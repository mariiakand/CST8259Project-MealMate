import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Clock, Users } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';

const Home = () => {
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedRecipes();
    }, []);

    const fetchFeaturedRecipes = async () => {
        try {
            const response = await api.get('/recipes');
            // Get first 6 recipes as featured
            setFeaturedRecipes(response.data.slice(0, 6));
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Share Your Culinary Adventures</h1>
                        <p>
                            Discover amazing recipes, plan your meals, and share your
                            favorite dishes with a community of food lovers.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/recipes" className="btn btn-primary">
                                Browse Recipes
                            </Link>
                            <Link to="/register" className="btn btn-secondary">
                                Join Community
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <ChefHat size={200} className="chef-icon" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Why Choose RecipeShare?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <TrendingUp size={48} />
                            <h3>Trending Recipes</h3>
                            <p>Discover what's popular in the cooking community</p>
                        </div>
                        <div className="feature-card">
                            <Clock size={48} />
                            <h3>Meal Planning</h3>
                            <p>Plan your weekly meals and create shopping lists</p>
                        </div>
                        <div className="feature-card">
                            <Users size={48} />
                            <h3>Community</h3>
                            <p>Connect with fellow food enthusiasts and share tips</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Recipes */}
            <section className="featured-recipes">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Recipes</h2>
                        <Link to="/recipes" className="view-all">View All Recipes</Link>
                    </div>

                    {loading ? (
                        <div className="loading">Loading recipes...</div>
                    ) : (
                        <div className="recipes-grid">
                            {featuredRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;