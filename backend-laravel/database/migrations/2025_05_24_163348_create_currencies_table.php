<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->char('code', 3)->unique();
            $table->jsonb('name');
            $table->string('symbol');
            $table->integer('decimal_places')->default(2);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('currencies');
    }
};
