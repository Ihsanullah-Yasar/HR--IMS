<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Controllers\Controller;
use App\Models\User;
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
            ->with(['parentDepartment', 'manager', 'createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('code'),
                AllowedFilter::partial('manager.name'),
            ])
            ->allowedSorts(['name', 'code', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = DepartmentResource::collection($departments);
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
    public function formData(Request $request): JsonResponse
    {
        $excludeDepartmentId = $request->input('exclude_department_id');

        $data = [
            'departments' => DepartmentResource::collection(Department::select('d_id', 'name', 'code')
                ->when(is_numeric($excludeDepartmentId), function ($query) use ($excludeDepartmentId) {
                    return $query->where('d_id', '!=', (int) $excludeDepartmentId);
                })
                ->orderBy('name')
                ->get()),
            'managers' => User::select('id', 'name', 'email')
                // ->whereHas('roles', function ($query) {
                //     $query->where('name', 'manager');
                // })
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
     * @param StoreDepartmentRequest $request
     * @return JsonResponse
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $department = Department::create($validated);
        $department->load(['parentDepartment', 'manager', 'createdBy', 'updatedBy', 'deletedBy']);

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
        $department->load(['parentDepartment', 'manager', 'createdBy', 'updatedBy', 'deletedBy']);
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

        $department->update($validated);
        $department->load(['parentDepartment', 'manager', 'createdBy', 'updatedBy', 'deletedBy']);

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
