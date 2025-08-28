<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreEmployeeDocumentRequest extends FormRequest
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
            'type' => 'required|string|max:100',
            'document' => [
                'required',
                File::types(['pdf','jpg','jpeg','png','doc','docx'])
                    ->max(10 * 1024), // 10 MB
            ],
            'expiry_date' => 'nullable|date|after:today',
            'metadata' => 'nullable|array',
        ];
    }
}
