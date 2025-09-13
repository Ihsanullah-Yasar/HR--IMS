<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceRecordResource extends JsonResource
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
            'employeeId' => $this->employee_id,
            'checkIn' => $this->check_in?->toISOString(),
            'checkOut' => $this->check_out?->toISOString(),
            'source' => $this->source,
            'hoursWorked' => $this->hours_worked,
            'logDate' => $this->log_date?->toDateString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'employee' => $this->whenLoaded('employee'),
        ];
    }
}
