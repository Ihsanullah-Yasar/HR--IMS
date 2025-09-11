"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getEmployeeDocumentColumns from "../columns/employeeDocument-column";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { TableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { EmployeeDocument } from "@/lib/Types/employeeDocument";
import {
  deleteEmployeeDocument,
  getEmployeeDocuments,
} from "@/lib/Actions/employeeDocuments/employeeDocuments";
import DynamicTableFilters from "../table-filters";
import {
  employeeDocumentFilterConfig,
  employeeDocumentSortOptions,
} from "../filterConfigs/employeeDocuments";

export default function EmployeeDocumentsTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<EmployeeDocument | null>(null);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "employee-documents",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getEmployeeDocuments(searchParams.toString()),
    select: (response) => response as ApiResponse<EmployeeDocument[]>,
  });

  const { mutateAsync: deleteDocumentMutation } = useMutation({
    mutationFn: deleteEmployeeDocument,
    onSuccess: () => {
      toast.success("Employee document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
    },
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={6} rows={10} />;
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

  const handleDeleteClick = (document: EmployeeDocument) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      await deleteDocumentMutation(documentToDelete.id);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">
              Employee Documents
            </CardTitle>
            <Link href="/dashboard/employee-documents/create">
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add Document
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            <DynamicTableFilters
              title="Document Filters"
              sortOptions={employeeDocumentSortOptions}
              filterConfigs={employeeDocumentFilterConfig}
            />

            <div className="rounded-md border overflow-hidden">
              <DataTable
                columns={getEmployeeDocumentColumns({
                  onDeleteClick: handleDeleteClick,
                })}
                data={data?.data ? data?.data : ([] as EmployeeDocument[])}
                meta={data?.meta ? data.meta : ({} as Meta)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete"
        itemName={documentToDelete ? `document "${documentToDelete.type}"` : ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
