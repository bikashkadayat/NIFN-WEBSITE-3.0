<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\DeveloperRegistrationConfirmation;
use App\Mail\DeveloperRegistrationReceived;
use App\Models\DeveloperRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DeveloperRegistrationController extends Controller
{
    private const STATUSES = ['pending', 'reviewing', 'approved', 'rejected', 'contacted'];

    public function store(Request $request): JsonResponse
    {
        // Accept both old field names and DB column names for compatibility
        $request->merge([
            'name' => $request->input('name') ?? $request->input('contact_name'),
            'organization' => $request->input('organization') ?? $request->input('organization_name'),
            'institution_type' => $request->input('institution_type') ?? $request->input('organization_type'),
            'message' => $request->input('message') ?? $request->input('use_case'),
        ]);

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'organization'     => ['nullable', 'string', 'max:255'],
            'institution_type' => ['required', 'string', 'max:100'],
            'message'          => ['nullable', 'string', 'max:5000'],
            'terms_accepted'   => ['sometimes', 'boolean'],
            'agreed_terms'     => ['sometimes', 'boolean'],
        ]);

        unset($validated['terms_accepted'], $validated['agreed_terms']);

        try {
            $registration = DeveloperRegistration::create($validated);
            $this->sendNotifications($registration);

            return response()->json([
                'success' => true,
                'message' => 'Registration submitted successfully',
                'data' => ['id' => $registration->id],
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Developer registration error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit registration. Please try again.',
            ], 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $query = DeveloperRegistration::query()->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                    ->orWhere('email', 'ilike', '%' . $search . '%')
                    ->orWhere('organization', 'ilike', '%' . $search . '%');
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate($request->integer('per_page', 15)),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $registration = DeveloperRegistration::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $registration,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:' . implode(',', self::STATUSES)],
        ]);

        $registration = DeveloperRegistration::findOrFail($id);
        $registration->update($validated);

        return response()->json([
            'success' => true,
            'data' => $registration->fresh(),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        DeveloperRegistration::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    public function markRead(string $id): JsonResponse
    {
        $registration = DeveloperRegistration::findOrFail($id);
        $registration->update(['status' => 'reviewing']);

        return response()->json([
            'success' => true,
            'data' => $registration->fresh(),
        ]);
    }

    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => DeveloperRegistration::where('status', 'pending')->count(),
            ],
        ]);
    }

    public function markReviewed(string $id): JsonResponse
    {
        $registration = DeveloperRegistration::findOrFail($id);
        $registration->update(['status' => 'reviewing']);

        return response()->json([
            'success' => true,
            'data' => $registration->fresh(),
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:' . implode(',', self::STATUSES)],
        ]);

        $registration = DeveloperRegistration::findOrFail($id);
        $registration->update($validated);

        return response()->json([
            'success' => true,
            'data' => $registration->fresh(),
        ]);
    }

    private function sendNotifications(DeveloperRegistration $registration): void
    {
        try {
            Mail::to(config('mail.admin_email', 'admin@nifn.org.np'))
                ->send(new DeveloperRegistrationReceived($registration));

            Mail::to($registration->email)
                ->send(new DeveloperRegistrationConfirmation($registration));
        } catch (\Throwable $e) {
            Log::error('Developer registration email send failed: ' . $e->getMessage());
        }
    }
}
