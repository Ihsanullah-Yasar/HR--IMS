"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Salary } from "@/lib/Types/salary";
import { calculateSalary } from "@/lib/Actions/salaries/salaries";
import { formatCurrency } from "@/lib/utils/currency";

interface SalaryColumnProps {
  onEditClick: (salary: Salary) => void;
  onDeleteClick: (salary: Salary) => void;
  onViewClick: (salary: Salary) => void;
}

export default function getSalaryColumns({
  onEditClick,
  onDeleteClick,
  onViewClick,
}: SalaryColumnProps): ColumnDef<Salary>[] {
  return [
    {
      accessorKey: "employee.name",
      header: "Employee",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
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
      accessorKey: "components",
      header: "Components",
      cell: ({ row }) => {
        const components = row.original.components || [];
        if (components.length === 0) {
          return <span className="text-muted-foreground">No components</span>;
        }

        const allowances = components.filter((c) => c.type === "allowance");
        const deductions = components.filter((c) => c.type === "deduction");

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
    {
      accessorKey: "netSalary",
      header: "Net Salary",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
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
      cell: ({ row }) => {
        const date = new Date(row.original.effectiveFrom);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "effectiveTo",
      header: "Effective To",
      cell: ({ row }) => {
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const salary = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewClick(salary)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditClick(salary)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(salary)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
