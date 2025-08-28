<?php

namespace App\Http\Controllers\Api;

use App\Models\Leave;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveRequest;
use App\Http\Resources\LeaveResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class LeaveController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $leaves = QueryBuilder::for(Leave::query())
            ->with(['employee', 'leaveType'])
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::exact('leave_type_id'),
                AllowedFilter::partial('employee.name'),
                AllowedFilter::partial('leaveType.name'),
                AllowedFilter::scope('date_range'),
                AllowedFilter::scope('status'),
            ])
            ->allowedSorts(['start_date', 'end_date', 'status', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = LeaveResource::collection($leaves);
        $array = $resource->response()->getData(true);

        return response()->json([
            'status' => 'success',
            'data'   => $array['data'],
            'links'  => $array['links'] ?? null,
            'meta'   => $array['meta'] ?? null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $leave = Leave::create($validated);
        $leave->load(['employee', 'leaveType']);

        return $this->successResponse(
            new LeaveResource($leave),
            'Leave request created successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Leave $leave): JsonResponse
    {
        $leave->load(['employee', 'leaveType']);
        return $this->successResponse(
            new LeaveResource($leave),
            'Leave request retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequest $request, Leave $leave): JsonResponse
    {
        $validated = $request->validated();
        $leave->update($validated);
        $leave->load(['employee', 'leaveType']);

        return $this->successResponse(
            new LeaveResource($leave),
            'Leave request updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave): JsonResponse
    {
        $leave->delete();

        return $this->successResponse(
            null,
            'Leave request deleted successfully',
            Response::HTTP_OK
        );
    }
}
