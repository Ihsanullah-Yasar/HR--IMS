<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class LeaveFactory extends Factory
{
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 years', 'now');
        $end = (clone $start)->modify('+' . rand(1, 10) . ' days');
        
        // Convert to Carbon instances for proper date calculation
        $startCarbon = Carbon::parse($start);
        $endCarbon = Carbon::parse($end);
        $totalDays = $startCarbon->diffInDays($endCarbon) + 1;

        return [
            'employee_id' => Employee::factory(),
            'leave_type_id' => LeaveType::inRandomOrder()->first()?->id ?? LeaveType::factory(),
            'start_date' => $start,
            'end_date' => $end,
            'total_days' => $totalDays,
            'reason' => $this->faker->sentence(6),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'approved_by' => null,
            'approved_at' => null,
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
        ];
    }
}
