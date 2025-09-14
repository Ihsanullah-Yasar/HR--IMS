"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getLeaveTypeColumns from "../columns/leave-type-column";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { TableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { LeaveType } from "@/lib/Types/leave-type";
import {
  deleteLeaveType,
  getLeaveTypes,
} from "@/lib/Actions/leave-types/leave-types";
import {
  leaveTypeFilterConfig,
  leaveTypeSortOptions,
} from "../filterConfigs/leave-types";
import DynamicTableFilters from "../table-filters";

export default function LeaveTypeTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState<LeaveType | null>(
    null
  );

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "leave-types",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getLeaveTypes(searchParams.toString()),
    select: (response) => response as ApiResponse<LeaveType[]>,
  });

  const { mutateAsync: deleteLeaveTypeMutation } = useMutation({
    mutationFn: deleteLeaveType,
    onSuccess: () => {
      toast.success("Leave type deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
    },
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={9} rows={10} />;
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

  const handleDeleteClick = (leaveType: LeaveType) => {
    setLeaveTypeToDelete(leaveType);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (leaveTypeToDelete) {
      await deleteLeaveTypeMutation(leaveTypeToDelete.id);
      setLeaveTypeToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">Leave Types</CardTitle>
            <Link href="/dashboard/leave-types/create">
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add Leave Type
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            <DynamicTableFilters
              title="Leave Type Filters"
              sortOptions={leaveTypeSortOptions}
              filterConfigs={leaveTypeFilterConfig}
            />

            <div className="rounded-md border overflow-hidden">
              <DataTable
                columns={getLeaveTypeColumns({
                  onDeleteClick: handleDeleteClick,
                })}
                data={data?.data ? data?.data : ([] as LeaveType[])}
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
          leaveTypeToDelete ? `leave type "${leaveTypeToDelete.name.en}"` : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
