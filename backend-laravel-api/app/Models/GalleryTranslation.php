<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryTranslation extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'gallery_translations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'gallery_id',
        'locale',
        'title',
        'slug',
        'description',
    ];

    protected $casts = [
        'gallery_id' => 'string',
        'id' => 'string',
    ];

    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class, 'gallery_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}