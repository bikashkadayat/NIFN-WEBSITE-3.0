<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'media';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'original_name',
        'file_path',
        'mime_type',
        'disk',
        'original_width',
        'original_height',
        'file_size',
        'alt_text',
    ];

    protected $casts = [
        'original_width' => 'integer',
        'original_height' => 'integer',
        'file_size' => 'integer',
        'id' => 'string',
    ];

    public function getUrlAttribute(): string
    {
        return config('app.url') . '/storage/' . $this->file_path;
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}