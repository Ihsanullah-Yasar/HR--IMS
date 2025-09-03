<?php

use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeDocumentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\DesignationController;
use App\Http\Controllers\Api\AttendanceRecordController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\LeaveTypeController;
use App\Http\Controllers\Api\SalaryController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\AuditLogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('api')->group(function () {
    // User Management
    Route::apiResource('users', UserController::class);
    
    // Department Management
    Route::apiResource('departments', DepartmentController::class);
    Route::get('/departments/create/form-data', [DepartmentController::class, 'create']);
    Route::get('/departments/{id}/form-data', [DepartmentController::class, 'edit'])->whereNumber('id');
    
    // Employee Management
    Route::apiResource('employees', EmployeeController::class);
    Route::get('/employees/{id}/form-data', [EmployeeController::class, 'edit'])->whereNumber('id');
    
    // Employee Documents
    Route::apiResource('employee-documents', EmployeeDocumentController::class);
    
    // Designation Management
    Route::apiResource('designations', DesignationController::class);
    Route::get('/designations/create/form-data', [DesignationController::class, 'create']);
    Route::get('/designations/{id}/form-data', [DesignationController::class, 'edit'])->whereNumber('id');
    
    // Attendance Management
    Route::apiResource('attendance-records', AttendanceRecordController::class);
    
    // Leave Management
    Route::apiResource('leaves', LeaveController::class);
    Route::apiResource('leave-types', LeaveTypeController::class);
    
    // Salary Management
    Route::apiResource('salaries', SalaryController::class);
    
    // Currency Management
    Route::apiResource('currencies', CurrencyController::class);
    
    // Audit Logs (Read-only)
    Route::apiResource('audit-logs', AuditLogController::class)->only(['index', 'show']);
});
