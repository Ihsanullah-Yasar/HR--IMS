<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'parent_department_id' => null,
            'code' => strtoupper($this->faker->unique()->bothify('DEPT-###')),
            'name' => $this->faker->unique()->company(),
            'manager_id' => null,
            'timezone' => $this->faker->timezone(),
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
        ];
    }
}
