<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeDocument extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeDocumentFactory> */
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'type',
        'path',
        'expiry_date',
        'metadata',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'metadata' => 'array',
    ];

    /**
     * Get the employee that owns the document.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
