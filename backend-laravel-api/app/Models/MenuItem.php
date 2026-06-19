<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class MenuItem extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'menu_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'menu_id',
        'parent_id',
        'url',
        'target',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'menu_id' => 'string',
        'parent_id' => 'string',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(MenuItemTranslation::class, 'menu_item_id');
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('sort_order');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function translation(string $locale = 'en'): ?MenuItemTranslation
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