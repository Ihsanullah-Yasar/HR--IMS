<?php

namespace App\Http\Controllers\Api;

use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Designation;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class EmployeeController extends Controller
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
        $employees = QueryBuilder::for(Employee::query())
            ->with(['user', 'department', 'designation', 'createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('gender_type'),
                AllowedFilter::partial('marital_status'),
                AllowedFilter::partial('department.name'),
                AllowedFilter::partial('designation.code'),
                AllowedFilter::partial('user.name'),
            ])
            ->allowedSorts(['name', 'date_of_joining', 'date_of_birth', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = EmployeeResource::collection($employees);
        $array = $resource->response()->getData(true);

        return response()->json([
            'status' => 'success',
            'data'   => $array['data'],
            'links'  => $array['links'] ?? null,
            'meta'   => $array['meta'] ?? null,
        ]);
    }

    /**
     * Display a list of resources for select in dropdown.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function formData($id): JsonResponse
    {
        $data = [
            'editingEmployee' => new EmployeeResource(Employee::findOrFail($id)),
            'departments' => Department::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
            'designations' => Designation::select('id', 'code', 'title')
                ->orderBy('code')
                ->get(),
            'users' => User::select('id', 'name', 'email')
                ->orderBy('name')
                ->get()
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreEmployeeRequest $request
     * @return JsonResponse
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $employee = Employee::create($validated);
        $employee->load(['user', 'department', 'designation', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->successResponse(
            new EmployeeResource($employee),
            'Employee created successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     *
     * @param Employee $employee
     * @return JsonResponse
     */
    public function show(Employee $employee): JsonResponse
    {
        $employee->load(['user', 'department', 'designation', 'createdBy', 'updatedBy', 'deletedBy']);
        return $this->successResponse(
            new EmployeeResource($employee),
            'Employee retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateEmployeeRequest $request
     * @param Employee $employee
     * @return JsonResponse
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        $validated = $request->validated();

        $employee->update($validated);
        $employee->load(['user', 'department', 'designation', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->successResponse(
            new EmployeeResource($employee),
            'Employee updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Employee $employee
     * @return JsonResponse
     */
    public function destroy(Employee $employee): JsonResponse
    {
        $employee->delete();

        return $this->successResponse(
            null,
            'Employee deleted successfully',
            Response::HTTP_OK
        );
    }
}
