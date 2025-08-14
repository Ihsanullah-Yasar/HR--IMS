<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

// Core employee master data table
return new class extends Migration {
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id('e_id');
            $table->foreignId('user_id')->nullable()->unique();
            $table->string('first_name'); // Multi-language first name
            $table->string('last_name');
            $table->foreignId('department_id');
            $table->foreignId('designation_id');
            $table->string('gender_type')->nullable();
            $table->string('marital_status')->nullable();
            $table->date('date_of_birth');
            $table->date('date_of_joining');
            $table->string('timezone', 50)->default('UTC');
            $table->boolean('consent_given')->default(false);
            $table->timestamp('data_retention_until')->nullable();

            // Audit columns
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->foreignId('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('department_id')->references('d_id')->on('departments')->onDelete('cascade');
            $table->index(['department_id', 'date_of_joining']);
            $table->comment('GDPR-compliant employee master data');
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
