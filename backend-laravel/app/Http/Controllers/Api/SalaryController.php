<?php

namespace App\Http\Controllers\Api;

use App\Models\Salary;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreSalaryRequest;
use App\Http\Requests\UpdateSalaryRequest;
use App\Http\Resources\SalaryResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class SalaryController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $salaries = QueryBuilder::for(Salary::query())
            ->with(['employee', 'currency'])
            ->allowedFilters([
                AllowedFilter::exact('employee_id'),
                AllowedFilter::exact('currency_code'),
                AllowedFilter::partial('employee.name'),
                AllowedFilter::scope('effective_date_range'),
            ])
            ->allowedSorts(['base_amount', 'effective_from', 'effective_to', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = SalaryResource::collection($salaries);

        return $this->paginatedResponse($resource);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSalaryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $salary = Salary::create($validated);
        $salary->load(['employee', 'currency']);

        return $this->createdResponse(
            new SalaryResource($salary),
            'Salary record created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Salary $salary): JsonResponse
    {
        $salary->load(['employee', 'currency']);
        return $this->successResponse(
            new SalaryResource($salary),
            'Salary record retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSalaryRequest $request, Salary $salary): JsonResponse
    {
        $validated = $request->validated();
        $salary->update($validated);
        $salary->load(['employee', 'currency']);

        return $this->updatedResponse(
            new SalaryResource($salary),
            'Salary record updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salary $salary): JsonResponse
    {
        $salary->delete();

        return $this->deletedResponse('Salary record deleted successfully');
    }
}
