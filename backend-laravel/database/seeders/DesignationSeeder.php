<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        Department::all()->each(function ($dept) {
            Designation::factory()->create([
                'department_id' => $dept->id,
                'code' => strtoupper($dept->code . '-MGR'),
                'title' => ['en' => 'Manager of ' . $dept->name],
            ]);

            Designation::factory()->create([
                'department_id' => $dept->id,
                'code' => strtoupper($dept->code . '-ASST'),
                'title' => ['en' => 'Assistant in ' . $dept->name],
            ]);

            Designation::factory()->create([
                'department_id' => $dept->id,
                'code' => strtoupper($dept->code . '-STAFF'),
                'title' => ['en' => 'Staff in ' . $dept->name],
            ]);
        });
    }
}
