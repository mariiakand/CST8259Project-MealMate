<?php
namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RecipeController extends Controller
{
    use AuthorizesRequests;

    //get all recipes with user, ingredients, and favorite count
    public function index()
    {
        $recipes = Recipe::with(['user', 'ingredients'])
                        ->withCount('favoritedBy')
                        ->latest()
                        ->get();

        return response()->json($recipes);
    }

    //create a new recipe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'instructions' => ['required', 'string'],
            'prep_time' => ['required', 'integer', 'min:1'],
            'cook_time' => ['required', 'integer', 'min:1'],
            'servings' => ['required', 'integer', 'min:1'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'image_url' => ['nullable', 'url'],
            'ingredients' => ['required', 'array'],
            'ingredients.*.name' => ['required', 'string'],
            'ingredients.*.quantity' => ['required', 'numeric'],
            'ingredients.*.unit' => ['required', 'string'],
        ]);

        $recipe = Recipe::create([
            //spread all validated form input (title, description, etc)
            ...$validated,
        
            //addd the id of the currently authenticated user (to link the recipe to the user)
            'user_id' => auth::id(),
        ]);

        foreach ($validated['ingredients'] as $ingredientData) {
            $ingredient = Ingredient::firstOrCreate([
                'name' => $ingredientData['name']
            ]);

            $recipe->ingredients()->attach($ingredient->id, [
                'quantity' => $ingredientData['quantity'],
                'unit' => $ingredientData['unit'],
            ]);
        }

        return response()->json($recipe->load(['ingredients', 'user']), 201);
    }

    //show a single recipe
    public function show(Recipe $recipe)
    {
        return response()->json($recipe->load(['user', 'ingredients']));
    }

    //update a recipe
    public function update(Request $request, Recipe $recipe)
    {
        $this->authorize('update', $recipe);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'instructions' => ['sometimes', 'string'],
            'prep_time' => ['sometimes', 'integer', 'min:1'],
            'cook_time' => ['sometimes', 'integer', 'min:1'],
            'servings' => ['sometimes', 'integer', 'min:1'],
            'difficulty' => ['sometimes', 'in:easy,medium,hard'],
            'image_url' => ['sometimes', 'nullable', 'url'],
            'ingredients' => ['sometimes', 'array'],
            'ingredients.*.name' => ['required_with:ingredients', 'string'],
            'ingredients.*.quantity' => ['required_with:ingredients', 'numeric'],
            'ingredients.*.unit' => ['required_with:ingredients', 'string'],
        ]);

        $recipe->update($validated);

        if (isset($validated['ingredients'])) {
            $recipe->ingredients()->detach();

            foreach ($validated['ingredients'] as $ingredientData) {
                $ingredient = Ingredient::firstOrCreate([
                    'name' => $ingredientData['name']
                ]);

                $recipe->ingredients()->attach($ingredient->id, [
                    'quantity' => $ingredientData['quantity'],
                    'unit' => $ingredientData['unit'],
                ]);
            }
        }

        return response()->json($recipe->load(['ingredients', 'user']));
    }

    //delete a recipe
    public function destroy(Recipe $recipe)
    {
        $this->authorize('delete', $recipe);
        $recipe->delete();

        return response()->json(null, 204);
        }


        //ADD FAVOURITES
}
