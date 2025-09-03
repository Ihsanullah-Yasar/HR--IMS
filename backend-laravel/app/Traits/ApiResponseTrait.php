<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponseTrait
{
    /**
     * Return a success response
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $status = Response::HTTP_OK
    ): JsonResponse {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Return a paginated success response
     */
    protected function paginatedResponse(
        ResourceCollection $resource,
        string $message = 'Data retrieved successfully'
    ): JsonResponse {
        $array = $resource->response()->getData(true);
        
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $array['data'],
            'links' => $array['links'] ?? null,
            'meta' => $array['meta'] ?? null,
        ]);
    }

    /**
     * Return a created response
     */
    protected function createdResponse(
        mixed $data = null,
        string $message = 'Resource created successfully'
    ): JsonResponse {
        return $this->successResponse($data, $message, Response::HTTP_CREATED);
    }

    /**
     * Return an updated response
     */
    protected function updatedResponse(
        mixed $data = null,
        string $message = 'Resource updated successfully'
    ): JsonResponse {
        return $this->successResponse($data, $message, Response::HTTP_OK);
    }

    /**
     * Return a deleted response
     */
    protected function deletedResponse(
        string $message = 'Resource deleted successfully'
    ): JsonResponse {
        return $this->successResponse(null, $message, Response::HTTP_OK);
    }

    /**
     * Return a not found response
     */
    protected function notFoundResponse(
        string $message = 'Resource not found'
    ): JsonResponse {
        return $this->errorResponse($message, null, Response::HTTP_NOT_FOUND);
    }

    /**
     * Return a validation error response
     */
    protected function validationErrorResponse(
        mixed $errors = null,
        string $message = 'Validation failed'
    ): JsonResponse {
        return $this->errorResponse($message, $errors, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Return an unauthorized response
     */
    protected function unauthorizedResponse(
        string $message = 'Unauthorized'
    ): JsonResponse {
        return $this->errorResponse($message, null, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Return a forbidden response
     */
    protected function forbiddenResponse(
        string $message = 'Forbidden'
    ): JsonResponse {
        return $this->errorResponse($message, null, Response::HTTP_FORBIDDEN);
    }

    /**
     * Return an error response
     */
    protected function errorResponse(
        string $message = 'Error',
        mixed $errors = null,
        int $status = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
