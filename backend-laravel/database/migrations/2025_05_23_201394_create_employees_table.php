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
            $table->id();
            $table->string('name'); // Multi-language first name
            $table->string('gender_type')->nullable();
            $table->string('marital_status')->nullable();
            $table->date('date_of_birth');
            $table->date('date_of_joining');
            $table->date('date_of_leaving')->nullable();
            $table->string('timezone', 50)->default('UTC');
            $table->boolean('consent_given')->default(false);
            $table->timestamp('data_retention_until')->nullable();

            // Audit
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('designation_id')->constrained('designations')->restrictOnDelete();
            $table->index(['department_id', 'date_of_joining']);
            $table->comment('GDPR-compliant employee master data');
            //logical constraints
            $table->check('date_of_leaving IS NULL OR date_of_leaving >= date_of_joining');
            $table->check('date_of_birth < date_of_joining');
            $table->index('data_retention_until');
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
