<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceRecordFactory> */
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'check_in',
        'check_out',
        'source',
        'hours_worked',
        'log_date',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'log_date' => 'date',
        'hours_worked' => 'decimal:2',
    ];

    /**
     * 🔹 Relationship: An attendance record belongs to an employee.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * 🔹 Scope: Filter by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('log_date', [$startDate, $endDate]);
    }

    /**
     * 🔹 Scope: Filter by employee
     */
    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * 🔹 Scope: Today's attendance
     */
    public function scopeToday($query)
    {
        return $query->where('log_date', today());
    }

    /**
     * 🔹 Scope: This month's attendance
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('log_date', now()->month)
                    ->whereYear('log_date', now()->year);
    }
}
