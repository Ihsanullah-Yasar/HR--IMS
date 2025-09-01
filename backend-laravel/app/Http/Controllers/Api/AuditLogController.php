<?php

namespace App\Http\Controllers\Api;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\AuditLogResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Traits\ApiResponseTrait;

class AuditLogController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $auditLogs = QueryBuilder::for(AuditLog::query())
            ->with(['user'])
            ->allowedFilters([
                AllowedFilter::exact('user_id'),
                AllowedFilter::partial('user.name'),
                AllowedFilter::partial('action'),
                AllowedFilter::partial('table_name'),
                AllowedFilter::partial('record_id'),
                AllowedFilter::scope('date_range'),
            ])
            ->allowedSorts(['created_at', 'action', 'table_name'])
            ->paginate($request->input('per_page', 15));

        $resource = AuditLogResource::collection($auditLogs);
        $array = $resource->response()->getData(true);

        return $this->successResponse([
            'data'   => $array['data'],
            'links'  => $array['links'] ?? null,
            'meta'   => $array['meta'] ?? null,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(AuditLog $auditLog): JsonResponse
    {
        $auditLog->load('user');
        return $this->successResponse(
            new AuditLogResource($auditLog),
            'Audit log retrieved successfully'
        );
    }
}
