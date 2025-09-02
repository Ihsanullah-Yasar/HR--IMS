"use client";
import { DesignationForm } from "@/components/Forms/designation/designation";
import { useQuery } from "@tanstack/react-query";
import { getDesignationCreateFormData } from "@/lib/Actions/designations/designations";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";
import { Button } from "@/components/ui/button";

export default function CreateDesignationPage() {
  const {
    data: formData,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["designation-create-form-data"],
    queryFn: () => getDesignationCreateFormData(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={1} rows={10} />;
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

  return <DesignationForm mode="create" formData={formData?.data} />;
}
