import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CalendarPlus } from 'lucide-react';

const CreateMealPlan = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        meals: [],
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await api.get('/recipes');
                setRecipes(response.data);
            } catch (err) {
                console.error('Failed to load recipes:', err);
                setError('Failed to load recipes.');
            }
        };

        fetchRecipes();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMealChange = (index, field, value) => {
        const newMeals = [...formData.meals];
        newMeals[index] = { ...newMeals[index], [field]: value };
        setFormData({ ...formData, meals: newMeals });
    };

    const addMealField = () => {
        setFormData({
            ...formData,
            meals: [...formData.meals, { day: '', type: '', recipe_id: '' }],
        });
    };

    const removeMealField = (index) => {
        const newMeals = formData.meals.filter((_, i) => i !== index);
        setFormData({ ...formData, meals: newMeals });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Ensure dates are correctly formatted (e.g., YYYY-MM-DD)
            const payload = {
                ...formData,
                start_date: formData.start_date, // Assuming input type="date" gives correct format
                end_date: formData.end_date,
            };

            await api.post('/meal-plans', payload);
            navigate('/meal-plans');
        } catch (err) {
            console.error('Error creating meal plan:', err);
            setError(err.response?.data?.message || 'Failed to create meal plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-meal-plan-page">
            <div className="container">
                <div className="page-header">
                    <CalendarPlus size={48} />
                    <h1>Create New Meal Plan</h1>
                    <p>Plan your meals for the week or a specific period.</p>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Meal Plan Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="e.g., Weekly Family Plan"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="start_date">Start Date</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="end_date">End Date</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <h3>Meals for the Plan:</h3>

                    {formData.meals.map((meal, index) => (
                        <div key={index} className="meal-input-group">
                            <input
                                type="text"
                                placeholder="Day (e.g., Monday)"
                                value={meal.day}
                                onChange={(e) => handleMealChange(index, 'day', e.target.value)}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="Meal Type (e.g., Breakfast, Lunch, Dinner)"
                                value={meal.type}
                                onChange={(e) => handleMealChange(index, 'type', e.target.value)}
                                className="form-input"
                            />
                            <select
                                value={meal.recipe_id}
                                onChange={(e) => handleMealChange(index, 'recipe_id', e.target.value)}
                                className="form-input"
                                required
                            >
                                <option value="">Select Recipe</option>
                                {recipes.map((recipe) => (
                                    <option key={recipe.id} value={recipe.id}>
                                        {recipe.title}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => removeMealField(index)}
                                className="btn btn-danger btn-small"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addMealField} className="btn btn-secondary">
                        Add Meal
                    </button>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-full">
                        {loading ? 'Creating...' : 'Create Meal Plan'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateMealPlan;