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
            $table->id();
            $table->foreignId('parent_department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('code', 20)->unique();
            $table->string('name'); // consider normalized translations table
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('timezone', 50)->default('UTC');

            // Audit
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('parent_id'); // for hierarchy queries
            $table->comment('Department hierarchy with timezone support');
        });
    }

    public function down()
    {
        Schema::dropIfExists('departments');
    }
};
