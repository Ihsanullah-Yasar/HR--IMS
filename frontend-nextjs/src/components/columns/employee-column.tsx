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
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/lib/Types/employee";

export default function getEmployeeColumns({
  onDeleteClick,
}: {
  onDeleteClick: (employee: Employee) => void;
}): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name");
        const nameText =
          typeof name === "object" && name !== null
            ? (name as any).en || Object.values(name)[0] || "N/A"
            : name || "N/A";

        return (
          <div className="font-medium max-w-[200px] truncate">{nameText}</div>
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
      size: 160,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => {
        const designation = row.getValue("designation");
        let title = "—";

        if (typeof designation === "object" && designation !== null) {
          const designationTitle = (designation as any).title;
          if (
            typeof designationTitle === "object" &&
            designationTitle !== null
          ) {
            title =
              designationTitle.en ||
              Object.values(designationTitle)[0] ||
              "N/A";
          } else {
            title = designationTitle || "N/A";
          }
        } else if (designation) {
          title = String(designation);
        }

        return <div className="text-sm max-w-[160px] truncate">{title}</div>;
      },
      size: 160,
    },
    {
      accessorKey: "dateOfJoining",
      header: "Joined",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.getValue("dateOfJoining")).toLocaleDateString()}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "consentGiven",
      header: "Consent",
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("consentGiven") ? "default" : "secondary"}
          className="text-xs"
        >
          {row.getValue("consentGiven") ? "Yes" : "No"}
        </Badge>
      ),
      size: 90,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
      size: 110,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
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
                  navigator.clipboard.writeText(`${employee.id}` || "")
                }
              >
                Copy Employee ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/employees/${employee.id}/edit`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(employee)}
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
