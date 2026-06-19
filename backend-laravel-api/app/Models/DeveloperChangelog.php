<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;

class DeveloperChangelog extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'developer_changelog';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'version',
        'release_date',
        'is_published',
    ];

    protected $casts = [
        'release_date' => 'date',
        'is_published' => 'boolean',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(DeveloperChangelogTranslation::class, 'changelog_id');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getBodyAttribute(): ?string
    {
        return $this->translation()?->body;
    }

    public function translation(string $locale = 'en'): ?DeveloperChangelogTranslation
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