<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\DepartmentManager;
use App\Models\Employee;
use Database\Factories\DepartmentManagerFactory;

class DepartmentManagerSeeder extends Seeder
{
    public function run(): void
    {
        Department::all()->each(function ($dept) {
            $emp = Employee::inRandomOrder()->first();
            if ($emp) {
                DepartmentManager::factory()->create([
                    'department_id' => $dept->id,
                    'employee_id' => $emp->id,
                ]);
            }
        });
    }
}
