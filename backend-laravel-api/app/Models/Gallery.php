<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class Gallery extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'galleries';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'cover_image_id',
        'is_published',
        'sort_order',
        'event_date',
    ];

    protected $casts = [
        'cover_image_id' => 'string',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'event_date' => 'date',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(GalleryTranslation::class, 'gallery_id');
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(GalleryImage::class, 'gallery_id')->orderBy('sort_order');
    }

    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'cover_image_id');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getSlugAttribute(): ?string
    {
        return $this->translation()?->slug;
    }

    public function getDescriptionAttribute(): ?string
    {
        return $this->translation()?->description;
    }

    public function translation(string $locale = 'en'): ?GalleryTranslation
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