<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DepartmentSeeder::class,
            DesignationSeeder::class,
            EmployeeSeeder::class,
            EmployeeDocumentSeeder::class,
            LeaveTypeSeeder::class,
            LeaveSeeder::class,
            CurrencySeeder::class,
            SalarySeeder::class,
            DepartmentManagerSeeder::class,
            AttendanceRecordSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
