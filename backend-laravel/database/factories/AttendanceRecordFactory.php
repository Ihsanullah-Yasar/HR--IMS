<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\AttendanceRecord;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class AttendanceRecordFactory extends Factory
{
    protected $model = AttendanceRecord::class;

    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('-30 days', 'now');
        $checkIn = Carbon::parse($checkIn->format('Y-m-d') . ' ' . $this->faker->time('H:i:s', '10:00:00'));
        
        $checkOut = null;
        $hoursWorked = null;
        
        // 90% chance of having check out
        if ($this->faker->boolean(90)) {
            $checkOut = (clone $checkIn)->addHours($this->faker->numberBetween(6, 10))->addMinutes($this->faker->numberBetween(0, 59));
            $hoursWorked = $checkIn->diffInHours($checkOut, true);
        }

        return [
            'employee_id' => Employee::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'source' => $this->faker->randomElement(['biometric', 'manual', 'mobile_app', 'web']),
            'hours_worked' => $hoursWorked,
            'log_date' => $checkIn->toDateString(),
        ];
    }
}
