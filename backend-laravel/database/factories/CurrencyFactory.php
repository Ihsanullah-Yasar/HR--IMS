<?php

namespace Database\Factories;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

class CurrencyFactory extends Factory
{
    protected $model = Currency::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->currencyCode(),
            'name' => ['en' => $this->faker->currencyCode() . ' currency'],
            'symbol' => $this->faker->randomElement(['$', '€', '£', '¥']),
            'decimal_places' => 2,
            'is_active' => true,
        ];
    }
}
