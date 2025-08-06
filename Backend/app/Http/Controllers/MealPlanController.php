<?php
namespace App\Http\Controllers;

use App\Models\MealPlan;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class MealPlanController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $mealPlans = auth::user()->mealPlans()->latest()->get();
        
        return response()->json($mealPlans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'meals' => ['required', 'array'],
        ]);

        $mealPlan = MealPlan::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return response()->json($mealPlan, 201);
    }

    public function show(MealPlan $mealPlan)
    {
        return response()->json($mealPlan);
    }

    public function update(Request $request, MealPlan $mealPlan)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'meals' => ['sometimes', 'array'],
        ]);

        $mealPlan->update($validated);

        return response()->json($mealPlan);
    }

    public function destroy(MealPlan $mealPlan)
    {
        $this->authorize('delete', $mealPlan);
        
        $mealPlan->delete();
        
        return response()->json(null, 204);
    }
}