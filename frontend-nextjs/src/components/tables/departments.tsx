"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getDepartmentColumns from "../columns/department-column";
import { User } from "@/lib/Types/user";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { UserTableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { Department } from "@/lib/Types/department";
import {
  deleteDepartemnt,
  getDepartments,
} from "@/lib/Actions/departments/departments";
import {
  departmentFilterConfig,
  departmentSortOptions,
} from "../filterConfigs/departments";
import DynamicTableFilters from "../table-filters";

export default function DepartmentTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "departments",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getDepartments(searchParams.toString()),
    select: (response) => response as ApiResponse<Department[]>,
  });

  const { mutateAsync: deleteDepartmentMutation } = useMutation({
    mutationFn: deleteDepartemnt,
    onSuccess: () => {
      toast.success("Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  if (isLoading) {
    return <UserTableLoadingSkeleton columns={6} rows={10} />;
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

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      await deleteDepartmentMutation(departmentToDelete.dId);
      setDepartmentToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">Departments</CardTitle>
            <Link href="/dashboard/departments/create">
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add Department
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            <DynamicTableFilters
              title="Department Filters"
              sortOptions={departmentSortOptions}
              filterConfigs={departmentFilterConfig}
            />

            <div className="rounded-md border overflow-hidden">
              <DataTable
                columns={getDepartmentColumns({
                  onDeleteClick: handleDeleteClick,
                })}
                data={data?.data ? data?.data : ([] as Department[])}
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
          departmentToDelete ? `department "${departmentToDelete.name}"` : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
