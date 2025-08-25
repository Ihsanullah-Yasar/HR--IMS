<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'genderType' => $this->gender_type,
            'maritalStatus' => $this->marital_status,
            'dateOfBirth' => $this->date_of_birth,
            'dateOfJoining' => $this->date_of_joining,
            'dateOfLeaving' => $this->date_of_leaving,
            'timezone' => $this->timezone,
            'consentGiven' => $this->consent_given,
            'dataRetentionUntil' => $this->data_retention_until,
            'userId' => $this->user_id,
            'departmentId' => $this->department_id,
            'designationId' => $this->designation_id,
            'createdBy' => $this->created_by,
            'updatedBy' => $this->updated_by,
            'deletedBy' => $this->deleted_by,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
            'user' => $this->whenLoaded('user'),
            'department' => $this->whenLoaded('department'),
            'designation' => $this->whenLoaded('designation'),
            'createdByUser' => $this->whenLoaded('createdBy'),
            'updatedByUser' => $this->whenLoaded('updatedBy'),
            'deletedByUser' => $this->whenLoaded('deletedBy'),
        ];
    }
}
