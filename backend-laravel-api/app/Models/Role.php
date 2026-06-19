<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'roles';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'slug',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
        'id' => 'string',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }

    public function translation(string $locale = 'en')
    {
        return null;
    }
}