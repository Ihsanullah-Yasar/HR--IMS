"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Calculator, History } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getSalaryColumns from "../columns/salary-column";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { TableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { Salary } from "@/lib/Types/salary";
import { deleteSalary, getSalaries } from "@/lib/Actions/salaries/salaries";
import {
  salaryFilterConfig,
  salarySortOptions,
} from "../filterConfigs/salaries";
import DynamicTableFilters from "../table-filters";

export default function SalaryTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<Salary | null>(null);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "salaries",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getSalaries(searchParams.toString()),
    select: (response) => response as ApiResponse<Salary[]>,
  });

  const { mutateAsync: deleteSalaryMutation } = useMutation({
    mutationFn: deleteSalary,
    onSuccess: () => {
      toast.success("Salary deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
    },
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={8} rows={10} />;
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

  const handleDeleteClick = (salary: Salary) => {
    setSalaryToDelete(salary);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (salaryToDelete) {
      await deleteSalaryMutation(salaryToDelete.id);
      setSalaryToDelete(null);
    }
  };

  const handleEditClick = (salary: Salary) => {
    // Navigate to edit page
    window.location.href = `/dashboard/salaries/edit/${salary.id}`;
  };

  const handleViewClick = (salary: Salary) => {
    // Navigate to view page
    window.location.href = `/dashboard/salaries/view/${salary.id}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">
              Salary Management
            </CardTitle>
            <div className="flex gap-2">
              <Link href="/dashboard/salaries/calculator">
                <Button variant="outline" size="sm" className="h-8">
                  <Calculator className="h-4 w-4 mr-1" /> Calculator
                </Button>
              </Link>
              <Link href="/dashboard/salaries/history">
                <Button variant="outline" size="sm" className="h-8">
                  <History className="h-4 w-4 mr-1" /> History
                </Button>
              </Link>
              <Link href="/dashboard/salaries/create">
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1" /> Add Salary
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            <DynamicTableFilters
              title="Salary Filters"
              sortOptions={salarySortOptions}
              filterConfigs={salaryFilterConfig}
            />

            <div className="rounded-md border overflow-hidden">
              <DataTable
                columns={getSalaryColumns({
                  onEditClick: handleEditClick,
                  onDeleteClick: handleDeleteClick,
                  onViewClick: handleViewClick,
                })}
                data={data?.data ? data?.data : ([] as Salary[])}
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
          salaryToDelete
            ? `salary record for ${salaryToDelete.employee?.name || "employee"}`
            : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
