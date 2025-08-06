import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CalendarPlus } from 'lucide-react';

const EditMealPlan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        meals: [],
    });

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mealPlanRes = await api.get(`/meal-plans/${id}`);
                const recipesRes = await api.get('/recipes');

                setFormData({
                    name: mealPlanRes.data.name,
                    start_date: formatDate(mealPlanRes.data.start_date),
                    end_date: formatDate(mealPlanRes.data.end_date),
                    meals: mealPlanRes.data.meals.map((meal) => ({
                        day: meal.day,
                        type: meal.type,
                        recipe_id: meal.recipe_id,
                    })),
                });

                setRecipes(recipesRes.data);
            } catch (err) {
                console.error('Error loading meal plan or recipes:', err);
                setError('Failed to load meal plan.');
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMealChange = (index, field, value) => {
        const updatedMeals = [...formData.meals];
        updatedMeals[index] = { ...updatedMeals[index], [field]: value };
        setFormData({ ...formData, meals: updatedMeals });
    };

    const addMealField = () => {
        setFormData({
            ...formData,
            meals: [...formData.meals, { day: '', type: '', recipe_id: '' }],
        });
    };

    const removeMealField = (index) => {
        const updatedMeals = formData.meals.filter((_, i) => i !== index);
        setFormData({ ...formData, meals: updatedMeals });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.put(`/meal-plans/${id}`, formData);
            navigate('/meal-plans');
        } catch (err) {
            console.error('Error updating meal plan:', err);
            setError(err.response?.data?.message || 'Failed to update meal plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-meal-plan-page">
            <div className="container">
                <div className="page-header">
                    <CalendarPlus size={48} />
                    <h1>Edit Meal Plan</h1>
                    <p>Update your meal plan details and meals.</p>
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

                    <h3>Meals:</h3>

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
                                placeholder="Meal Type (e.g., Breakfast)"
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
                        {loading ? 'Updating...' : 'Update Meal Plan'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditMealPlan;
