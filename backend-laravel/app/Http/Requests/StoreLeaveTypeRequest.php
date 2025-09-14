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
            'code' => 'required|string|max:10|unique:leave_types,code',
            'name' => 'required|array',
            'name.en' => 'required|string|max:100',
            'name.ar' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'days_per_year' => 'required|integer|min:0|max:365',
            'is_paid' => 'boolean',
            'is_active' => 'boolean',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
        ];
    }
}
