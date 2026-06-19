<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeveloperRegistration extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'developer_registrations';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'email',
        'organization',
        'institution_type',
        'message',
        'status',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];
}
