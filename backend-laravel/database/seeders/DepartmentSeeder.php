<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        Department::factory()->create(['code' => 'DEPT-HR', 'name' => 'Human Resources']);
        Department::factory()->create(['code' => 'DEPT-IT', 'name' => 'Information Technology']);
        Department::factory()->create(['code' => 'DEPT-FIN', 'name' => 'Finance']);
        Department::factory()->create(['code' => 'DEPT-SALES', 'name' => 'Sales']);
        Department::factory()->create(['code' => 'DEPT-MKT', 'name' => 'Marketing']);
    }
}
