<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UpdateEmployeeDocumentRequest extends FormRequest
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
            'type' => 'sometimes|string|max:100',
            'document' => [
                'sometimes',
                File::types(['pdf','jpg','jpeg','png','doc','docx'])
                    ->max(10 * 1024), // 10 MB
            ],
            'expiry_date' => 'sometimes|nullable|date|after:today',
            'metadata' => 'sometimes|nullable|array',
        ];
    }
}
