<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;

class DownloadCategory extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'download_categories';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(DownloadCategoryTranslation::class, 'download_category_id');
    }

    public function downloads(): HasMany
    {
        return $this->hasMany(Download::class, 'download_category_id');
    }

    public function getNameAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getSlugAttribute(): ?string
    {
        return $this->translation()?->slug;
    }

    public function translation(string $locale = 'en'): ?DownloadCategoryTranslation
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