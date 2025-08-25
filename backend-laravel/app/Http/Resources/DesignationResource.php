<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'dn_id' => $this->dn_id,
            'departmentId' => $this->department_id,
            'code' => $this->code,
            'title' => $this->title,
            'baseSalary' => $this->base_salary,
            'isActive' => $this->is_active,
            'createdBy' => $this->created_by,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
            'department' => $this->whenLoaded('department'),
            'createdByBser' => $this->whenLoaded('createdBy'),
            'updatedByUser' => $this->whenLoaded('updatedBy'),
            'deletedByUer' => $this->whenLoaded('deletedBy'),
        ];
    }
}
