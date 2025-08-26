<?php

namespace Database\Factories;

use App\Models\DepartmentManager;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentManagerFactory extends Factory
{
    protected $model = DepartmentManager::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::inRandomOrder()->first()?->id ?? Department::factory(),
            'employee_id' => Employee::inRandomOrder()->first()?->id ?? Employee::factory(),
            'start_date' => $this->faker->dateTimeBetween('-1 years', 'now'),
            'end_date' => null,
            'is_active' => true,
        ];
    }
}
