<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class UserController extends Controller
{
    use ApiResponseTrait;
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $users = QueryBuilder::for(User::class)->allowedFilters(
            AllowedFilter::partial('name'),
            AllowedFilter::partial('email')
        )->allowedSorts(['name', 'email', 'created_at'])->paginate($request->input('per_page', 15));

        // $perPage = $request->input('per_page', 15);
        // $sortBy = $request->input('sort_by', 'created_at');
        // $sortDirection = $request->input('sort_direction', 'desc');
        // $search = $request->input('search');

        // $query = User::query()
        //     ->when($search, function ($query) use ($search) {
        //         $query->where(function ($q) use ($search) {
        //             $q->where('name', 'like', "%{$search}%")
        //                 ->orWhere('email', 'like', "%{$search}%");
        //         });
        //     });

        // $users = $query->orderBy($sortBy, $sortDirection)
        //     ->paginate($perPage);


        $resource = UserResource::collection($users);

        return $this->paginatedResponse($resource);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return $this->createdResponse(
            new UserResource($user),
            'User created successfully'
        );
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        return $this->successResponse(
            new UserResource($user),
            'User retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        // $user->load(['roles', 'permissions', 'profile']);

        return $this->updatedResponse(
            new UserResource($user),
            'User updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->deletedResponse('User deleted successfully');
    }
}
