<?php
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\IngredientController;
use Illuminate\Support\Facades\Route;

//public recipe routes
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{recipe}', [RecipeController::class, 'show']);
Route::get('/ingredients', [IngredientController::class, 'index']);
    
    //recipe routes
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy']);
    Route::post('/recipes/{recipe}/favorite', [RecipeController::class, 'favorite']);
    
    //ingredient routes
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::put('/ingredients/{ingredient}', [IngredientController::class, 'update']);
    Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy']);


//ADD AUTH AND MEAL PLANNER