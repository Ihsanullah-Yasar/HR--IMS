<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Salary;
use App\Models\Currency;

class SalarySeeder extends Seeder
{
    public function run(): void
    {
        Employee::all()->each(function ($emp) {
            Salary::factory()->create([
                'employee_id' => $emp->id,
                'currency_code' => Currency::inRandomOrder()->first()->code,
            ]);
        });
    }
}
