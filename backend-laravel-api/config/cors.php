<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'http://localhost:3006',
        'http://localhost:3007',
        'http://localhost:3008',
        'https://nifn.org.np',
        'https://admin.nifn.org.np',
        'https://developers.nifn.org.np',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Accept', 'Authorization', 'X-Revalidation-Secret', 'x-revalidate-secret'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
