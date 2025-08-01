import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';

const MealPlans = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        try {
            const response = await api.get('/meal-plans');
            setMealPlans(response.data);
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meal plan?')) {
            return;
        }

        try {
            await api.delete(`/meal-plans/${id}`);
            setMealPlans(mealPlans.filter(plan => plan.id !== id));
        } catch (error) {
            console.error('Error deleting meal plan:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading your meal plans...</div>;
    }

    return (
        <div className="meal-plans-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Meal Plans</h1>
                    <p>Organize your weekly meals and stay on track</p>
                </div>

                <div className="meal-plans-actions">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        Create New Meal Plan
                    </button>
                </div>

                {mealPlans.length > 0 ? (
                    <div className="meal-plans-list">
                        {mealPlans.map(plan => (
                            <div key={plan.id} className="meal-plan-card">
                                <div className="meal-plan-header">
                                    <div>
                                        <h3 className="meal-plan-title">{plan.name}</h3>
                                        <p className="meal-plan-dates">
                                            {new Date(plan.start_date).toLocaleDateString()} - {' '}
                                            {new Date(plan.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="meal-plan-actions">
                                        <button className="btn btn-secondary btn-sm">
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="meal-plan-content">
                                    <p>Meal plan details would be displayed here...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Calendar size={64} />
                        <h2>No meal plans yet</h2>
                        <p>Create your first meal plan to get organized!</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="btn btn-primary"
                        >
                            <Plus size={20} />
                            Create Meal Plan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlans;