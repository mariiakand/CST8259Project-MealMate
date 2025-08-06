import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, Save } from 'lucide-react';
import api from '../services/api';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructions: '',
        prep_time: '',
        cook_time: '',
        servings: '',
        difficulty: 'medium',
        image_url: '',
    });

    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                const recipe = response.data;

                setFormData({
                    title: recipe.title,
                    description: recipe.description,
                    instructions: recipe.instructions,
                    prep_time: recipe.prep_time,
                    cook_time: recipe.cook_time,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                    image_url: recipe.image_url || '',
                });

                setIngredients(
                    recipe.ingredients.map(ing => ({
                        name: ing.name,
                        quantity: ing.pivot.quantity,
                        unit: ing.pivot.unit,
                    }))
                );
            } catch (err) {
                console.error('Failed to load recipe:', err);
                setError('Could not load recipe');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        const validIngredients = ingredients.filter(ing => ing.name && ing.quantity && ing.unit);

        if (validIngredients.length === 0) {
            setError('Please add at least one complete ingredient');
            setSaving(false);
            return;
        }

        try {
            const updatedRecipe = {
                ...formData,
                prep_time: parseInt(formData.prep_time),
                cook_time: parseInt(formData.cook_time),
                servings: parseInt(formData.servings),
                ingredients: validIngredients.map(ing => ({
                    ...ing,
                    quantity: parseFloat(ing.quantity)
                })),
            };

            await api.put(`/recipes/${id}`, updatedRecipe);
            navigate(`/recipes/${id}`);
        } catch (err) {
            console.error('Update failed:', err);
            setError(err.response?.data?.message || 'Failed to update recipe');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="create-recipe-page">
            <div className="container">
                <div className="page-header">
                    <h1>Edit Recipe</h1>
                    <p>Make changes to your recipe below</p>
                </div>

                <form onSubmit={handleSubmit} className="recipe-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="title">Recipe Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image_url">Image URL</label>
                                <input
                                    type="url"
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group form-group-full">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Recipe Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="prep_time">Prep Time *</label>
                                <input
                                    type="number"
                                    id="prep_time"
                                    name="prep_time"
                                    value={formData.prep_time}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cook_time">Cook Time *</label>
                                <input
                                    type="number"
                                    id="cook_time"
                                    name="cook_time"
                                    value={formData.cook_time}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="servings">Servings *</label>
                                <input
                                    type="number"
                                    id="servings"
                                    name="servings"
                                    value={formData.servings}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty *</label>
                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <h2>Ingredients</h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="btn btn-secondary btn-sm"
                            >
                                <Plus size={16} />
                                Add Ingredient
                            </button>
                        </div>

                        <div className="ingredients-list">
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="ingredient-row">
                                    <input
                                        type="text"
                                        placeholder="Ingredient name"
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                        className="form-input ingredient-name"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={ingredient.quantity}
                                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        className="form-input ingredient-quantity"
                                        step="0.1"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Unit"
                                        value={ingredient.unit}
                                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        className="form-input ingredient-unit"
                                    />
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="btn-remove"
                                        >
                                            <Minus size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Instructions</h2>
                        <div className="form-group">
                            <label htmlFor="instructions">Cooking Instructions *</label>
                            <textarea
                                id="instructions"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleInputChange}
                                required
                                className="form-textarea"
                                rows="8"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary btn-lg"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipe;