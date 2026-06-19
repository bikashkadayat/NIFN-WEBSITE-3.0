<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'menus';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'location',
    ];

    protected $casts = [
        'id' => 'string',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'menu_id')
            ->whereNull('parent_id')
            ->orderBy('sort_order');
    }

    public function allItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'menu_id')->orderBy('sort_order');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}