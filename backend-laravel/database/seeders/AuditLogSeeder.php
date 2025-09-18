<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        // Create some sample audit logs for demonstration
        $users = User::all();
        
        if ($users->count() > 0) {
            $tables = ['users', 'employees', 'departments', 'designations', 'leaves', 'salaries'];
            $operations = ['INSERT', 'UPDATE', 'DELETE'];
            
            // Insert directly into the partitioned table using raw SQL
            // Generate dates only within 2025 to match the partition constraint
            for ($i = 1; $i <= 50; $i++) {
                $performedAt = Carbon::create(2025, rand(1, 12), rand(1, 28), rand(0, 23), rand(0, 59), rand(0, 59));
                $logDate = $performedAt->toDateString();
                
                DB::table('audit_logs_' . date('Y'))->insert([
                    'id' => $i,
                    'table_name' => $tables[array_rand($tables)],
                    'record_id' => rand(1, 100),
                    'operation' => $operations[array_rand($operations)],
                    'old_values' => rand(0, 1) ? json_encode(['field' => 'old_value']) : null,
                    'new_values' => json_encode(['field' => 'new_value']),
                    'performed_by' => $users->random()->id,
                    'performed_at' => $performedAt,
                    'log_date' => $logDate,
                ]);
            }
        }
    }
}
