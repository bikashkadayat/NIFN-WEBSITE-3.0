<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsCategoryTranslation extends Model
{
    use HasFactory;

    protected $table = 'news_category_translations';
    public $timestamps = false;

    protected $fillable = ['news_category_id', 'locale', 'title', 'slug', 'description'];

    public function newsCategory(): BelongsTo
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }
}
