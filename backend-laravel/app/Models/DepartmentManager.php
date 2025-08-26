<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentManager extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'employee_id',
        'start_date',
        'end_date',
        'is_active'
    ];
}
