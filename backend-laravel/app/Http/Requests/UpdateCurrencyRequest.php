<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurrencyRequest extends FormRequest
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
                'size:3',
                'regex:/^[A-Z]{3}$/',
                Rule::unique('currencies', 'code')->ignore($this->currency->id),
            ],
            'name' => 'sometimes|array',
            'name.en' => 'sometimes|string|max:100',
            'name.ar' => 'sometimes|nullable|string|max:100',
            'symbol' => 'sometimes|string|max:10',
            'decimal_places' => 'sometimes|integer|min:0|max:4',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
