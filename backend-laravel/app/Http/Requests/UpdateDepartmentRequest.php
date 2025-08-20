<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
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
        $departmentId = $this->route('department');

        return [
            'code' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('departments', 'code')->ignore($departmentId, 'd_id'),
                'regex:/^[A-Z0-9-]+$/',
            ],
            'name' => [
                'sometimes',
                'string',
                'max:255',
            ],
            'timezone' => [
                'sometimes',
                'string',
                'max:50',
            ],
            'parent_department_id' => [
                'nullable',
                'exists:departments,d_id',
            ],
            'manager_id' => [
                'nullable',
                'exists:users,id',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.unique' => 'This department code already exists.',
            'code.regex' => 'Department code must contain only uppercase letters, numbers, and hyphens.',
            'parent_department_id.exists' => 'Selected parent department does not exist.',
            'manager_id.exists' => 'Selected manager does not exist.',
        ];
    }
}
