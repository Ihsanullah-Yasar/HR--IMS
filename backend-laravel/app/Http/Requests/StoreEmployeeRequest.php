<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'gender_type' => 'nullable|string|in:male,female,other',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'date_of_birth' => 'required|date|before:today',
            'date_of_joining' => 'required|date|after_or_equal:date_of_birth',
            'date_of_leaving' => 'nullable|date|after_or_equal:date_of_joining',
            'timezone' => 'nullable|string|max:50',
            'consent_given' => 'boolean',
            'data_retention_until' => 'nullable|date|after:today',
            'user_id' => 'nullable|exists:users,id|unique:employees,user_id',
            'department_id' => 'required|exists:departments,d_id',
            'designation_id' => 'required|exists:designations,dn_id',
        ];
    }
}
