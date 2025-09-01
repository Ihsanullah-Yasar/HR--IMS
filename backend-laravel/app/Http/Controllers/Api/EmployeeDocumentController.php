<?php

namespace App\Http\Controllers\Api;

use App\Models\EmployeeDocument;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreEmployeeDocumentRequest;
use App\Http\Requests\UpdateEmployeeDocumentRequest;
use App\Http\Resources\EmployeeDocumentResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\Storage;
use App\Traits\ApiResponseTrait;

class EmployeeDocumentController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $documents = QueryBuilder::for(EmployeeDocument::query())
            ->with(['employee'])
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::partial('type'),
            ])
            ->allowedSorts(['created_at', 'expiry_date', 'type'])
            ->paginate($request->input('per_page', 15));

        $resource = EmployeeDocumentResource::collection($documents);
        $array = $resource->response()->getData(true);

        return $this->successResponse([
            'data'   => $array['data'],
            'links'  => $array['links'] ?? null,
            'meta'   => $array['meta'] ?? null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeDocumentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $file = $request->file('document');
        $storedPath = $file->store('employee-documents', 'public');

        $document = EmployeeDocument::create([
            'employee_id' => $validated['employee_id'],
            'type' => $validated['type'],
            'path' => $storedPath,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
        ]);

        $document->load('employee');

        return $this->successResponse(
            new EmployeeDocumentResource($document),
            'Employee document uploaded successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeDocument $employeeDocument): JsonResponse
    {
        $employeeDocument->load('employee');
        return $this->successResponse(
            new EmployeeDocumentResource($employeeDocument),
            'Employee document retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeDocumentRequest $request, EmployeeDocument $employeeDocument): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('document')) {
            if ($employeeDocument->path && Storage::disk('public')->exists($employeeDocument->path)) {
                Storage::disk('public')->delete($employeeDocument->path);
            }
            $newPath = $request->file('document')->store('employee-documents', 'public');
            $validated['path'] = $newPath;
        }

        $employeeDocument->update($validated);
        $employeeDocument->load('employee');

        return $this->successResponse(
            new EmployeeDocumentResource($employeeDocument),
            'Employee document updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeDocument $employeeDocument): JsonResponse
    {
        if ($employeeDocument->path && Storage::disk('public')->exists($employeeDocument->path)) {
            Storage::disk('public')->delete($employeeDocument->path);
        }

        $employeeDocument->delete();

        return $this->successResponse(
            null,
            'Employee document deleted successfully',
            Response::HTTP_OK
        );
    }
}
