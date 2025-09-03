<?php

namespace App\Http\Controllers\Api;

use App\Models\AttendanceRecord;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreAttendanceRecordRequest;
use App\Http\Requests\UpdateAttendanceRecordRequest;
use App\Http\Resources\AttendanceRecordResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class AttendanceRecordController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $attendanceRecords = QueryBuilder::for(AttendanceRecord::query())
            ->with(['employee'])
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::partial('employee.name'),
                AllowedFilter::scope('date_range'),
            ])
            ->allowedSorts(['date', 'check_in_time', 'check_out_time', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = AttendanceRecordResource::collection($attendanceRecords);

        return $this->paginatedResponse($resource);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRecordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $attendanceRecord = AttendanceRecord::create($validated);
        $attendanceRecord->load('employee');

        return $this->createdResponse(
            new AttendanceRecordResource($attendanceRecord),
            'Attendance record created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceRecord $attendanceRecord): JsonResponse
    {
        $attendanceRecord->load('employee');
        return $this->successResponse(
            new AttendanceRecordResource($attendanceRecord),
            'Attendance record retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRecordRequest $request, AttendanceRecord $attendanceRecord): JsonResponse
    {
        $validated = $request->validated();
        $attendanceRecord->update($validated);
        $attendanceRecord->load('employee');

        return $this->updatedResponse(
            new AttendanceRecordResource($attendanceRecord),
            'Attendance record updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceRecord $attendanceRecord): JsonResponse
    {
        $attendanceRecord->delete();

        return $this->deletedResponse('Attendance record deleted successfully');
    }
}
