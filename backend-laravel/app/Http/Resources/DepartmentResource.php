<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'dId' => $this->d_id,
            'code' => $this->code,
            'name' => $this->name,
            'timezone' => $this->timezone,

            // Relations as human-readable names
            'parentDepartment' => $this->parentDepartment?->name,
            'manager' => $this->manager?->name,

            // Audit users as names
            'createdByUser' => $this->createdBy?->name,
            'updatedByUser' => $this->updatedBy?->name,
            'deletedByUser' => $this->deletedBy?->name,

            // Timestamps in ISO-8601 strings
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
            'deletedAt' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
