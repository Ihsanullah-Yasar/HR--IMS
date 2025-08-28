<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalaryRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'currency_code' => 'required|exists:currencies,code',
            'base_amount' => 'required|numeric|min:0',
            'components' => 'nullable|array',
            'components.*.name' => 'required_with:components|string|max:100',
            'components.*.amount' => 'required_with:components|numeric|min:0',
            'components.*.type' => 'required_with:components|string|in:allowance,deduction',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
        ];
    }
}
