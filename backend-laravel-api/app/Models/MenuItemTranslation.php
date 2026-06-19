<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItemTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'menu_item_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'menu_item_id',
        'locale',
        'title',
    ];

    protected $casts = [
        'menu_item_id' => 'string',
        'id' => 'string',
    ];

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}