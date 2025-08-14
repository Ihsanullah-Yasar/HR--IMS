<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateAuditLogsTable extends Migration
{
    public function up()
    {
        // Create parent partitioned table with composite primary key
        DB::statement('
            CREATE TABLE audit_logs (
                id BIGINT NOT NULL,
                table_name VARCHAR(50) NOT NULL,
                record_id BIGINT NOT NULL,
                operation VARCHAR(10) NOT NULL,
                old_values JSONB NULL,
                new_values JSONB NULL,
                performed_by BIGINT NULL,
                performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                log_date DATE NOT NULL,
                PRIMARY KEY (log_date, id)
            ) PARTITION BY RANGE (log_date)
        ');

        // Create initial partition
        DB::statement('
            CREATE TABLE audit_logs_' . date('Y') . '
            PARTITION OF audit_logs
            FOR VALUES FROM (\'' . date('Y') . '-01-01\') TO (\'' . (date('Y') + 1) . '-01-01\')
        ');
    }

    public function down()
    {
        Schema::dropIfExists('audit_logs');
    }
}
