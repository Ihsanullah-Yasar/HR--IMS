// src/configs/designationFilterConfig.ts
import type { FilterConfig, SortOption } from "../table-filters";

export const designationSortOptions: SortOption[] = [
  { label: "Title", value: "title" },
  { label: "Code", value: "code" },
  { label: "Department", value: "department.name" },
  { label: "Base Salary", value: "base_salary" },
  { label: "Creation Date", value: "created_at" },
];

export const designationFilterConfig: FilterConfig[] = [
  {
    label: "Title",
    value: "title",
    type: "text",
  },
  {
    label: "Code",
    value: "code",
    type: "text",
  },
  {
    label: "Department",
    value: "department.name",
    type: "text",
  },
  {
    label: "Status",
    value: "is_active",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];
