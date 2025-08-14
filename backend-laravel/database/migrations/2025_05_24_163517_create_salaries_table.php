<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('salaries', function (Blueprint $table) {
            $table->id('s_id');
            $table->foreignId('employee_id');
            $table->char('currency_code', 3);
            $table->decimal('base_amount', 12, 2);
            $table->jsonb('components'); // {allowances: [...], deductions: [...]}
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('e_id')
                ->on('employees')
                ->onDelete('cascade');

            $table->foreign('currency_code')
                ->references('code')
                ->on('currencies')
                ->onDelete('restrict');
        });

        DB::statement(
            "CREATE INDEX salaries_effective_range_idx ON salaries USING gist (daterange(effective_from, effective_to, '[]'))"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
