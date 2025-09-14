import { FilterConfig, SortOption } from "@/lib/Types/filter";

export const leaveTypeFilterConfig: FilterConfig[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    placeholder: "Search by name...",
  },
  {
    key: "code",
    label: "Code",
    type: "text",
    placeholder: "Search by code...",
  },
  {
    key: "is_paid",
    label: "Paid Status",
    type: "select",
    options: [
      { value: "true", label: "Paid" },
      { value: "false", label: "Unpaid" },
    ],
  },
  {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
];

export const leaveTypeSortOptions: SortOption[] = [
  { value: "name", label: "Name" },
  { value: "code", label: "Code" },
  { value: "days_per_year", label: "Days per Year" },
  { value: "created_at", label: "Created Date" },
];
