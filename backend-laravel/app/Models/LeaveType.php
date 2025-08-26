<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    /** @use HasFactory<\Database\Factories\LeaveTypeFactory> */
    use HasFactory;
    protected $fillable = [
        'code',
        'name',
        'days_per_year',
        'is_paid'
    ];

    protected $casts = [
        'name' => 'array',  // ✅ This tells Laravel to auto-convert array ↔ JSON
        'is_paid' => 'boolean',
    ];
}
