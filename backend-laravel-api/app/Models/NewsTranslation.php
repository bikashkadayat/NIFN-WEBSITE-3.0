<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'news_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'news_id',
        'locale',
        'title',
        'slug',
        'excerpt',
        'body',
        'seo_title',
        'seo_description',
        'seo_keywords',
    ];

    protected $casts = [
        'news_id' => 'string',
        'id' => 'string',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class, 'news_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}