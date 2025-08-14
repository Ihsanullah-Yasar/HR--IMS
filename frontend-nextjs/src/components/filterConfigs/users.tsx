// src/configs/userFilterConfig.ts
import type { FilterConfig, SortOption } from "../table-filters"; // adjust the path to where your FilterConfig type lives

export const userSortOptions: SortOption[] = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Created At", value: "created_at" },
];

export const userFilterConfig: FilterConfig[] = [
  {
    label: "Name",
    value: "name",
    type: "text", // input box
  },
  {
    label: "Email",
    value: "email",
    type: "text", // input box
  },
  {
    label: "Status",
    value: "status",
    type: "select", // dropdown
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    label: "Created At",
    value: "created_at",
    type: "date", // date picker
  },
];
