"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { History, Search, Filter, Download } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import { getSalaries, calculateSalary } from "@/lib/Actions/salaries/salaries";
import { Salary } from "@/lib/Types/salary";
import { formatCurrency } from "@/lib/utils/currency";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";
import {
  salaryHistoryFilterConfig,
  salarySortOptions,
} from "@/components/filterConfigs/salaries";
import DynamicTableFilters from "@/components/table-filters";

export default function SalaryHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const queryString = new URLSearchParams({
    ...(searchTerm && { "filter[employee.name]": searchTerm }),
    ...(selectedEmployee && { "filter[employee_id]": selectedEmployee }),
    ...(selectedCurrency && { "filter[currency_code]": selectedCurrency }),
    ...(dateRange.from && { "filter[effective_from]": dateRange.from }),
    ...(dateRange.to && { "filter[effective_to]": dateRange.to }),
  }).toString();

  const { data, isLoading, error } = useQuery({
    queryKey: ["salary-history", queryString],
    queryFn: () => getSalaries(queryString),
    select: (response) => response as ApiResponse<Salary[]>,
  });

  const getSalaryHistoryColumns = () => [
    {
      accessorKey: "employee.name",
      header: "Employee",
      cell: ({ row }: { row: any }) => {
        const employee = row.original.employee;
        return (
          <div className="font-medium">
            {employee?.name || "Unknown Employee"}
          </div>
        );
      },
    },
    {
      accessorKey: "baseAmount",
      header: "Base Amount",
      cell: ({ row }: { row: any }) => {
        const salary = row.original;
        const currency = salary.currency?.symbol || salary.currencyCode;
        return (
          <div className="font-medium">
            {formatCurrency(salary.baseAmount, currency)}
          </div>
        );
      },
    },
    {
      accessorKey: "netSalary",
      header: "Net Salary",
      cell: ({ row }: { row: any }) => {
        const salary = row.original;
        const calculation = calculateSalary(salary);
        const currency = salary.currency?.symbol || salary.currencyCode;

        return (
          <div className="font-semibold text-green-600">
            {formatCurrency(calculation.netSalary, currency)}
          </div>
        );
      },
    },
    {
      accessorKey: "currencyCode",
      header: "Currency",
      cell: ({ row }: { row: any }) => {
        const currency = row.original.currency;
        return (
          <Badge variant="outline">
            {currency?.code || row.original.currencyCode}
          </Badge>
        );
      },
    },
    {
      accessorKey: "effectiveFrom",
      header: "Effective From",
      cell: ({ row }: { row: any }) => {
        const date = new Date(row.original.effectiveFrom);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "effectiveTo",
      header: "Effective To",
      cell: ({ row }: { row: any }) => {
        const effectiveTo = row.original.effectiveTo;
        if (!effectiveTo) {
          return (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Current
            </Badge>
          );
        }

        const date = new Date(effectiveTo);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "components",
      header: "Components",
      cell: ({ row }: { row: any }) => {
        const components = row.original.components || [];
        if (components.length === 0) {
          return <span className="text-muted-foreground">None</span>;
        }

        const allowances = components.filter(
          (c: any) => c.type === "allowance"
        );
        const deductions = components.filter(
          (c: any) => c.type === "deduction"
        );

        return (
          <div className="space-y-1">
            {allowances.length > 0 && (
              <div className="text-xs">
                <span className="text-green-600">
                  +{allowances.length} allowance(s)
                </span>
              </div>
            )}
            {deductions.length > 0 && (
              <div className="text-xs">
                <span className="text-red-600">
                  -{deductions.length} deduction(s)
                </span>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <TableLoadingSkeleton columns={7} rows={10} />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center align-center py-8">
          <p className="text-red-500">{error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const salaries = data?.data || [];
  const totalNetSalary = salaries.reduce((sum, salary) => {
    const calculation = calculateSalary(salary);
    return sum + calculation.netSalary;
  }, 0);

  const averageNetSalary =
    salaries.length > 0 ? totalNetSalary / salaries.length : 0;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <History className="h-8 w-8 mr-3" />
          Salary History
        </h1>
        <p className="text-muted-foreground">
          View and analyze salary history across all employees
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">{salaries.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Salaries</p>
              <p className="text-2xl font-bold text-green-600">
                {salaries.filter((s) => !s.effectiveTo).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Historical Salaries
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {salaries.filter((s) => s.effectiveTo).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Average Net Salary
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(averageNetSalary, "USD")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Currencies</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Salary Records</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <DataTable
              columns={getSalaryHistoryColumns()}
              data={salaries}
              meta={data?.meta ? data.meta : ({} as Meta)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
