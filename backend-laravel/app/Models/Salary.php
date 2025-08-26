<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    /** @use HasFactory<\Database\Factories\SalaryFactory> */
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'currency_code',
        'base_amount',
        'components',
        'effective_from',
        'effective_to'
    ];

    protected $casts = [
        'components' => 'array',
        'base_amount' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];
}
