<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 20));

        return response()->json($users);
    }

    private function resolveRoleId(Request $request): ?string
    {
        if ($request->filled('role_id')) {
            return $request->role_id;
        }
        if ($request->filled('role')) {
            // Frontend sends slug with underscores; DB stores with hyphens
            $slug = str_replace('_', '-', $request->role);
            return Role::where('slug', $slug)->value('id');
        }
        return null;
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8'],
            'role'      => ['nullable', 'string'],
            'role_id'   => ['nullable', 'uuid', 'exists:roles,id'],
            'is_active' => ['boolean'],
        ]);

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role_id'   => $this->resolveRoleId($request),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'data'    => $user->load('role'),
            'message' => 'User created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::with('role')->findOrFail($id);

        return response()->json(['data' => $user]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'      => ['sometimes', 'string', 'max:255'],
            'email'     => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($id)],
            'password'  => ['sometimes', 'string', 'min:8'],
            'role'      => ['nullable', 'string'],
            'role_id'   => ['nullable', 'uuid', 'exists:roles,id'],
            'is_active' => ['boolean'],
        ]);

        $data = array_filter($request->only(['name', 'email', 'is_active']));
        $resolvedRoleId = $this->resolveRoleId($request);
        if ($resolvedRoleId !== null) {
            $data['role_id'] = $resolvedRoleId;
        }

        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'data'    => $user->fresh('role'),
            'message' => 'User updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }
}
