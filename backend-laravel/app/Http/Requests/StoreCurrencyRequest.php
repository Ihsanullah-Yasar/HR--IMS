<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCurrencyRequest extends FormRequest
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
            'code' => 'required|string|size:3|unique:currencies,code|regex:/^[A-Z]{3}$/',
            'name' => 'required|array',
            'name.en' => 'required|string|max:100',
            'name.ar' => 'nullable|string|max:100',
            'symbol' => 'required|string|max:10',
            'decimal_places' => 'required|integer|min:0|max:4',
            'is_active' => 'boolean',
        ];
    }
}
