import type { FilterConfig, SortOption } from "../table-filters";

export const employeeSortOptions: SortOption[] = [
  { label: "Name", value: "name" },
  { label: "Gender", value: "gender_type" },
  { label: "Department", value: "department.name" },
  { label: "Designation", value: "designation.code" },
  { label: "Date of Joining", value: "date_of_joining" },
  { label: "Creation Date", value: "created_at" },
];

export const employeeFilterConfig: FilterConfig[] = [
  { label: "Name", value: "name", type: "text" },
  {
    label: "Gender",
    value: "gender_type",
    type: "select",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  { label: "Department", value: "department.name", type: "text" },
  { label: "Designation", value: "designation.code", type: "text" },
  { label: "User", value: "user.name", type: "text" },
];
