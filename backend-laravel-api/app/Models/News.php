<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Collection;

class News extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'news';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'news_category_id', 'featured_image_id', 'banner_image_id',
        'status', 'is_featured', 'is_breaking', 'published_at', 'scheduled_at', 'view_count',
    ];

    protected $casts = [
        'is_featured'  => 'boolean',
        'is_breaking'  => 'boolean',
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'view_count'   => 'integer',
    ];

    public function getIsPublishedAttribute(): bool { return $this->status === 'published'; }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function translations(): HasMany
    {
        return $this->hasMany(NewsTranslation::class, 'news_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }

    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'news_tags', 'news_id', 'tag_id');
    }

    public function translation(string $locale = 'en'): ?NewsTranslation
    {
        if (!$this->relationLoaded('translations')) {
            $this->load('translations');
        }
        /** @var Collection $t */
        $t = $this->translations;
        return $t->firstWhere('locale', $locale) ?? $t->first();
    }

    public function getTitleAttribute(): ?string   { return $this->translation()?->title; }
    public function getExcerptAttribute(): ?string { return $this->translation()?->excerpt; }
    public function getBodyAttribute(): ?string    { return $this->translation()?->body; }
}
