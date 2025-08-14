<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

// Organizational units with hierarchy support
return new class extends Migration {
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id('d_id');
            $table->foreignId('parent_department_id')->nullable();
            $table->string('code', 20)->unique();
            $table->string('name'); // Multi-language department name
            $table->foreignId('manager_id')->nullable(); // FK to employees
            $table->string('timezone', 50)->default('UTC');

            // Audit columns
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->foreignId('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('departments', function (Blueprint $table) {

            $table->foreign('parent_department_id')
                ->references('d_id')
                ->on('departments')
                ->onDelete('set null');
            $table->comment('Department hierarchy with timezone support');
        });
    }

    public function down()
    {
        Schema::dropIfExists('departments');
    }
};
