<?php

namespace App\Http\Controllers\Api;

use App\Models\LeaveType;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreLeaveTypeRequest;
use App\Http\Requests\UpdateLeaveTypeRequest;
use App\Http\Resources\LeaveTypeResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class LeaveTypeController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $leaveTypes = QueryBuilder::for(LeaveType::query())
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('description'),
                AllowedFilter::exact('is_active'),
            ])
            ->allowedSorts(['name', 'default_days', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = LeaveTypeResource::collection($leaveTypes);
        $array = $resource->response()->getData(true);

        return $this->successResponse([
            'data'   => $array['data'],
            'links'  => $array['links'] ?? null,
            'meta'   => $array['meta'] ?? null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveTypeRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $leaveType = LeaveType::create($validated);

        return $this->successResponse(
            new LeaveTypeResource($leaveType),
            'Leave type created successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveType $leaveType): JsonResponse
    {
        return $this->successResponse(
            new LeaveTypeResource($leaveType),
            'Leave type retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType): JsonResponse
    {
        $validated = $request->validated();
        $leaveType->update($validated);

        return $this->successResponse(
            new LeaveTypeResource($leaveType),
            'Leave type updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveType $leaveType): JsonResponse
    {
        $leaveType->delete();

        return $this->successResponse(
            null,
            'Leave type deleted successfully',
            Response::HTTP_OK
        );
    }
}
