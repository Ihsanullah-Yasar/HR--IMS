// src/configs/userFilterConfig.ts
import type { FilterConfig, SortOption } from "../table-filters"; // adjust the path to where your FilterConfig type lives

export const departmentSortOptions: SortOption[] = [
  { label: "Name", value: "name" },
  { label: "Code", value: "code" },
  { label: "Creation Date", value: "created_at" },
];

export const departmentFilterConfig: FilterConfig[] = [
  {
    label: "Name",
    value: "name",
    type: "text", // input box
  },
  {
    label: "code",
    value: "code",
    type: "text", // input box
  },
  {
    label: "Manager",
    value: "manager.name",
    type: "text", // input box
  },
  //   {
  //     label: "Status",
  //     value: "status",
  //     type: "select", // dropdown
  //     options: [
  //       { label: "Active", value: "active" },
  //       { label: "Inactive", value: "inactive" },
  //     ],
  //   },
  {
    label: "Creation Date",
    value: "created_at",
    type: "date", // date picker
  },
];
