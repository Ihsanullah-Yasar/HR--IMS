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
     */
    public function index(Request $request): JsonResponse
    {
        $currencies = QueryBuilder::for(Currency::query())
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('code'),
                AllowedFilter::partial('symbol'),
                AllowedFilter::exact('is_active'),
            ])
            ->allowedSorts(['name', 'code', 'exchange_rate', 'created_at'])
            ->paginate($request->input('per_page', 15));

        $resource = CurrencyResource::collection($currencies);
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
    public function store(StoreCurrencyRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $currency = Currency::create($validated);

        return $this->successResponse(
            new CurrencyResource($currency),
            'Currency created successfully',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Currency $currency): JsonResponse
    {
        return $this->successResponse(
            new CurrencyResource($currency),
            'Currency retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCurrencyRequest $request, Currency $currency): JsonResponse
    {
        $validated = $request->validated();
        $currency->update($validated);

        return $this->successResponse(
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

        return $this->successResponse(
            null,
            'Currency deleted successfully',
            Response::HTTP_OK
        );
    }
}
