<?php
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\IngredientController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MealPlanController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//public routes
Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']);

//public recipe routes
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{recipe}', [RecipeController::class, 'show']);
Route::get('/ingredients', [IngredientController::class, 'index']);

// protected routes
Route::middleware('auth:sanctum')->group(function () {
    //auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    //recipe routes
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy']);
    Route::post('/recipes/{recipe}/favorite', [RecipeController::class, 'favorite']);
    
    //ingredient routes
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::put('/ingredients/{ingredient}', [IngredientController::class, 'update']);
    Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy']);

    //meal plan routes
    Route::apiResource('meal-plans', MealPlanController::class);
});