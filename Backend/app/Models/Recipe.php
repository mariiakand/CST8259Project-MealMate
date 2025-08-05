<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Ingredient;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'instructions',
        'prep_time',
        'cook_time',
        'servings',
        'difficulty',
        'image_url',
        'user_id',
    ];

    //user who created this recipe
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    //the ingredients belonging to this recipe
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
                    ->withPivot('quantity', 'unit')
                    ->withTimestamps();
    }

    //users who favorited this recipe
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }
}
