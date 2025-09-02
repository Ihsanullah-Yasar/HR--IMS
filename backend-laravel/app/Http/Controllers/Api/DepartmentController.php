<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employee;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class DepartmentController extends Controller
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
        $departments = QueryBuilder::for(Department::query())
            ->with(['parentDepartment', 'currentManager.employee', 'createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('code'),
                AllowedFilter::partial('currentManager.employee.name'),
            ])
            ->allowedSorts(['name', 'code', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = DepartmentResource::collection($departments);
        $array = $resource->response()->getData(true);

        return $this->successResponse([
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
    public function edit($id): JsonResponse
    {
        // $excludeDepartmentId = $request->input('exclude_department_id');
        $data = [
            'editingDepartment' => new DepartmentResource(Department::findOrFail($id)),
            'departments' => DepartmentResource::collection(Department::select('id as dId', 'name', 'code')
                // ->when(is_numeric($excludeDepartmentId), function ($query) use ($excludeDepartmentId) {
                //     return $query->where('id', '!=', (int) $excludeDepartmentId);
                // })
                ->orderBy('name')
                ->get()),
            'managers' => Employee::select('id', 'name')
                ->orderBy('name')
                ->get()
        ];

        return $this->successResponse($data);
    }

    /**
     * Get departments and managers for department creation form.
     *
     * @return JsonResponse
     */
    public function create(): JsonResponse
    {
        $data = [
            'departments' => Department::select('id as dId', 'name', 'code')
                ->orderBy('name')
                ->get(),
            'managers' => Employee::select('id', 'name')
                ->orderBy('name')
                ->get()
        ];

        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreDepartmentRequest $request
     * @return JsonResponse
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $managerEmployeeId = $validated['manager_employee_id'] ?? null;
        unset($validated['manager_employee_id']);

        $department = Department::create($validated);

        if ($managerEmployeeId) {
            \App\Models\DepartmentManager::create([
                'department_id' => $department->getKey(),
                'employee_id' => $managerEmployeeId,
                'start_date' => now()->toDateString(),
                'is_active' => true,
            ]);
        }

        $department->load(['parentDepartment', 'currentManager.employee', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->successResponse(
            new DepartmentResource($department),
            'Department created successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     *
     * @param Department $department
     * @return JsonResponse
     */
    public function show(Department $department): JsonResponse
    {
        $department->load(['parentDepartment', 'currentManager.employee', 'createdBy', 'updatedBy', 'deletedBy']);
        return $this->successResponse(
            new DepartmentResource($department),
            'Department retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateDepartmentRequest $request
     * @param Department $department
     * @return JsonResponse
     */
    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        $validated = $request->validated();
        $managerEmployeeId = $validated['manager_employee_id'] ?? null;
        unset($validated['manager_employee_id']);

        $department->update($validated);

        if ($managerEmployeeId !== null) {
            $current = $department->currentManager;
            if ($current && $current->employee_id !== $managerEmployeeId) {
                $current->update([
                    'is_active' => false,
                    'end_date' => now()->toDateString(),
                ]);
            }

            if (!$current || $current->employee_id !== $managerEmployeeId) {
                \App\Models\DepartmentManager::create([
                    'department_id' => $department->getKey(),
                    'employee_id' => $managerEmployeeId,
                    'start_date' => now()->toDateString(),
                    'is_active' => true,
                ]);
            }
        }

        $department->load(['parentDepartment', 'currentManager.employee', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->successResponse(
            new DepartmentResource($department),
            'Department updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Department $department
     * @return JsonResponse
     */
    public function destroy(Department $department): JsonResponse
    {
        $department->delete();

        return $this->successResponse(
            null,
            'Department deleted successfully',
            Response::HTTP_OK
        );
    }
}
