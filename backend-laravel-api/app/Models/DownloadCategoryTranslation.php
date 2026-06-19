<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DownloadCategoryTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'download_category_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'download_category_id',
        'locale',
        'title',
        'slug',
        'description',
    ];

    protected $casts = [
        'download_category_id' => 'string',
        'id' => 'string',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(DownloadCategory::class, 'download_category_id');
    }
}