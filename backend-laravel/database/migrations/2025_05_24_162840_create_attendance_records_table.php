<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        DB::statement('
            CREATE TABLE attendance_records (
                id BIGSERIAL,
                employee_id BIGINT NOT NULL,
                check_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                check_out TIMESTAMPTZ,
                source VARCHAR(50) NOT NULL DEFAULT \'biometric\',
                hours_worked DECIMAL(5,2),
                log_date DATE NOT NULL,
                created_at TIMESTAMPTZ,
                updated_at TIMESTAMPTZ,
                PRIMARY KEY (log_date, id)
            ) PARTITION BY RANGE (log_date)
        ');

        DB::statement('
            CREATE OR REPLACE FUNCTION set_attendance_log_date()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.log_date := NEW.check_in::DATE;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        ');

        DB::statement('
            CREATE TRIGGER trg_set_attendance_log_date
            BEFORE INSERT ON attendance_records
            FOR EACH ROW
            EXECUTE FUNCTION set_attendance_log_date()
        ');

        DB::statement('
            CREATE TABLE attendance_records_' . date('Y') . ' PARTITION OF attendance_records
            FOR VALUES FROM (\'' . date('Y') . '-01-01\') TO (\'' . (date('Y') + 1) . '-01-01\')
        ');

        DB::statement('
            ALTER TABLE attendance_records
            ADD CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        ');
    }
    public function down()
    {
        DB::statement('DROP TRIGGER IF EXISTS trg_set_attendance_log_date ON attendance_records');
        DB::statement('DROP FUNCTION IF EXISTS set_attendance_log_date()');
        Schema::dropIfExists('attendance_records');
    }
};
