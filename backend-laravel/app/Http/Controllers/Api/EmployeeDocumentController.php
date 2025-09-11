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
use App\Models\Employee;

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

        return $this->paginatedResponse($resource);
    }

    /**
     * Get form data for creating an employee document.
     */
    public function create(): JsonResponse
    {
        $data = [
            'employees' => Employee::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ];

        return $this->successResponse($data);
    }

    /**
     * Get form data for editing an employee document.
     */
    public function edit($id): JsonResponse
    {
        $data = [
            'editingDocument' => new EmployeeDocumentResource(EmployeeDocument::findOrFail($id)),
            'employees' => Employee::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ];

        return $this->successResponse($data);
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

        return $this->createdResponse(
            new EmployeeDocumentResource($document),
            'Employee document uploaded successfully'
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

        return $this->updatedResponse(
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

        return $this->deletedResponse('Employee document deleted successfully');
    }
}
