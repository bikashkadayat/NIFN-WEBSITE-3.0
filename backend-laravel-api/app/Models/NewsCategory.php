<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;

class NewsCategory extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'news_categories';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['id', 'parent_id', 'sort_order', 'status'];

    protected $casts = ['sort_order' => 'integer', 'status' => 'boolean'];

    public function translations(): HasMany
    {
        return $this->hasMany(NewsCategoryTranslation::class, 'news_category_id');
    }

    public function news(): HasMany
    {
        return $this->hasMany(News::class, 'news_category_id');
    }

    public function translation(string $locale = 'en'): ?NewsCategoryTranslation
    {
        if (!$this->relationLoaded('translations')) $this->load('translations');
        /** @var Collection $t */
        $t = $this->translations;
        return $t->firstWhere('locale', $locale) ?? $t->first();
    }

    public function getNameAttribute(): ?string        { return $this->translation()?->title; }
    public function getTitleAttribute(): ?string       { return $this->translation()?->title; }
    public function getSlugAttribute(): ?string        { return $this->translation()?->slug; }
    public function getDescriptionAttribute(): ?string { return $this->translation()?->description; }
}
