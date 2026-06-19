<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TagTranslation extends Model
{
    use HasFactory;

    protected $table = 'tag_translations';

    protected $fillable = [
        'tag_id',
        'locale',
        'name',
        'slug',
    ];

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }
}
