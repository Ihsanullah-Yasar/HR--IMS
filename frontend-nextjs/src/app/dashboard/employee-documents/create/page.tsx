"use client";
import { EmployeeDocumentForm } from "@/components/Forms/employeeDocument/employeeDocument";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeDocumentCreateData } from "@/lib/Actions/employeeDocuments/employeeDocuments";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";

export default function CreateEmployeeDocumentPage() {
  const { data: formData, isLoading } = useQuery({
    queryKey: ["employee-document-create"],
    queryFn: () => getEmployeeDocumentCreateData(),
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={1} rows={5} />;
  }

  return <EmployeeDocumentForm mode="create" formData={formData?.data} />;
}
