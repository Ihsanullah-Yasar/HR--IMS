"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Clock, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttendanceRecord } from "@/lib/Types/attendance";
import { format } from "date-fns";

interface AttendanceColumnsProps {
  onEditClick?: (record: AttendanceRecord) => void;
  onDeleteClick?: (record: AttendanceRecord) => void;
}

export default function getAttendanceColumns({
  onEditClick,
  onDeleteClick,
}: AttendanceColumnsProps): ColumnDef<AttendanceRecord>[] {
  return [
    {
      accessorKey: "employee.name",
      header: "Employee",
      cell: ({ row }) => {
        const employee = row.original.employee;
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{employee?.name || "N/A"}</div>
              <div className="text-sm text-muted-foreground">
                ID: {employee?.id || "N/A"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "employee.department.name",
      header: "Department",
      cell: ({ row }) => {
        const department = row.original.employee?.department;
        return <div className="text-sm">{department?.name || "N/A"}</div>;
      },
    },
    {
      accessorKey: "logDate",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("logDate") as string;
        return (
          <div className="text-sm">
            {date ? format(new Date(date), "MMM dd, yyyy") : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      cell: ({ row }) => {
        const checkIn = row.getValue("checkIn") as string;
        return (
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-mono">
              {checkIn ? format(new Date(checkIn), "HH:mm") : "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      cell: ({ row }) => {
        const checkOut = row.getValue("checkOut") as string;
        return (
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-red-600" />
            <span className="text-sm font-mono">
              {checkOut ? format(new Date(checkOut), "HH:mm") : "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "hoursWorked",
      header: "Hours Worked",
      cell: ({ row }) => {
        const hours = row.getValue("hoursWorked");
        const numericHours = typeof hours === "number" ? hours : 0;
        return (
          <div className="text-sm">
            {numericHours > 0 ? `${numericHours.toFixed(2)}h` : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const source = row.getValue("source") as string;
        const sourceColors = {
          biometric: "bg-blue-100 text-blue-800",
          manual: "bg-gray-100 text-gray-800",
          mobile_app: "bg-green-100 text-green-800",
          web_portal: "bg-purple-100 text-purple-800",
        };

        return (
          <Badge
            variant="secondary"
            className={
              sourceColors[source as keyof typeof sourceColors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {source?.replace("_", " ") || "N/A"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEditClick && (
                <DropdownMenuItem onClick={() => onEditClick(record)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDeleteClick && (
                <DropdownMenuItem
                  onClick={() => onDeleteClick(record)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
