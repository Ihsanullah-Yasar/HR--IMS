<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Currency;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        Currency::factory()->create(['code' => 'USD', 'name' => ['en' => 'US Dollar'], 'symbol' => '$']);
        Currency::factory()->create(['code' => 'EUR', 'name' => ['en' => 'Euro'], 'symbol' => '€']);
        Currency::factory()->create(['code' => 'GBP', 'name' => ['en' => 'Pound Sterling'], 'symbol' => '£']);
        Currency::factory()->create(['code' => 'JPY', 'name' => ['en' => 'Japanese Yen'], 'symbol' => '¥']);
    }
}