<?php

namespace Database\Factories;

use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaveTypeFactory extends Factory
{
    protected $model = LeaveType::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->unique()->lexify('LT-???')),
            'name' => ['en' => $this->faker->word() . ' leave'],
            'description' => $this->faker->sentence(),
            'days_per_year' => $this->faker->numberBetween(5, 30),
            'is_paid' => $this->faker->boolean(80),
            'is_active' => true,
            'color' => $this->faker->hexColor(),
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
        ];
    }
}
