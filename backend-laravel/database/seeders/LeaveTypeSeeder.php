<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LeaveType;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        LeaveType::factory()->create(['code' => 'SICK', 'name' => ['en' => 'Sick Leave'], 'days_per_year' => 10, 'is_paid' => true]);
        LeaveType::factory()->create(['code' => 'ANNUAL', 'name' => ['en' => 'Annual Leave'], 'days_per_year' => 20, 'is_paid' => true]);
        LeaveType::factory()->create(['code' => 'UNPAID', 'name' => ['en' => 'Unpaid Leave'], 'days_per_year' => 30, 'is_paid' => false]);
        LeaveType::factory()->create(['code' => 'MATERNITY', 'name' => ['en' => 'Maternity Leave'], 'days_per_year' => 90, 'is_paid' => true]);
    }
}
