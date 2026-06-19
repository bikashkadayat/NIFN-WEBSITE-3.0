<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DownloadTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'download_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'download_id',
        'locale',
        'title',
        'description',
    ];

    protected $casts = [
        'download_id' => 'string',
        'id' => 'string',
    ];

    public function download(): BelongsTo
    {
        return $this->belongsTo(Download::class, 'download_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}