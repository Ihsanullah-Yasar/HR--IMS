<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::all();
        $designations = Designation::all();

        User::all()->each(function ($user) use ($departments, $designations) {
            Employee::factory()->create([
                'user_id' => $user->id,  // each user gets at most 1 employee
                'department_id' => $departments->random()->id,
                'designation_id' => $designations->random()->id,
            ]);
        });
    }
}
