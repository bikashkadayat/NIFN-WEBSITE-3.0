<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BannerTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'banner_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'banner_id',
        'locale',
        'title',
        'subtitle',
        'primary_button_text',
        'secondary_button_text',
    ];

    protected $casts = [
        'banner_id' => 'string',
        'id' => 'string',
    ];

    public function banner(): BelongsTo
    {
        return $this->belongsTo(Banner::class, 'banner_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}