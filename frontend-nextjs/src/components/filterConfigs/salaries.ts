import { FilterConfig } from "@/components/table-filters";

export const salaryFilterConfig: FilterConfig[] = [
  {
    key: "employee.name",
    label: "Employee Name",
    type: "text",
    placeholder: "Search by employee name...",
  },
  {
    key: "currency_code",
    label: "Currency",
    type: "select",
    placeholder: "Select currency...",
    options: [
      { value: "USD", label: "USD - US Dollar" },
      { value: "EUR", label: "EUR - Euro" },
      { value: "GBP", label: "GBP - British Pound" },
      { value: "JPY", label: "JPY - Japanese Yen" },
      { value: "CAD", label: "CAD - Canadian Dollar" },
      { value: "AUD", label: "AUD - Australian Dollar" },
      { value: "CHF", label: "CHF - Swiss Franc" },
      { value: "CNY", label: "CNY - Chinese Yuan" },
      { value: "INR", label: "INR - Indian Rupee" },
      { value: "BRL", label: "BRL - Brazilian Real" },
    ],
  },
  {
    key: "effective_from",
    label: "Effective From",
    type: "date",
    placeholder: "Select effective from date...",
  },
  {
    key: "effective_to",
    label: "Effective To",
    type: "date",
    placeholder: "Select effective to date...",
  },
  {
    key: "base_amount_min",
    label: "Min Base Amount",
    type: "number",
    placeholder: "Minimum base amount...",
  },
  {
    key: "base_amount_max",
    label: "Max Base Amount",
    type: "number",
    placeholder: "Maximum base amount...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status...",
    options: [
      { value: "current", label: "Current" },
      { value: "historical", label: "Historical" },
      { value: "future", label: "Future" },
    ],
  },
];

export const salarySortOptions = [
  { value: "base_amount", label: "Base Amount" },
  { value: "effective_from", label: "Effective From" },
  { value: "effective_to", label: "Effective To" },
  { value: "created_at", label: "Created Date" },
  { value: "employee.name", label: "Employee Name" },
  { value: "currency_code", label: "Currency" },
];

// Additional filter configurations for specific use cases
export const employeeSalaryFilterConfig: FilterConfig[] = [
  {
    key: "effective_from",
    label: "Effective From",
    type: "date",
    placeholder: "Select effective from date...",
  },
  {
    key: "effective_to",
    label: "Effective To",
    type: "date",
    placeholder: "Select effective to date...",
  },
  {
    key: "base_amount_min",
    label: "Min Base Amount",
    type: "number",
    placeholder: "Minimum base amount...",
  },
  {
    key: "base_amount_max",
    label: "Max Base Amount",
    type: "number",
    placeholder: "Maximum base amount...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status...",
    options: [
      { value: "current", label: "Current" },
      { value: "historical", label: "Historical" },
      { value: "future", label: "Future" },
    ],
  },
];

export const salaryHistoryFilterConfig: FilterConfig[] = [
  {
    key: "effective_from",
    label: "From Date",
    type: "date",
    placeholder: "Select from date...",
  },
  {
    key: "effective_to",
    label: "To Date",
    type: "date",
    placeholder: "Select to date...",
  },
  {
    key: "base_amount_min",
    label: "Min Amount",
    type: "number",
    placeholder: "Minimum amount...",
  },
  {
    key: "base_amount_max",
    label: "Max Amount",
    type: "number",
    placeholder: "Maximum amount...",
  },
];
