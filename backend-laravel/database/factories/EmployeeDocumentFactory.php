<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeDocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'type' => $this->faker->randomElement(['contract', 'id_proof', 'certificate']),
            'path' => 'docs/' . $this->faker->uuid() . '.pdf',
            'expiry_date' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('now', '+5 years') : null,
            'metadata' => json_encode(['issuer' => $this->faker->company()]),
        ];
    }
}
