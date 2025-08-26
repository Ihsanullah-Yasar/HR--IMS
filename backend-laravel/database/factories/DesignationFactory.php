<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Designation;
use Illuminate\Database\Eloquent\Factories\Factory;

class DesignationFactory extends Factory
{
    protected $model = Designation::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::inRandomOrder()->first()?->id ?? Department::factory(),
            'code' => strtoupper($this->faker->unique()->bothify('DSG-###')),
            'title' => ['en' => $this->faker->jobTitle()],
            'base_salary' => $this->faker->numberBetween(3000, 12000),
            'is_active' => true,
            'created_by' => null,
        ];
    }
}
