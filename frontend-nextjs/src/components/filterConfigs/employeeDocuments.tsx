import type { FilterConfig, SortOption } from "../table-filters";
import { DocumentType } from "@/lib/Types/employeeDocument";

const getDocumentTypeOptions = () => {
  return Object.values(DocumentType).map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
    value: type,
  }));
};

export const employeeDocumentSortOptions: SortOption[] = [
  { label: "Type", value: "type" },
  { label: "Employee", value: "employee.name" },
  { label: "Expiry Date", value: "expiry_date" },
  { label: "Creation Date", value: "created_at" },
];

export const employeeDocumentFilterConfig: FilterConfig[] = [
  {
    label: "Type",
    value: "type",
    type: "select",
    options: getDocumentTypeOptions(),
  },
  { label: "Employee", value: "employee.name", type: "text" },
  { label: "File Path", value: "path", type: "text" },
  {
    label: "Expiry Status",
    value: "expiry_status",
    type: "select",
    options: [
      { label: "Expired", value: "expired" },
      { label: "Expiring Soon", value: "expiring_soon" },
      { label: "Valid", value: "valid" },
      { label: "No Expiry", value: "no_expiry" },
    ],
  },
];
