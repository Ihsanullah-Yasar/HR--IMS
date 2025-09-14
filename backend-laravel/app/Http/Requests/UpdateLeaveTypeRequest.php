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
            'code' => [
                'sometimes',
                'string',
                'max:10',
                Rule::unique('leave_types', 'code')->ignore($this->leave_type->id),
            ],
            'name' => 'sometimes|array',
            'name.en' => 'sometimes|string|max:100',
            'name.ar' => 'sometimes|nullable|string|max:100',
            'description' => 'sometimes|nullable|string|max:500',
            'days_per_year' => 'sometimes|integer|min:0|max:365',
            'is_paid' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'color' => 'sometimes|nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
        ];
    }
}
