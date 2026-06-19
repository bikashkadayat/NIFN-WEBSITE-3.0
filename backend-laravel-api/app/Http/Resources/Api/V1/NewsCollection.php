<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class NewsCollection extends ResourceCollection
{
    public $collects = NewsResource::class;

    public function paginationInformation(Request $request, array $paginated, array $default): array
    {
        return [
            'meta' => [
                'current_page' => $paginated['current_page'],
                'per_page'     => $paginated['per_page'],
                'total'        => $paginated['total'],
                'last_page'    => $paginated['last_page'],
            ],
            'links' => [
                'first' => $paginated['first_page_url'] ?? null,
                'last'  => $paginated['last_page_url'] ?? null,
                'prev'  => $paginated['prev_page_url'] ?? null,
                'next'  => $paginated['next_page_url'] ?? null,
            ],
        ];
    }
}
