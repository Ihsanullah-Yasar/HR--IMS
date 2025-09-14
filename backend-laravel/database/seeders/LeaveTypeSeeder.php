<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LeaveType;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'code' => 'ANNUAL',
                'name' => [
                    'en' => 'Annual Leave',
                    'ar' => 'إجازة سنوية'
                ],
                'description' => 'Annual vacation leave for employees',
                'days_per_year' => 21,
                'is_paid' => true,
                'is_active' => true,
                'color' => '#3B82F6',
            ],
            [
                'code' => 'SICK',
                'name' => [
                    'en' => 'Sick Leave',
                    'ar' => 'إجازة مرضية'
                ],
                'description' => 'Leave for medical reasons and illness',
                'days_per_year' => 30,
                'is_paid' => true,
                'is_active' => true,
                'color' => '#EF4444',
            ],
            [
                'code' => 'MATERNITY',
                'name' => [
                    'en' => 'Maternity Leave',
                    'ar' => 'إجازة أمومة'
                ],
                'description' => 'Leave for new mothers',
                'days_per_year' => 90,
                'is_paid' => true,
                'is_active' => true,
                'color' => '#EC4899',
            ],
            [
                'code' => 'PATERNITY',
                'name' => [
                    'en' => 'Paternity Leave',
                    'ar' => 'إجازة أبوة'
                ],
                'description' => 'Leave for new fathers',
                'days_per_year' => 14,
                'is_paid' => true,
                'is_active' => true,
                'color' => '#8B5CF6',
            ],
            [
                'code' => 'EMERGENCY',
                'name' => [
                    'en' => 'Emergency Leave',
                    'ar' => 'إجازة طوارئ'
                ],
                'description' => 'Leave for emergency situations',
                'days_per_year' => 5,
                'is_paid' => false,
                'is_active' => true,
                'color' => '#F59E0B',
            ],
            [
                'code' => 'UNPAID',
                'name' => [
                    'en' => 'Unpaid Leave',
                    'ar' => 'إجازة غير مدفوعة'
                ],
                'description' => 'Leave without pay for personal reasons',
                'days_per_year' => 0,
                'is_paid' => false,
                'is_active' => true,
                'color' => '#6B7280',
            ],
            [
                'code' => 'COMP',
                'name' => [
                    'en' => 'Compensatory Leave',
                    'ar' => 'إجازة تعويضية'
                ],
                'description' => 'Compensatory time off for overtime work',
                'days_per_year' => 0,
                'is_paid' => true,
                'is_active' => true,
                'color' => '#10B981',
            ],
            [
                'code' => 'STUDY',
                'name' => [
                    'en' => 'Study Leave',
                    'ar' => 'إجازة دراسية'
                ],
                'description' => 'Leave for educational purposes',
                'days_per_year' => 10,
                'is_paid' => true,
                'is_active' => true,
                'color' => '#6366F1',
            ],
        ];

        foreach ($leaveTypes as $leaveTypeData) {
            LeaveType::create($leaveTypeData);
        }
    }
}