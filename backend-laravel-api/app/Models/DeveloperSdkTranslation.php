<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeveloperSdkTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'developer_sdk_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'sdk_id',
        'locale',
        'title',
        'description',
        'installation_code',
        'usage_code',
    ];

    protected $casts = [
        'sdk_id' => 'string',
        'id' => 'string',
    ];

    public function sdk(): BelongsTo
    {
        return $this->belongsTo(DeveloperSdk::class, 'sdk_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}