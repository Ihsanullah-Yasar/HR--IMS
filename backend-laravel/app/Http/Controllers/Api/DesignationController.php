<?php

namespace App\Http\Controllers\Api;

use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreDesignationRequest;
use App\Http\Requests\UpdateDesignationRequest;
use App\Http\Resources\DesignationResource;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedSort;
use App\Traits\ApiResponseTrait;
use App\QueryBuilder\Sorts\RelationSort;

class DesignationController extends Controller
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
        $designations = QueryBuilder::for(Designation::query())
            ->with(['department', 'createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::partial('code'),
                AllowedFilter::partial('title'),
                AllowedFilter::partial('department.name'),
                AllowedFilter::exact('is_active'),
            ])
            ->allowedSorts(['title','code', 'base_salary', 'created_at',
             AllowedSort::custom('department.name', new RelationSort('department', 'name')),])
            ->paginate($request->input('per_page', 15));

        $resource = DesignationResource::collection($designations);
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
    public function formData($id): JsonResponse
    {
        $data = [
            'editingDesignation' => new DesignationResource(Designation::findOrFail($id)),
            'departments' => Department::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()
        ];

        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreDesignationRequest $request
     * @return JsonResponse
     */
    public function store(StoreDesignationRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $designation = Designation::create($validated);
        $designation->load(['department', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->successResponse(
            new DesignationResource($designation),
            'Designation created successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     *
     * @param Designation $designation
     * @return JsonResponse
     */
    public function show(Designation $designation): JsonResponse
    {
        $designation->load(['department', 'createdBy', 'updatedBy', 'deletedBy']);
        return $this->successResponse(
            new DesignationResource($designation),
            'Designation retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateDesignationRequest $request
     * @param Designation $designation
     * @return JsonResponse
     */
    public function update(UpdateDesignationRequest $request, Designation $designation): JsonResponse
    {
        $validated = $request->validated();

        $designation->update($validated);
        $designation->load(['department', 'createdBy', 'updatedBy', 'deletedBy']);

        return $this->successResponse(
            new DesignationResource($designation),
            'Designation updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Designation $designation
     * @return JsonResponse
     */
    public function destroy(Designation $designation): JsonResponse
    {
        $designation->delete();

        return $this->successResponse(
            null,
            'Designation deleted successfully',
            Response::HTTP_OK
        );
    }
}
