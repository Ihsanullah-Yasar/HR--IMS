<?php

namespace App\Http\Controllers\Api;

use App\Models\Currency;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreCurrencyRequest;
use App\Http\Requests\UpdateCurrencyRequest;
use App\Http\Resources\CurrencyResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class CurrencyController extends Controller
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
        $currencies = QueryBuilder::for(Currency::query())
            ->with(['createdBy', 'updatedBy', 'deletedBy'])
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('code'),
                AllowedFilter::partial('symbol'),
                AllowedFilter::exact('is_active'),
            ])
            ->allowedSorts(['name', 'code', 'symbol', 'decimal_places', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = CurrencyResource::collection($currencies);

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
        $data = [
            'editingCurrency' => new CurrencyResource(Currency::findOrFail($id)),
        ];

        return $this->successResponse($data);
    }

    /**
     * Get currencies for currency creation form.
     *
     * @return JsonResponse
     */
    public function create(): JsonResponse
    {
        $data = [];

        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCurrencyRequest $request
     * @return JsonResponse
     */
    public function store(StoreCurrencyRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $currency = Currency::create($validated);
        $currency->load(['createdBy', 'updatedBy', 'deletedBy']);

        return $this->createdResponse(
            new CurrencyResource($currency),
            'Currency created successfully'
        );
    }

    /**
     * Display the specified resource.
     *
     * @param Currency $currency
     * @return JsonResponse
     */
    public function show(Currency $currency): JsonResponse
    {
        $currency->load(['createdBy', 'updatedBy', 'deletedBy']);
        return $this->successResponse(
            new CurrencyResource($currency),
            'Currency retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCurrencyRequest $request
     * @param Currency $currency
     * @return JsonResponse
     */
    public function update(UpdateCurrencyRequest $request, Currency $currency): JsonResponse
    {
        $validated = $request->validated();
        $currency->update($validated);
        $currency->load(['createdBy', 'updatedBy', 'deletedBy']);

        return $this->updatedResponse(
            new CurrencyResource($currency),
            'Currency updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Currency $currency): JsonResponse
    {
        $currency->delete();

        return $this->deletedResponse('Currency deleted successfully');
    }
}
