<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'image' => $this->faker->imageUrl(200, 200, 'people'),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'), // demo password
            'timezone' => $this->faker->timezone(),
            'consent_given' => $this->faker->boolean(90),
            'data_retention_until' => null,
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
            'remember_token' => Str::random(10),
        ];
    }
}
