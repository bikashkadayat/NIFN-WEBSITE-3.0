<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'content_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'content_id',
        'locale',
        'title',
        'body',
        'excerpt',
        'seo_title',
        'seo_description',
        'seo_keywords',
    ];

    protected $casts = [
        'content_id' => 'string',
        'id' => 'string',
    ];

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class, 'content_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}