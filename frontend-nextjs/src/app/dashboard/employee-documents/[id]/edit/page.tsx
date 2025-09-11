"use client";
import { EmployeeDocumentForm } from "@/components/Forms/employeeDocument/employeeDocument";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeDocumentFormData } from "@/lib/Actions/employeeDocuments/employeeDocuments";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";
import { notFound } from "next/navigation";
import { use } from "react";

interface EditEmployeeDocumentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditEmployeeDocumentPage({
  params,
}: EditEmployeeDocumentPageProps) {
  const resolvedParams = use(params);
  const documentId = parseInt(resolvedParams.id);

  if (isNaN(documentId)) {
    notFound();
  }

  const {
    data: formData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee-document-form", documentId],
    queryFn: () => getEmployeeDocumentFormData(documentId),
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={1} rows={5} />;
  }

  if (error || !formData?.data) {
    notFound();
  }

  return (
    <EmployeeDocumentForm
      mode="update"
      formData={formData.data}
      documentId={documentId}
    />
  );
}
