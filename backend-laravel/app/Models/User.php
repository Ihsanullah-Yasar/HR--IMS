<?php

namespace App\Models;

use App\Models\Api\Department;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'timezone',
        'consent_given',
        'image',
        'department_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'name' => 'json',
        'consent_given' => 'boolean',
    ];

    /* -------------------- 🔹 Relationships -------------------- */

    /**
     * 🔹 User belongs to a department
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'd_id');
    }

    /**
     * 🔹 User can be manager of a department
     */
    public function managedDepartment()
    {
        return $this->hasOne(Department::class, 'manager_id', 'id');
    }

    /**
     * 🔹 User who created this record
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * 🔹 User who last updated this record
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * 🔹 User who deleted this record
     */
    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
