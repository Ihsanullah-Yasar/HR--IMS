import { FilterConfig, SortOption } from "@/lib/Types/filter";

export const leaveFilterConfig: FilterConfig[] = [
  {
    key: "employee.name",
    label: "Employee",
    type: "text",
    placeholder: "Search by employee name...",
  },
  {
    key: "leaveType.name",
    label: "Leave Type",
    type: "text",
    placeholder: "Search by leave type...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "employee_id",
    label: "Employee",
    type: "select",
    options: [], // Will be populated dynamically
  },
  {
    key: "leave_type_id",
    label: "Leave Type",
    type: "select",
    options: [], // Will be populated dynamically
  },
];

export const leaveSortOptions: SortOption[] = [
  { value: "start_date", label: "Start Date" },
  { value: "end_date", label: "End Date" },
  { value: "status", label: "Status" },
  { value: "created_at", label: "Created Date" },
  { value: "total_days", label: "Total Days" },
];
