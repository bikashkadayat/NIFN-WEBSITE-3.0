<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PopupNoticeTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'popup_notice_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'popup_notice_id',
        'locale',
        'title',
        'body',
        'button_text',
    ];

    protected $casts = [
        'popup_notice_id' => 'string',
        'id' => 'string',
    ];

    public function popupNotice(): BelongsTo
    {
        return $this->belongsTo(PopupNotice::class, 'popup_notice_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}