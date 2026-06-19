<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class Banner extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'banners';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'image_id', 'mobile_image_id', 'button_text', 'button_url',
        'button_target', 'sort_order', 'status', 'start_date', 'end_date',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'status'     => 'boolean',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function getIsActiveAttribute(): bool { return (bool) $this->status; }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(BannerTranslation::class, 'banner_id');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function mobileImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'mobile_image_id');
    }

    public function translation(string $locale = 'en'): ?BannerTranslation
    {
        if (!$this->relationLoaded('translations')) {
            $this->load('translations');
        }
        /** @var Collection $t */
        $t = $this->translations;
        return $t->firstWhere('locale', $locale) ?? $t->first();
    }
}
