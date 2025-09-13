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
            'check_in' => 'sometimes|date',
            'check_out' => 'sometimes|nullable|date|after:check_in',
            'source' => 'sometimes|string|in:biometric,manual,mobile_app,web_portal',
            'hours_worked' => 'sometimes|nullable|numeric|min:0|max:24',
            'log_date' => 'sometimes|date|before_or_equal:today',
        ];
    }
}
