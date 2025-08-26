<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->jsonb('name');
            $table->integer('days_per_year');
            $table->boolean('is_paid')->default(true);
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('leave_types');
    }
};
