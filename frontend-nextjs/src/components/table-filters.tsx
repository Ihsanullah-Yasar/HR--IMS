// src/components/ui/DynamicTableFilters.tsx

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge for chips; otherwise use a div
import { Check, ChevronDown, Search as SearchIcon, X } from "lucide-react";

// Define types
export type SortOption = {
  label: string;
  value: string;
};

type FilterType = "text" | "select" | "date"; // Extensible for more types like 'date-range'

export interface FilterConfig {
  label: string; // e.g., 'Status' for "Filter by Status"
  value: string; // Filter key (e.g., 'status', 'name') - Changed back to 'value' to resolve the error
  type: FilterType;
  options?: SortOption[]; // Required for 'select', e.g., from DB
  placeholder?: string; // Optional for 'text' types
}

interface DynamicTableFiltersProps {
  title?: string;
  sortOptions: SortOption[]; // e.g., [{label: 'Name', value: 'name'}]
  filterConfigs: FilterConfig[]; // Dynamic per model
}

interface ActiveFilter {
  key: string;
  value: string;
  fieldLabel: string;
  valueLabel: string;
}

const sortDirectionOptions: SortOption[] = [
  { label: "Ascending", value: "" },
  { label: "Descending", value: "-" },
];

export default function DynamicTableFilters({
  title = "Filters",
  sortOptions,
  filterConfigs,
}: DynamicTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Computed from URL
  const sortBy = searchParams.get("sort") || "";
  const isDescending = sortBy.startsWith("-");
  const sort = isDescending ? sortBy.slice(1) : sortBy;
  const sortDirection = isDescending ? "-" : "";

  // Compute active filters from URL
  const activeFilters: ActiveFilter[] = React.useMemo(() => {
    const filters: ActiveFilter[] = [];
    for (const [paramKey, val] of searchParams.entries()) {
      const match = paramKey.match(/^filter\[(.+)\]$/);
      if (match) {
        const key = match[1];
        const config = filterConfigs.find((c) => c.value === key);
        const fieldLabel = config?.label || key;
        let valueLabel = val;
        if (config?.type === "select" && config.options) {
          valueLabel =
            config.options.find((o) => o.value === val)?.label || val;
        }
        filters.push({ key, value: val, fieldLabel, valueLabel });
      }
    }
    return filters;
  }, [searchParams, filterConfigs]);

  // Separate text and select configs
  const textConfigs = filterConfigs.filter((c) => c.type === "text");
  const selectConfigs = filterConfigs.filter((c) => c.type === "select");

  // Local state for combined text search
  const [selectedTextField, setSelectedTextField] = React.useState(
    textConfigs.find((c) => c.value === "name")?.value ||
      textConfigs[0]?.value ||
      ""
  );
  const [searchValue, setSearchValue] = React.useState("");

  // Helper to update URL
  const updateQuery = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  // Handle sort change
  const onSortChange = (newSort: string) => {
    updateQuery((params) => {
      if (!newSort) {
        params.delete("sort");
      } else {
        params.set("sort", `${sortDirection}${newSort}`);
      }
    });
  };

  // Handle sort direction change
  const onSortDirectionChange = (newDirection: string) => {
    if (!sort) return;
    updateQuery((params) => {
      params.set("sort", `${newDirection}${sort}`);
    });
  };

  // Handle applying a text filter
  const onApplyTextFilter = () => {
    if (!selectedTextField || !searchValue.trim()) return;
    const filterKey = `filter[${selectedTextField}]`;
    updateQuery((params) => {
      params.set(filterKey, searchValue.trim());
      if (params.get("page")) params.set("page", "1");
    });
    setSearchValue(""); // Clear input after apply (optional; remove if you want to keep value)
  };

  // Handle applying a select filter for a specific key
  const onApplySelectFilter = (key: string, value: string) => {
    const filterKey = `filter[${key}]`;
    updateQuery((params) => {
      if (value.trim()) {
        params.set(filterKey, value.trim());
      } else {
        params.delete(filterKey);
      }
      if (params.get("page")) params.set("page", "1");
    });
  };

  // Handle removing a specific filter
  const onRemoveFilter = (key: string) => {
    updateQuery((params) => {
      params.delete(`filter[${key}]`);
    });
  };

  // Clear all filters
  const onClearFilters = () => {
    updateQuery((params) => {
      Array.from(params.keys())
        .filter((k) => k.startsWith("filter["))
        .forEach((k) => params.delete(k));
    });
    setSearchValue("");
  };

  // Handle Enter key for text input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onApplyTextFilter();
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold text-base">{title}</div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-destructive"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {/* Sorting Section */}
        {sortOptions.length > 0 && (
          <div>
            <div className="mb-1 font-semibold text-xs text-muted-foreground">
              Sort
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 min-w-[90px] px-2 text-xs justify-between"
                  >
                    <span>
                      Sort By:{" "}
                      {sortOptions.find((opt) => opt.value === sort)?.label ||
                        "None"}
                    </span>
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onSortChange("")}>
                    None
                    {!sort && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                    >
                      {option.label}
                      {sort === option.value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={!sort}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 min-w-[90px] px-2 text-xs justify-between"
                    disabled={!sort}
                  >
                    <span>
                      Direction:{" "}
                      {sortDirectionOptions.find(
                        (opt) => opt.value === sortDirection
                      )?.label || "Ascending"}
                    </span>
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {sortDirectionOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onSortDirectionChange(option.value)}
                    >
                      {option.label}
                      {sortDirection === option.value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Filters Section */}
        {(textConfigs.length > 0 || selectConfigs.length > 0) && (
          <div>
            <div className="mb-1 font-semibold text-xs text-muted-foreground">
              Filters
            </div>
            <div className="flex flex-wrap gap-4">
              {/* Combined Text Search Section */}
              {textConfigs.length > 0 && (
                <div className="flex flex-col gap-1 min-w-[300px]">
                  <label className="text-xs font-medium">Search</label>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs justify-between"
                        >
                          <span>
                            {textConfigs.find(
                              (c) => c.value === selectedTextField
                            )?.label || "Select Field"}
                          </span>
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {textConfigs.map((config) => (
                          <DropdownMenuItem
                            key={config.value}
                            onClick={() => setSelectedTextField(config.value)}
                          >
                            {config.label}
                            {selectedTextField === config.value && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        textConfigs.find((c) => c.value === selectedTextField)
                          ?.placeholder ||
                        `Search by ${
                          textConfigs.find((c) => c.value === selectedTextField)
                            ?.label || "field"
                        }`
                      }
                      className="h-8 text-xs px-2"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-2 text-xs flex items-center gap-1"
                      onClick={onApplyTextFilter}
                      disabled={!selectedTextField || !searchValue.trim()}
                    >
                      <SearchIcon className="h-3 w-3" />
                      Apply
                    </Button>
                  </div>
                </div>
              )}

              {/* Independent Select Filters */}
              {selectConfigs.map((config) => {
                const activeValue =
                  activeFilters.find((f) => f.key === config.value)?.value ||
                  "";
                const activeLabel =
                  activeFilters.find((f) => f.key === config.value)
                    ?.valueLabel || "None";

                return (
                  <div
                    key={config.value}
                    className="flex flex-col gap-1 min-w-[200px]"
                  >
                    <label className="text-xs font-medium">
                      Filter by {config.label}
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs justify-between w-full"
                        >
                          <span>{activeLabel}</span>
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => onApplySelectFilter(config.value, "")} // Clear
                        >
                          None
                          {!activeValue && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                        {config.options?.map((opt) => (
                          <DropdownMenuItem
                            key={opt.value}
                            onClick={() =>
                              onApplySelectFilter(config.value, opt.value)
                            } // Direct apply
                          >
                            {opt.label}
                            {activeValue === opt.value && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>

            {/* Applied Filters Chips */}
            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilters.map((f) => (
                  <Badge
                    onClick={() => onRemoveFilter(f.key)}
                    key={f.key}
                    variant="secondary"
                    className="text-xs hover:cursor-pointer hover:text-destructive"
                  >
                    {f.fieldLabel}: {f.valueLabel}
                    <X className="ml-1 h-3 w-3 " />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
