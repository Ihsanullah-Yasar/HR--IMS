<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSalaryRequest extends FormRequest
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
            'currency_code' => 'sometimes|exists:currencies,code',
            'base_amount' => 'sometimes|numeric|min:0',
            'components' => 'sometimes|nullable|array',
            'components.*.name' => 'required_with:components|string|max:100',
            'components.*.amount' => 'required_with:components|numeric|min:0',
            'components.*.type' => 'required_with:components|string|in:allowance,deduction',
            'effective_from' => 'sometimes|date',
            'effective_to' => 'sometimes|nullable|date|after:effective_from',
        ];
    }
}
