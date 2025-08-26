<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\EmployeeDocument;

class EmployeeDocumentSeeder extends Seeder
{
    public function run(): void
    {
        Employee::all()->each(function ($emp) {
            EmployeeDocument::factory(rand(1, 3))->create([
                'employee_id' => $emp->id,
            ]);
        });
    }
}
