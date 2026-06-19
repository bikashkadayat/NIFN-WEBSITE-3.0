<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class Download extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'downloads';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'category_id',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'thumbnail_id',
        'sort_order',
        'is_active',
        'download_count',
    ];

    protected $casts = [
        'category_id' => 'string',
        'thumbnail_id' => 'string',
        'file_size' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'download_count' => 'integer',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(DownloadTranslation::class, 'download_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(DownloadCategory::class, 'category_id');
    }

    public function thumbnail(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'thumbnail_id');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getDescriptionAttribute(): ?string
    {
        return $this->translation()?->description;
    }

    public function getFileUrlAttribute(): ?string
    {
        if ($this->file_path) {
            return config('app.url') . '/storage/' . $this->file_path;
        }

        return null;
    }

    public function translation(string $locale = 'en'): ?DownloadTranslation
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