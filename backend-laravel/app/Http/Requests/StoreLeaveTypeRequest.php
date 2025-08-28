<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveTypeRequest extends FormRequest
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
            'name' => 'required|string|max:100|unique:leave_types,name',
            'description' => 'nullable|string|max:500',
            'default_days' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
        ];
    }
}
