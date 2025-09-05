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
                // Title is stored as JSON; do a case-insensitive search within JSON text
                AllowedFilter::callback('title', function ($query, $value) {
                    $search = is_array($value) ? ($value[0] ?? '') : $value;
                    if ($search === '' || $search === null) {
                        return;
                    }
                    // Works with PostgreSQL jsonb using ::text cast
                    $query->whereRaw('LOWER(title::text) LIKE ?', ['%' . strtolower($search) . '%']);
                }),
                AllowedFilter::partial('department.name'),
                AllowedFilter::exact('is_active'),
            ])
            ->allowedSorts(['title','code', 'base_salary', 'created_at',
             AllowedSort::custom('department.name', new RelationSort('department', 'name')),])
            ->paginate($request->input('per_page', 15));

        $resource = DesignationResource::collection($designations);

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
        $designation = Designation::with(['department', 'createdBy', 'updatedBy', 'deletedBy'])->findOrFail($id);
        
        $data = [
            'editingDesignation' => new DesignationResource($designation),
            'departments' => Department::select('id as dId', 'name', 'code')
                ->orderBy('name')
                ->get()
        ];

        return $this->successResponse($data);
    }

    /**
     * Get departments for designation creation form.
     *
     * @return JsonResponse
     */
    public function create(): JsonResponse
    {
        $data = [
            'departments' => Department::select('id as dId', 'name', 'code')
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

        return $this->createdResponse(
            new DesignationResource($designation),
            'Designation created successfully'
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

        return $this->updatedResponse(
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

        return $this->deletedResponse('Designation deleted successfully');
    }
}
