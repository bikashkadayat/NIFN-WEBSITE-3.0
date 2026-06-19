<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class DeveloperPage extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'developer_pages';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'slug',
        'category',
        'parent_id',
        'icon',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'parent_id' => 'string',
        'sort_order' => 'integer',
        'is_published' => 'boolean',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(DeveloperPageTranslation::class, 'page_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(DeveloperPage::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(DeveloperPage::class, 'parent_id')->orderBy('sort_order');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getBodyAttribute(): ?string
    {
        return $this->translation()?->body;
    }

    public function getExcerptAttribute(): ?string
    {
        return $this->translation()?->excerpt;
    }

    public function getSeoTitleAttribute(): ?string
    {
        return $this->translation()?->seo_title;
    }

    public function getSeoDescriptionAttribute(): ?string
    {
        return $this->translation()?->seo_description;
    }

    public function getSeoKeywordsAttribute(): ?string
    {
        return $this->translation()?->seo_keywords;
    }

    public function translation(string $locale = 'en'): ?DeveloperPageTranslation
    {
        if (! $this->relationLoaded('translations')) {
            $this->load('translations');
        }

        /** @var Collection $translations */
        $translations = $this->translations;

        return $translations->firstWhere('locale', $locale)
            ?? $translations->first();
    }
}