<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveFactory extends Factory
{
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 years', 'now');
        $end = (clone $start)->modify('+' . rand(1, 10) . ' days');

        return [
            'employee_id' => Employee::factory(),
            'leave_type_id' => LeaveType::inRandomOrder()->first()?->id ?? LeaveType::factory(),
            'start_date' => $start,
            'end_date' => $end,
            'approved_by' => null,
            'approved_at' => null,
            'reason' => $this->faker->sentence(6),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
        ];
    }
}
