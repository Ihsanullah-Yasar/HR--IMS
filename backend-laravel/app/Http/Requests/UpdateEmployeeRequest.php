<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'gender_type' => 'sometimes|nullable|string|in:male,female,other',
            'marital_status' => 'sometimes|nullable|string|in:single,married,divorced,widowed',
            'date_of_birth' => 'sometimes|date|before:today',
            'date_of_joining' => 'sometimes|date|after_or_equal:date_of_birth',
            'date_of_leaving' => 'sometimes|nullable|date|after_or_equal:date_of_joining',
            'timezone' => 'sometimes|nullable|string|max:50',
            'consent_given' => 'sometimes|boolean',
            'data_retention_until' => 'sometimes|nullable|date|after:today',
            'user_id' => [
                'sometimes',
                'nullable',
                'exists:users,id',
                Rule::unique('employees', 'user_id')->ignore($this->employee->id),
            ],
            'department_id' => 'sometimes|exists:departments,id',
            'designation_id' => 'sometimes|exists:designations,id',
        ];
    }
}
