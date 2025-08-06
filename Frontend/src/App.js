import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import MealPlans from './pages/MealPlans';
import Favorites from './pages/Favorites';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import CreateMealPlan from './pages/CreateMealPlan';
import EditRecipe from './pages/EditRecipe';
import EditMealPlan from './pages/EditMealPlan';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route 
                path="/create-recipe" 
                element={
                  <ProtectedRoute>
                    <CreateRecipe />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recipes/:id/edit" 
                element={
                  <EditRecipe />
                } 
              />
              <Route
                path="/meal-plans/:id/edit"
                element={
                  <EditMealPlan />
                }
              />
              <Route 
                path="/meal-plans" 
                element={
                  <ProtectedRoute>
                    <MealPlans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
                <Route
                path="/create-meal-plan" 
                element={                 
                  <ProtectedRoute>       
                    <CreateMealPlan />   
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
