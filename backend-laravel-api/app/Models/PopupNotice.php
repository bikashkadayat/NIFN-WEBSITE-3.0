<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class PopupNotice extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'popup_notices';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'image_id',
        'type',
        'start_date',
        'end_date',
        'display_frequency',
        'button_link',
        'is_active',
    ];

    protected $casts = [
        'image_id' => 'string',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'id' => 'string',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(PopupNoticeTranslation::class, 'popup_notice_id');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->translation()?->title;
    }

    public function getBodyAttribute(): ?string
    {
        return $this->translation()?->body;
    }

    public function getButtonTextAttribute(): ?string
    {
        return $this->translation()?->button_text;
    }

    public function translation(string $locale = 'en'): ?PopupNoticeTranslation
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