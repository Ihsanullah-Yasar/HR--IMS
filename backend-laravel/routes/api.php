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
    Route::get('/employees/create', [EmployeeController::class, 'create']);
    Route::get('/employees/{id}/edit', [EmployeeController::class, 'edit'])->whereNumber('id');
    Route::apiResource('employees', EmployeeController::class);
    
    // Employee Documents
    Route::get('/employee-documents/create', [EmployeeDocumentController::class, 'create']);
    Route::get('/employee-documents/{id}/edit', [EmployeeDocumentController::class, 'edit'])->whereNumber('id');
    Route::apiResource('employee-documents', EmployeeDocumentController::class);
    
    // Designation Management
    Route::apiResource('designations', DesignationController::class);
    Route::get('/designations/create/form-data', [DesignationController::class, 'create']);
    Route::get('/designations/{id}/form-data', [DesignationController::class, 'edit'])->whereNumber('id');
    
    // Attendance Management
    Route::apiResource('attendance-records', AttendanceRecordController::class);
    Route::get('/attendance-records/create/form-data', [AttendanceRecordController::class, 'create']);
    
    // Leave Management
    Route::apiResource('leaves', LeaveController::class);
    Route::get('/leaves/create/form-data', [LeaveController::class, 'create']);
    Route::get('/leaves/{id}/form-data', [LeaveController::class, 'edit'])->whereNumber('id');
    Route::apiResource('leave-types', LeaveTypeController::class);
    Route::get('/leave-types/create/form-data', [LeaveTypeController::class, 'create']);
    Route::get('/leave-types/{id}/form-data', [LeaveTypeController::class, 'edit'])->whereNumber('id');
    
    // Salary Management
    Route::apiResource('salaries', SalaryController::class);
    
    // Currency Management
    Route::apiResource('currencies', CurrencyController::class);
    Route::get('/currencies/create/form-data', [CurrencyController::class, 'create']);
    Route::get('/currencies/{id}/form-data', [CurrencyController::class, 'edit'])->whereNumber('id');
    
    // Audit Logs (Read-only)
    Route::apiResource('audit-logs', AuditLogController::class)->only(['index', 'show']);
});
