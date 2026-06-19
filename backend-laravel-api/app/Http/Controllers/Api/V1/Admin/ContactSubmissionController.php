<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactSubmission::orderBy('created_at', 'desc');

        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('subject', 'LIKE', "%{$search}%");
            });
        }

        return response()->json($query->paginate($request->integer('per_page', 20)));
    }

    public function show(string $id): JsonResponse
    {
        $submission = ContactSubmission::findOrFail($id);

        return response()->json(['data' => $submission]);
    }

    public function markRead(string $id): JsonResponse
    {
        $submission = ContactSubmission::findOrFail($id);

        $submission->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json(['message' => 'Marked as read.']);
    }

    public function destroy(string $id): JsonResponse
    {
        ContactSubmission::findOrFail($id)->delete();

        return response()->json(['message' => 'Submission deleted.']);
    }
}
