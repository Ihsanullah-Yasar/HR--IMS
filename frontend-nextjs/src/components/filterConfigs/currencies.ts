import { FilterConfig, SortOption } from "@/lib/Types/filter";

export const currencyFilterConfig: FilterConfig[] = [
  {
    key: "name.en",
    label: "Name",
    type: "text",
    placeholder: "Search by currency name...",
  },
  {
    key: "code",
    label: "Code",
    type: "text",
    placeholder: "Search by currency code...",
  },
  {
    key: "symbol",
    label: "Symbol",
    type: "text",
    placeholder: "Search by symbol...",
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

export const currencySortOptions: SortOption[] = [
  { value: "code", label: "Code" },
  { value: "name", label: "Name" },
  { value: "symbol", label: "Symbol" },
  { value: "decimal_places", label: "Decimal Places" },
  { value: "created_at", label: "Created Date" },
];
