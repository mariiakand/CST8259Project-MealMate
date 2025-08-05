<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Recipe;
use App\Models\Ingredient;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::factory()->create([
            'name' => 'John Chef',
            'email' => 'john@example.com',
        ]);

        $user2 = User::factory()->create([
            'name' => 'Jane Cook',
            'email' => 'jane@example.com',
        ]);

        // Create sample ingredients
        $ingredients = [
            ['name' => 'Spaghetti', 'unit' => 'grams'],
            ['name' => 'Eggs', 'unit' => 'pieces'],
            ['name' => 'Bacon', 'unit' => 'grams'],
            ['name' => 'Parmesan Cheese', 'unit' => 'grams'],
            ['name' => 'Black Pepper', 'unit' => 'teaspoons'],
            ['name' => 'Chicken Breast', 'unit' => 'pieces'],
            ['name' => 'Olive Oil', 'unit' => 'tablespoons'],
            ['name' => 'Garlic', 'unit' => 'cloves'],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }

        $recipe1 = Recipe::create([
            'title' => 'Spaghetti Carbonara',
            'description' => 'Classic Italian pasta dish with eggs, cheese, and bacon',
            'instructions' => "1. Cook spaghetti according to package directions\n2. While pasta cooks, fry bacon until crispy\n3. Beat eggs with cheese and pepper\n4. Drain pasta and toss with bacon\n5. Remove from heat and add egg mixture\n6. Toss quickly to create creamy sauce\n7. Serve immediately",
            'prep_time' => 15,
            'cook_time' => 20,
            'servings' => 4,
            'difficulty' => 'medium',
            'user_id' => $user1->id,
        ]);

        $recipe2 = Recipe::create([
            'title' => 'Grilled Chicken Breast',
            'description' => 'Simple and healthy grilled chicken with herbs',
            'instructions' => "1. Preheat grill to medium-high heat\n2. Season chicken with salt, pepper, and herbs\n3. Brush with olive oil\n4. Grill for 6-7 minutes per side\n5. Let rest for 5 minutes before serving",
            'prep_time' => 10,
            'cook_time' => 15,
            'servings' => 2,
            'difficulty' => 'easy',
            'user_id' => $user2->id,
        ]);

        $spaghetti = Ingredient::where('name', 'Spaghetti')->first();
        $eggs = Ingredient::where('name', 'Eggs')->first();
        $bacon = Ingredient::where('name', 'Bacon')->first();
        $cheese = Ingredient::where('name', 'Parmesan Cheese')->first();
        $pepper = Ingredient::where('name', 'Black Pepper')->first();

        $recipe1->ingredients()->attach([
            $spaghetti->id => ['quantity' => 400, 'unit' => 'grams'],
            $eggs->id => ['quantity' => 3, 'unit' => 'pieces'],
            $bacon->id => ['quantity' => 150, 'unit' => 'grams'],
            $cheese->id => ['quantity' => 100, 'unit' => 'grams'],
            $pepper->id => ['quantity' => 1, 'unit' => 'teaspoon'],
        ]);

        $chicken = Ingredient::where('name', 'Chicken Breast')->first();
        $oil = Ingredient::where('name', 'Olive Oil')->first();

        $recipe2->ingredients()->attach([
            $chicken->id => ['quantity' => 2, 'unit' => 'pieces'],
            $oil->id => ['quantity' => 2, 'unit' => 'tablespoons'],
            $pepper->id => ['quantity' => 0.5, 'unit' => 'teaspoon'],
        ]);
    }
}