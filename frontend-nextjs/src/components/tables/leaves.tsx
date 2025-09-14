"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getLeaveColumns from "../columns/leave-column";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { TableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { Leave } from "@/lib/Types/leave";
import {
  deleteLeave,
  getLeaves,
  approveLeave,
  rejectLeave,
} from "@/lib/Actions/leaves/leaves";
import { leaveFilterConfig, leaveSortOptions } from "../filterConfigs/leaves";
import DynamicTableFilters from "../table-filters";

export default function LeaveTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<Leave | null>(null);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "leaves",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getLeaves(searchParams.toString()),
    select: (response) => response as ApiResponse<Leave[]>,
  });

  const { mutateAsync: deleteLeaveMutation } = useMutation({
    mutationFn: deleteLeave,
    onSuccess: () => {
      toast.success("Leave request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  const { mutateAsync: approveLeaveMutation } = useMutation({
    mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
      approveLeave(id, approvedBy),
    onSuccess: () => {
      toast.success("Leave request approved successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (error: any) => {
      toast.error("Failed to approve leave request");
      console.error(error);
    },
  });

  const { mutateAsync: rejectLeaveMutation } = useMutation({
    mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
      rejectLeave(id, approvedBy),
    onSuccess: () => {
      toast.success("Leave request rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (error: any) => {
      toast.error("Failed to reject leave request");
      console.error(error);
    },
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={10} rows={10} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">{error.message}</p>
        <Button onClick={() => refetch()} size="sm" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  const handleDeleteClick = (leave: Leave) => {
    setLeaveToDelete(leave);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (leaveToDelete) {
      await deleteLeaveMutation(leaveToDelete.id);
      setLeaveToDelete(null);
    }
  };

  const handleApproveClick = async (leave: Leave) => {
    // In a real app, you'd get the current user ID from auth context
    const currentUserId = 1; // This should come from your auth system
    await approveLeaveMutation({ id: leave.id, approvedBy: currentUserId });
  };

  const handleRejectClick = async (leave: Leave) => {
    // In a real app, you'd get the current user ID from auth context
    const currentUserId = 1; // This should come from your auth system
    await rejectLeaveMutation({ id: leave.id, approvedBy: currentUserId });
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">
              Leave Requests
            </CardTitle>
            <Link href="/dashboard/leaves/create">
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Request Leave
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            <DynamicTableFilters
              title="Leave Request Filters"
              sortOptions={leaveSortOptions}
              filterConfigs={leaveFilterConfig}
            />

            <div className="rounded-md border overflow-hidden">
              <DataTable
                columns={getLeaveColumns({
                  onDeleteClick: handleDeleteClick,
                  onApproveClick: handleApproveClick,
                  onRejectClick: handleRejectClick,
                })}
                data={data?.data ? data?.data : ([] as Leave[])}
                meta={data?.meta ? data.meta : ({} as Meta)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single DeleteAlertDialog at the page level */}
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete"
        itemName={
          leaveToDelete
            ? `leave request for ${leaveToDelete.employee?.name}`
            : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
