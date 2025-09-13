import { FilterConfig } from "@/lib/Types/filter";

export const attendanceSortOptions = [
  { value: "log_date", label: "Date" },
  { value: "check_in", label: "Check In Time" },
  { value: "check_out", label: "Check Out Time" },
  { value: "hours_worked", label: "Hours Worked" },
  { value: "created_at", label: "Created Date" },
];

export const attendanceFilterConfig: FilterConfig[] = [
  {
    key: "employee_name",
    label: "Employee Name",
    type: "text",
    placeholder: "Search by employee name...",
  },
  {
    key: "department_name",
    label: "Department",
    type: "text",
    placeholder: "Search by department...",
  },
  {
    key: "source",
    label: "Source",
    type: "select",
    options: [
      { value: "biometric", label: "Biometric" },
      { value: "manual", label: "Manual" },
      { value: "mobile_app", label: "Mobile App" },
      { value: "web_portal", label: "Web Portal" },
    ],
  },
  {
    key: "date_range",
    label: "Date Range",
    type: "date-range",
    placeholder: "Select date range...",
  },
  {
    key: "employee_id",
    label: "Employee ID",
    type: "number",
    placeholder: "Enter employee ID...",
  },
];
