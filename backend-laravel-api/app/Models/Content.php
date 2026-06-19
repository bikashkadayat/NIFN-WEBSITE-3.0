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
        'id', 'slug', 'portal_type', 'featured_image_id', 'banner_image_id',
        'status', 'sort_order', 'is_featured', 'parent_id',
        'show_image_on_detail', 'display_children_as_paginated', 'layout',
        'published_at', 'view_count',
    ];

    protected $casts = [
        'sort_order'   => 'integer',
        'is_featured'  => 'boolean',
        'show_image_on_detail' => 'boolean',
        'display_children_as_paginated' => 'boolean',
        'published_at' => 'datetime',
        'view_count'   => 'integer',
    ];

    // Virtual accessor so controllers using is_published still work
    public function getIsPublishedAttribute(): bool
    {
        return $this->status === 'published';
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
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
