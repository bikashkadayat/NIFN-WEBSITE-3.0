<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class Content extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'contents';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'slug', 'portal_type', 'featured_image_id',
        'is_published', 'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order'   => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ContentTranslation::class, 'content_id');
    }

    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    public function bannerImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'banner_image_id');
    }

    public function translation(string $locale = 'en'): ?ContentTranslation
    {
        if (!$this->relationLoaded('translations')) {
            $this->load('translations');
        }
        /** @var Collection $translations */
        $translations = $this->translations;
        return $translations->firstWhere('locale', $locale) ?? $translations->first();
    }

    public function getTitleAttribute(): ?string    { return $this->translation()?->title; }
    public function getBodyAttribute(): ?string     { return $this->translation()?->body; }
    public function getExcerptAttribute(): ?string  { return $this->translation()?->excerpt; }
    public function getSeoTitleAttribute(): ?string { return $this->translation()?->seo_title; }
    public function getSeoDescriptionAttribute(): ?string { return $this->translation()?->seo_description; }
    public function getSeoKeywordsAttribute(): ?string    { return $this->translation()?->seo_keywords; }
}
