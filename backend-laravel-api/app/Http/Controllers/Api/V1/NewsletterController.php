<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $existing = NewsletterSubscriber::where('email', $validated['email'])->first();

        if ($existing) {
            if ($existing->is_active) {
                return response()->json([
                    'success' => true,
                    'message' => 'You are already subscribed to our newsletter.',
                ]);
            }

            $existing->update([
                'is_active'       => true,
                'subscribed_at'   => now(),
                'unsubscribed_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed!',
            ]);
        }

        NewsletterSubscriber::create([
            'email'         => $validated['email'],
            'is_active'     => true,
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully subscribed!',
        ]);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
        ]);

        $subscriber = NewsletterSubscriber::where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (! $subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid unsubscribe link.',
            ], 422);
        }

        $subscriber->update([
            'is_active'       => false,
            'unsubscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'You have been successfully unsubscribed.',
        ]);
    }
}
