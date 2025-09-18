<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\LeaveType;
use App\Models\Leave;

class LeaveSeeder extends Seeder
{
    public function run(): void
    {
        Employee::all()->each(function ($emp) {
            $leaveTypes = LeaveType::all();
            if ($leaveTypes->count() > 0) {
                Leave::factory(rand(1, 3))->create([
                    'employee_id' => $emp->id,
                    'leave_type_id' => $leaveTypes->random()->id,
                ]);
            }
        });
    }
}
