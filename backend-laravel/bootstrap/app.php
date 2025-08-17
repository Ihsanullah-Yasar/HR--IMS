<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        apiPrefix: 'api',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function ($exceptions) {
        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->expectsJson()) {
                $status = Response::HTTP_INTERNAL_SERVER_ERROR;
                $message = 'An unexpected error occurred';
                $errors = null;

                if ($e instanceof ValidationException) {
                    $status = Response::HTTP_UNPROCESSABLE_ENTITY;
                    $message = 'Validation error';
                    $errors = $e->errors();
                } elseif ($e instanceof ModelNotFoundException) {
                    $status = Response::HTTP_NOT_FOUND;
                    $message = 'Resource not found';
                } elseif ($e instanceof QueryException) {
                    $status = Response::HTTP_INTERNAL_SERVER_ERROR;
                    $message = 'Database error occurred';
                }

                // Log for dev visibility
                Log::error($e->getMessage(), [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]);

                return response()->json([
                    'status'  => 'error',
                    'message' => $message,
                    'errors'  => $errors,
                ], $status);
            }

            // Fallback to default rendering for non-API requests
            return null;
        });
    })->create();
