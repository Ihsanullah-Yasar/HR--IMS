import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Leave } from "@/lib/Types/leave";
import Link from "next/link";

interface LeaveColumnsProps {
  onDeleteClick: (leave: Leave) => void;
  onApproveClick?: (leave: Leave) => void;
  onRejectClick?: (leave: Leave) => void;
}

export default function getLeaveColumns({
  onDeleteClick,
  onApproveClick,
  onRejectClick,
}: LeaveColumnsProps): ColumnDef<Leave>[] {
  return [
    {
      accessorKey: "employee",
      header: "Employee",
      cell: ({ row }) => {
        const employee = row.getValue("employee") as Leave["employee"];
        return (
          <div className="font-medium">
            {employee?.name || "Unknown Employee"}
          </div>
        );
      },
    },
    {
      accessorKey: "leaveType",
      header: "Leave Type",
      cell: ({ row }) => {
        const leaveType = row.getValue("leaveType") as Leave["leaveType"];
        return (
          <div className="flex items-center gap-2">
            {leaveType?.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: leaveType.color }}
              />
            )}
            <span className="font-medium">
              {leaveType?.name?.en || "Unknown Type"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("start_date"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("end_date"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "total_days",
      header: "Days",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("total_days")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusConfig = {
          pending: { variant: "secondary" as const, label: "Pending" },
          approved: { variant: "default" as const, label: "Approved" },
          rejected: { variant: "destructive" as const, label: "Rejected" },
          cancelled: { variant: "outline" as const, label: "Cancelled" },
        };

        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.pending;

        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reason = row.getValue("reason") as string;
        return (
          <div className="max-w-[200px] truncate" title={reason}>
            {reason}
          </div>
        );
      },
    },
    {
      accessorKey: "approvedBy",
      header: "Approved By",
      cell: ({ row }) => {
        const approvedBy = row.getValue("approvedBy") as Leave["approvedBy"];
        return <div className="text-sm">{approvedBy?.name || "-"}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const leave = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/leaves/${leave.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/leaves/${leave.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {leave.status === "pending" && onApproveClick && (
                <DropdownMenuItem
                  onClick={() => onApproveClick(leave)}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
              )}
              {leave.status === "pending" && onRejectClick && (
                <DropdownMenuItem
                  onClick={() => onRejectClick(leave)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDeleteClick(leave)}
                className="text-destructive"
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
