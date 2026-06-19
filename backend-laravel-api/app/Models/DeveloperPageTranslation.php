<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeveloperPageTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'developer_page_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'page_id',
        'locale',
        'title',
        'body',
        'excerpt',
        'seo_title',
        'seo_description',
        'seo_keywords',
    ];

    protected $casts = [
        'page_id' => 'string',
        'id' => 'string',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(DeveloperPage::class, 'page_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}