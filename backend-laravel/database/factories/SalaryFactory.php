<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalaryFactory extends Factory
{
    public function definition(): array
    {
        $from = $this->faker->dateTimeBetween('-3 years', 'now');
        return [
            'employee_id' => Employee::factory(),
            'currency_code' => Currency::inRandomOrder()->first()?->code ?? 'USD',
            'base_amount' => $this->faker->numberBetween(3000, 15000),
            'components' => json_encode([
                'allowances' => [
                    ['type' => 'transport', 'amount' => 100],
                    ['type' => 'meal', 'amount' => 50],
                ],
                'deductions' => [
                    ['type' => 'tax', 'amount' => 200],
                ]
            ]),
            'effective_from' => $from,
            'effective_to' => null,
        ];
    }
}
