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
import { Designation } from "@/lib/Types/designation";
import { Badge } from "@/components/ui/badge";

export default function getDesignationColumns({
  onDeleteClick,
}: {
  onDeleteClick: (designation: Designation) => void;
}): ColumnDef<Designation>[] {
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
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const title = row.getValue("title");
        const titleText =
          typeof title === "object" && title !== null
            ? (title as any).en || Object.values(title)[0] || "N/A"
            : title || "N/A";

        return (
          <div className="font-medium max-w-[200px] truncate">{titleText}</div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const department = row.getValue("department");
        const departmentName =
          typeof department === "object" && department !== null
            ? (department as any).name || "N/A"
            : department || "—";

        return (
          <div className="text-sm text-muted-foreground max-w-[150px] truncate">
            {departmentName}
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "baseSalary",
      header: "Base Salary",
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          ${row.getValue("baseSalary")?.toLocaleString() || "0"}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Badge
            variant={row.getValue("isActive") ? "default" : "secondary"}
            className="text-xs"
          >
            {row.getValue("isActive") ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const designation = row.original;
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
                  navigator.clipboard.writeText(`${designation.id}` || "")
                }
              >
                Copy Designation ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/designations/${designation.id}/edit`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(designation)}
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
