<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'settings';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'key',
        'value',
        'group',
    ];

    protected $casts = [
        'id' => 'string',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = self::where('key', $key)->first();
        return $setting?->value ?? $default;
    }

    public static function set(string $key, mixed $value, string $group = 'general'): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}