<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeaveTypeRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('leave_types', 'name')->ignore($this->leave_type->id),
            ],
            'description' => 'sometimes|nullable|string|max:500',
            'default_days' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'color' => 'sometimes|nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
        ];
    }
}
