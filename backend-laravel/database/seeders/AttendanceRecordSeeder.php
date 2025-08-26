<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceRecordSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::all();
        $startDate = Carbon::now()->subMonth();
        $endDate = Carbon::now();

        foreach ($employees as $emp) {
            $date = clone $startDate;
            while ($date <= $endDate) {
                // 80% attendance
                if (rand(1, 100) <= 80) {
                    $checkIn = Carbon::parse($date->toDateString() . ' 09:00:00')->addMinutes(rand(0, 30));
                    $checkOut = (clone $checkIn)->addHours(8)->addMinutes(rand(0, 30));
                    DB::table('attendance_records_' . date('Y'))->insert([
                        'employee_id' => $emp->id,
                        'check_in' => $checkIn,
                        'check_out' => $checkOut,
                        'source' => 'system_seed',
                        'hours_worked' => $checkIn->diffInHours($checkOut),
                        'log_date' => $checkIn->toDateString(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                $date->addDay();
            }
        }
    }
}
