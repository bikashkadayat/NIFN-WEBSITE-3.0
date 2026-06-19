<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;

class DeveloperSdk extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'developer_sdks';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'language',
        'package_name',
        'status',
        'maintainer',
        'license',
        'runtime',
        'documentation_url',
        'github_url',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_published' => 'boolean',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(DeveloperSdkTranslation::class, 'sdk_id');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getDescriptionAttribute(): ?string
    {
        return $this->translation()?->description;
    }

    public function getInstallationCodeAttribute(): ?string
    {
        return $this->translation()?->installation_code;
    }

    public function getUsageCodeAttribute(): ?string
    {
        return $this->translation()?->usage_code;
    }

    public function translation(string $locale = 'en'): ?DeveloperSdkTranslation
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