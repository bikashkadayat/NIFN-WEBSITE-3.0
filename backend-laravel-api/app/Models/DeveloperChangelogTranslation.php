<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeveloperChangelogTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'developer_changelog_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'changelog_id',
        'locale',
        'title',
        'body',
    ];

    protected $casts = [
        'changelog_id' => 'string',
        'id' => 'string',
    ];

    public function changelog(): BelongsTo
    {
        return $this->belongsTo(DeveloperChangelog::class, 'changelog_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}