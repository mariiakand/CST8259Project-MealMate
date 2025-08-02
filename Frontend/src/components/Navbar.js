import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  Calendar, 
  Heart, 
  LogIn, 
  LogOut, 
  UserPlus 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <BookOpen size={24} />
          RecipeShare
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <Home size={18} />
            Home
          </Link>
          <Link to="/recipes" className="nav-link">
            <BookOpen size={18} />
            Recipes
          </Link>
          
          {user ? (
            <>
              <Link to="/create-recipe" className="nav-link">
                <PlusCircle size={18} />
                Create Recipe
              </Link>
              <Link to="/meal-plans" className="nav-link">
                <Calendar size={18} />
                Meal Plans
              </Link>
              <Link to="/create-meal-plan" className="nav-link">
               <Calendar size={18} />
               Create Meal Plan
              </Link>
              <Link to="/favorites" className="nav-link">
                <Heart size={18} />
                Favorites
              </Link>
              <button onClick={handleLogout} className="nav-link nav-button">
                <LogOut size={18} />
                Logout
              </button>
              <span className="nav-user">Hello, {user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className="nav-link">
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;