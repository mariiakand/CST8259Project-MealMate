<?php
namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    //get a list of all ingredients
    public function index()
    {
        return response()->json(Ingredient::all());
    }

    //create a new ingredient
    public function store(Request $request)
    {
        //validate the incoming data
        $validated = $request->validate([
            'name' => ['required', 'string', 'unique:ingredients'],
            'unit' => ['required', 'string'],
        ]);

        //save the new ingredient to the database
        $ingredient = Ingredient::create($validated);

        //return the created ingredient with a created status
        return response()->json($ingredient, 201);
    }

    //show a single ingredient by id
    public function show(Ingredient $ingredient)
    {
        return response()->json($ingredient);
    }

    //update an existing ingredient
    public function update(Request $request, Ingredient $ingredient)
    {
        //validate the data. allow partial updates
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'unique:ingredients,name,' . $ingredient->id],
            'unit' => ['sometimes', 'string'],
        ]);

        //update the ingredient in the database
        $ingredient->update($validated);

        return response()->json($ingredient);
    }

    //delete an ingredient
    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();
        
        //return no content response
        return response()->json(null, 204);
    }
}
