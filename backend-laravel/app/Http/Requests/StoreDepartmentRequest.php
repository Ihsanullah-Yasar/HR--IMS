<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
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
            'code' => [
                'required',
                'string',
                'max:20',
                'unique:departments,code',
                'regex:/^[A-Z0-9-]+$/',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'timezone' => [
                'required',
                'string',
                'max:50',
            ],
            'parent_department_id' => [
                'nullable',
                'exists:departments,id',
            ],
            'manager_employee_id' => [
                'nullable',
                'exists:employees,id',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Department code is required.',
            'code.unique' => 'This department code already exists.',
            'code.regex' => 'Department code must contain only uppercase letters, numbers, and hyphens.',
            'name.required' => 'Department name is required.',
            'parent_department_id.exists' => 'Selected parent department does not exist.',
            'manager_employee_id.exists' => 'Selected manager does not exist.',
        ];
    }
}
