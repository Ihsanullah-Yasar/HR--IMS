import { ApiResponse, Meta } from "@/lib/Types/api";
import { AttendanceRecord, AttendanceCreateData, AttendanceUpdateData, AttendanceCreateFormData } from "@/lib/Types/attendance";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Get all attendance records with filters and pagination
export async function getAttendanceRecords(searchParams?: string): Promise<ApiResponse<AttendanceRecord[]>> {
  const url = `${API_BASE_URL}/attendance-records${searchParams ? `?${searchParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch attendance records');
  }

  return response.json();
}

// Get single attendance record
export async function getAttendanceRecord(id: number): Promise<ApiResponse<AttendanceRecord>> {
  const response = await fetch(`${API_BASE_URL}/attendance-records/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch attendance record');
  }

  return response.json();
}

// Create attendance record
export async function createAttendanceRecord(data: AttendanceCreateData): Promise<ApiResponse<AttendanceRecord>> {
  // Convert camelCase to snake_case for backend
  // Convert camelCase to snake_case for backend and ensure proper date formatting
  const logDate = data.logDate && data.logDate.trim() !== '' ? data.logDate : new Date().toISOString().split('T')[0];
  
  const backendData = {
    employee_id: data.employeeId,
    check_in: data.checkIn,
    check_out: data.checkOut,
    source: data.source,
    hours_worked: data.hoursWorked,
    log_date: logDate,
  };

  console.log('Sending attendance data:', backendData);

  const response = await fetch(`${API_BASE_URL}/attendance-records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create attendance record');
  }

  return response.json();
}

// Update attendance record
export async function updateAttendanceRecord(id: number, data: AttendanceUpdateData): Promise<ApiResponse<AttendanceRecord>> {
  // Convert camelCase to snake_case for backend
  const backendData: any = {};
  if (data.employeeId !== undefined) backendData.employee_id = data.employeeId;
  if (data.checkIn !== undefined) backendData.check_in = data.checkIn;
  if (data.checkOut !== undefined) backendData.check_out = data.checkOut;
  if (data.source !== undefined) backendData.source = data.source;
  if (data.hoursWorked !== undefined) backendData.hours_worked = data.hoursWorked;
  if (data.logDate !== undefined) backendData.log_date = data.logDate;

  const response = await fetch(`${API_BASE_URL}/attendance-records/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update attendance record');
  }

  return response.json();
}

// Delete attendance record
export async function deleteAttendanceRecord(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/attendance-records/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete attendance record');
  }

  return response.json();
}

// Get form data for creating attendance record
export async function getAttendanceCreateFormData(): Promise<ApiResponse<AttendanceCreateFormData>> {
  const response = await fetch(`${API_BASE_URL}/attendance-records/create/form-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch form data');
  }

  return response.json();
}

// Bulk create attendance records
export async function bulkCreateAttendanceRecords(records: AttendanceCreateData[]): Promise<ApiResponse<AttendanceRecord[]>> {
  // Convert camelCase to snake_case for backend and ensure proper date formatting
  const backendRecords = records.map(record => ({
    employee_id: record.employeeId,
    check_in: record.checkIn,
    check_out: record.checkOut,
    source: record.source,
    hours_worked: record.hoursWorked,
    log_date: record.logDate || new Date().toISOString().split('T')[0],
  }));

  const response = await fetch(`${API_BASE_URL}/attendance-records/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // credentials: 'include',
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create attendance records');
  }

  return response.json();
}

// Get attendance summary for an employee
export async function getEmployeeAttendanceSummary(employeeId: number, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await fetch(`${API_BASE_URL}/attendance-records/employee/${employeeId}/summary?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    //  credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch attendance summary');
  }

  return response.json();
}
