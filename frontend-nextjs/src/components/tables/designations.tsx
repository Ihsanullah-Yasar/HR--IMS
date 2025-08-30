"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getDesignationColumns from "../columns/designation-column";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { TableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { Designation } from "@/lib/Types/designation";
import {
  deleteDesignation,
  getDesignations,
} from "@/lib/Actions/designations/designations";
import {
  designationFilterConfig,
  designationSortOptions,
} from "../filterConfigs/designations";
import DynamicTableFilters from "../table-filters";

export default function DesignationTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [designationToDelete, setDesignationToDelete] =
    useState<Designation | null>(null);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "designations",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getDesignations(searchParams.toString()),
    select: (response) => response as ApiResponse<Designation[]>,
  });

  const { mutateAsync: deleteDesignationMutation } = useMutation({
    mutationFn: deleteDesignation,
    onSuccess: () => {
      toast.success("Designation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={7} rows={10} />;
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

  const handleDeleteClick = (designation: Designation) => {
    setDesignationToDelete(designation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (designationToDelete) {
      await deleteDesignationMutation(designationToDelete.id);
      setDesignationToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">
              Designations
            </CardTitle>
            <Link href="/dashboard/designations/create">
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add Designation
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            <DynamicTableFilters
              title="Designation Filters"
              sortOptions={designationSortOptions}
              filterConfigs={designationFilterConfig}
            />

            <div className="rounded-md border overflow-hidden">
              <DataTable
                columns={getDesignationColumns({
                  onDeleteClick: handleDeleteClick,
                })}
                data={data?.data ? data?.data : ([] as Designation[])}
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
          designationToDelete
            ? `designation "${designationToDelete.title}"`
            : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
