<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => 'sometimes|exists:employees,id',
            'date' => 'sometimes|date|before_or_equal:today',
            'check_in_time' => 'sometimes|date_format:H:i:s',
            'check_out_time' => 'sometimes|nullable|date_format:H:i:s|after:check_in_time',
            'total_hours' => 'sometimes|nullable|numeric|min:0|max:24',
            'status' => 'sometimes|string|in:present,absent,late,leave,half_day',
            'notes' => 'sometimes|nullable|string|max:500',
        ];
    }
}
