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
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $leaveTypes = QueryBuilder::for(LeaveType::query())
            ->with(['createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('code'),
                AllowedFilter::exact('is_paid'),
                AllowedFilter::exact('is_active'),
            ])
            ->allowedSorts(['name', 'code', 'days_per_year', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = LeaveTypeResource::collection($leaveTypes);

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
            'editingLeaveType' => new LeaveTypeResource(LeaveType::findOrFail($id)),
        ];

        return $this->successResponse($data);
    }

    /**
     * Get leave types for leave type creation form.
     *
     * @return JsonResponse
     */
    public function create(): JsonResponse
    {
        $data = [
            'leaveTypes' => LeaveType::select('id as ltId', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
        ];

        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreLeaveTypeRequest $request
     * @return JsonResponse
     */
    public function store(StoreLeaveTypeRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $leaveType = LeaveType::create($validated);
        $leaveType->load(['createdBy', 'updatedBy', 'deletedBy']);

        return $this->createdResponse(
            new LeaveTypeResource($leaveType),
            'Leave type created successfully'
        );
    }

    /**
     * Display the specified resource.
     *
     * @param LeaveType $leaveType
     * @return JsonResponse
     */
    public function show(LeaveType $leaveType): JsonResponse
    {
        $leaveType->load(['createdBy', 'updatedBy', 'deletedBy']);
        return $this->successResponse(
            new LeaveTypeResource($leaveType),
            'Leave type retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateLeaveTypeRequest $request
     * @param LeaveType $leaveType
     * @return JsonResponse
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType): JsonResponse
    {
        $validated = $request->validated();
        $leaveType->update($validated);
        $leaveType->load(['createdBy', 'updatedBy', 'deletedBy']);

        return $this->updatedResponse(
            new LeaveTypeResource($leaveType),
            'Leave type updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param LeaveType $leaveType
     * @return JsonResponse
     */
    public function destroy(LeaveType $leaveType): JsonResponse
    {
        $leaveType->delete();

        return $this->deletedResponse('Leave type deleted successfully');
    }
}
