<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = NewsletterSubscriber::orderBy('created_at', 'desc');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search')) {
            $query->where('email', 'LIKE', '%' . $request->search . '%');
        }

        return response()->json($query->paginate($request->integer('per_page', 50)));
    }

    public function export(Request $request): Response
    {
        $subscribers = NewsletterSubscriber::where('is_active', true)
            ->orderBy('email')
            ->get(['email', 'subscribed_at']);

        $csv = "email,subscribed_at\n";
        foreach ($subscribers as $sub) {
            $csv .= $sub->email . ',' . ($sub->subscribed_at?->toISOString() ?? '') . "\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="subscribers.csv"',
        ]);
    }

    public function unsubscribe(string $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);

        $subscriber->update([
            'is_active'       => false,
            'unsubscribed_at' => now(),
        ]);

        return response()->json(['message' => 'Subscriber unsubscribed.']);
    }

    public function destroy(string $id): JsonResponse
    {
        NewsletterSubscriber::findOrFail($id)->delete();

        return response()->json(['message' => 'Subscriber deleted.']);
    }
}
