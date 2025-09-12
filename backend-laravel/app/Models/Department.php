<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'parent_department_id',
        'code',
        'name',
        'manager_id',
        'timezone',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * 🔹 Relationship: A department can have many users (employees).
     */
    public function employees()
    {
        return $this->hasMany(Employee::class, 'department_id', 'id');
    }

    /**
     * 🔹 Relationship: A department may have one manager (who is also a user).
     */
    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /**
     * 🔹 Relationship: Parent department (for hierarchy).
     */
    public function parentDepartment()
    {
        return $this->belongsTo(Department::class, 'parent_department_id', 'id');
    }

    /**
     * 🔹 Active manager relationship via DepartmentManager
     */
    public function currentManager()
    {
        return $this->hasOne(DepartmentManager::class, 'department_id')
            ->where('is_active', true);
    }

    /**
     * 🔹 Relationship: Child departments (sub-departments).
     */
    public function childDepartments()
    {
        return $this->hasMany(Department::class, 'parent_department_id', 'id');
    }

    /**
     * 🔹 Relationship: User who created the department.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * 🔹 Relationship: User who last updated the department.
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * 🔹 Relationship: User who deleted the department.
     */
    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
