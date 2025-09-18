<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    public function definition(): array
    {
        $tables = ['users', 'employees', 'departments', 'designations', 'leaves', 'salaries'];
        $operations = ['INSERT', 'UPDATE', 'DELETE'];
        $performedAt = $this->faker->dateTimeBetween('-1 year', 'now');
        
        return [
            'id' => $this->faker->unique()->numberBetween(1, 10000),
            'table_name' => $this->faker->randomElement($tables),
            'record_id' => $this->faker->numberBetween(1, 100),
            'operation' => $this->faker->randomElement($operations),
            'old_values' => $this->faker->boolean(70) ? ['field' => 'old_value'] : null,
            'new_values' => ['field' => 'new_value'],
            'performed_by' => User::factory(),
            'performed_at' => $performedAt,
            'log_date' => $performedAt->format('Y-m-d'),
        ];
    }
}
