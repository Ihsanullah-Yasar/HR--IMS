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
use App\Models\Employee;

class AttendanceRecordController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $attendanceRecords = QueryBuilder::for(AttendanceRecord::query())
            ->with(['employee.department'])
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::partial('employee.name'),
                AllowedFilter::partial('employee.department.name'),
                AllowedFilter::scope('date_range'),
                AllowedFilter::scope('for_employee'),
            ])
            ->allowedSorts(['log_date', 'check_in', 'check_out', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = AttendanceRecordResource::collection($attendanceRecords);

        return $this->paginatedResponse($resource);
    }

    /**
     * Get employees for attendance creation form.
     */
    public function create(): JsonResponse
    {
        $data = [
            'employees' => Employee::with('department')
                ->select('id', 'name', 'department_id','department_id')
                ->orderBy('name')
                ->get()
        ];

        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRecordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Calculate hours worked if both check_in and check_out are provided
        if ($validated['check_in'] && $validated['check_out']) {
            $checkIn = \Carbon\Carbon::parse($validated['check_in']);
            $checkOut = \Carbon\Carbon::parse($validated['check_out']);
            $validated['hours_worked'] = $checkOut->diffInHours($checkIn, true);
        }
        
        $attendanceRecord = AttendanceRecord::create($validated);
        $attendanceRecord->load(['employee.department']);

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
        $attendanceRecord->load(['employee.department']);
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
        
        // Calculate hours worked if both check_in and check_out are provided
        if (isset($validated['check_in']) && isset($validated['check_out'])) {
            $checkIn = \Carbon\Carbon::parse($validated['check_in']);
            $checkOut = \Carbon\Carbon::parse($validated['check_out']);
            $validated['hours_worked'] = $checkOut->diffInHours($checkIn, true);
        }
        
        $attendanceRecord->update($validated);
        $attendanceRecord->load(['employee.department']);

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
