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
        'contact_name',
        'email',
        'organization_name',
        'organization_type',
        'use_case',
        'status',
        'admin_notes',
        'sandbox_credentials',
        'is_read',
        'read_at',
        'credentials_sent_at',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];
}
