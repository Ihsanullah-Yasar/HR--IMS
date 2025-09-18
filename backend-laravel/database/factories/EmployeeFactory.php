<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        $joiningDate = $this->faker->dateTimeBetween('-5 years', 'now');
        return [
            'name' => $this->faker->name(),
            'gender_type' => $this->faker->randomElement(['male', 'female', 'other']),
            'marital_status' => $this->faker->randomElement(['single', 'married']),
            'date_of_birth' => $this->faker->dateTimeBetween('-60 years', '-18 years'),
            'date_of_joining' => $joiningDate,
            'date_of_leaving' => $this->faker->boolean(10) ? $this->faker->dateTimeBetween($joiningDate, 'now') : null,
            'timezone' => $this->faker->timezone(),
            'consent_given' => true,
            'data_retention_until' => null,
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
            'user_id' => User::factory(),
            'department_id' => Department::inRandomOrder()->first()?->id ?? Department::factory(),
            'designation_id' => Designation::inRandomOrder()->first()?->id ?? Designation::factory(),
        ];
    }
}
