<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Concerns\HasUuids as BaseHasUuids;
use Ramsey\Uuid\Uuid;

trait HasUuids
{
    use BaseHasUuids;

    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }
}