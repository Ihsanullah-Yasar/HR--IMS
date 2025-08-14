<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('employee_id');
            $table->string('type'); // contract, id_proof
            $table->string('path');
            $table->date('expiry_date')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('e_id')
                ->on('employees')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
    }
};
