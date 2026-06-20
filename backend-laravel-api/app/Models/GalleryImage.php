<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryImage extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'gallery_images';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'gallery_id',
        'media_id',
        'caption_en',
        'caption_ne',
        'sort_order',
        'is_cover',
    ];

    protected $casts = [
        'gallery_id' => 'string',
        'media_id'   => 'string',
        'sort_order' => 'integer',
        'is_cover'   => 'boolean',
        'id'         => 'string',
    ];

    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class, 'gallery_id');
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    public function getUrlAttribute(): ?string
    {
        return $this->media?->url;
    }

    public function getCaptionAttribute(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();

        return match ($locale) {
            'ne' => $this->caption_ne,
            default => $this->caption_en,
        };
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}