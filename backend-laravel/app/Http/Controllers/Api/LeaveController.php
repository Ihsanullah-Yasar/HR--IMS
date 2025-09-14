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
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $leaves = QueryBuilder::for(Leave::query())
            ->with(['employee', 'leaveType', 'approvedBy', 'createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::exact('leave_type_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::partial('employee.name'),
                AllowedFilter::partial('leaveType.name'),
                AllowedFilter::scope('date_range'),
            ])
            ->allowedSorts(['start_date', 'end_date', 'status', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = LeaveResource::collection($leaves);

        return $this->paginatedResponse($resource);
    }

    /**
     * Display a list of resources for select in dropdown.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function edit($id): JsonResponse
    {
        $data = [
            'editingLeave' => new LeaveResource(Leave::findOrFail($id)),
            'employees' => \App\Models\Employee::select('id', 'name')
                ->orderBy('name')
                ->get(),
            'leaveTypes' => \App\Models\LeaveType::select('id as ltId', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ];

        return $this->successResponse($data);
    }

    /**
     * Get employees and leave types for leave creation form.
     *
     * @return JsonResponse
     */
    public function create(): JsonResponse
    {
        $data = [
            'employees' => \App\Models\Employee::select('id', 'name')
                ->orderBy('name')
                ->get(),
            'leaveTypes' => \App\Models\LeaveType::select('id as ltId', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ];

        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreLeaveRequest $request
     * @return JsonResponse
     */
    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Calculate total days if not provided
        if (!isset($validated['total_days'])) {
            $startDate = \Carbon\Carbon::parse($validated['start_date']);
            $endDate = \Carbon\Carbon::parse($validated['end_date']);
            $validated['total_days'] = $startDate->diffInDays($endDate) + 1;
        }
        
        $leave = Leave::create($validated);
        $leave->load(['employee', 'leaveType', 'approvedBy', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->createdResponse(
            new LeaveResource($leave),
            'Leave request created successfully'
        );
    }

    /**
     * Display the specified resource.
     *
     * @param Leave $leave
     * @return JsonResponse
     */
    public function show(Leave $leave): JsonResponse
    {
        $leave->load(['employee', 'leaveType', 'approvedBy', 'createdBy', 'updatedBy', 'deletedBy']);
        return $this->successResponse(
            new LeaveResource($leave),
            'Leave request retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateLeaveRequest $request
     * @param Leave $leave
     * @return JsonResponse
     */
    public function update(UpdateLeaveRequest $request, Leave $leave): JsonResponse
    {
        $validated = $request->validated();
        
        // Calculate total days if dates are updated
        if (isset($validated['start_date']) || isset($validated['end_date'])) {
            $startDate = \Carbon\Carbon::parse($validated['start_date'] ?? $leave->start_date);
            $endDate = \Carbon\Carbon::parse($validated['end_date'] ?? $leave->end_date);
            $validated['total_days'] = $startDate->diffInDays($endDate) + 1;
        }
        
        $leave->update($validated);
        $leave->load(['employee', 'leaveType', 'approvedBy', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->updatedResponse(
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

        return $this->deletedResponse('Leave request deleted successfully');
    }
}
