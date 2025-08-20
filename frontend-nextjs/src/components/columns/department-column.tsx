"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Department } from "@/lib/Types/department";
import { Badge } from "@/components/ui/badge";

export default function getDepartmentColumns({
  onDeleteClick,
}: {
  onDeleteClick: (department: Department) => void;
}): ColumnDef<Department>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">
          <Badge variant="secondary" className="text-xs">
            {row.getValue("code")}
          </Badge>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "name",
      header: "Department Name",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.getValue("name")}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[150px] truncate">
          {row.getValue("manager") || "—"}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "parentDepartment",
      header: "Parent Dept",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[150px] truncate">
          {row.getValue("parentDepartment") || "—"}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "timezone",
      header: "Timezone",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {row.getValue("timezone")}
        </div>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const department = row.original;
        const router = useRouter();

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
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(`${department.dId}` || "")
                }
              >
                Copy Department ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/departments/${department.dId}/edit`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(department)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 80,
    },
  ];
}
