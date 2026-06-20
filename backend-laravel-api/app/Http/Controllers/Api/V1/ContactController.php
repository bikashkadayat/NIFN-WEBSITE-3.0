<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        ContactSubmission::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! We will respond soon.',
        ]);
    }

    public function joinNetwork(Request $request): JsonResponse
    {
        $request->validate([
            'contactName'  => ['required', 'string', 'max:255'],
            'contactEmail' => ['required', 'email', 'max:255'],
            'contactPhone' => ['nullable', 'string', 'max:50'],
            'orgName'      => ['nullable', 'string', 'max:255'],
        ]);

        // Collect all submitted fields into a readable message for admin review
        $fields = $request->except('hp_field');
        $lines = [];
        foreach ($fields as $key => $value) {
            if (is_null($value) || $value === '' || $value === false) continue;
            $label = ucwords(preg_replace('/(?<=[a-z])(?=[A-Z])/', ' ', $key));
            $lines[] = "{$label}: " . (is_array($value) ? implode(', ', $value) : $value);
        }

        ContactSubmission::create([
            'name'    => $request->contactName,
            'email'   => strtolower(trim($request->contactEmail)),
            'phone'   => $request->contactPhone,
            'subject' => 'Join Network Application — ' . ($request->orgName ?: $request->contactName),
            'message' => implode("\n", $lines),
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Application submitted! Our partnerships team will contact you within 3 business days.',
            'reference' => 'NIFN-' . strtoupper(substr(uniqid(), -8)),
        ]);
    }
}
