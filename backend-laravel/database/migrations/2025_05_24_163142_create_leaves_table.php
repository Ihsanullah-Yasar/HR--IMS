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
        Schema::create('leaves', function (Blueprint $table) {
            $table->id('l_id');
            $table->foreignId('employee_id');
            $table->foreignId('leave_type_id');
            $table->date('start_date');
            $table->date('end_date');
            $table->foreignId('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('reason');
            $table->string('status')->default('pending'); // pending/approved/rejected
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('e_id')
                ->on('employees')
                ->onDelete('cascade');

            $table->foreign('leave_type_id')
                ->references('lt_id')
                ->on('leave_types')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
