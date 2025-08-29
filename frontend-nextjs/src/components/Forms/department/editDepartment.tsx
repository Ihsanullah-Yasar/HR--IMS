"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getDepartmentById,
  getDepartmentFormData,
} from "@/lib/Actions/departments/departments";
import { DepartmentForm } from "./department";
import { Button } from "@/components/ui/button";
import { FormLoadingSkeleton } from "@/components/shared/skeleton/formLoadingSkeleton";

export default function EditDepartmentWrapper() {
  const params = useParams();
  const rawId = (params as any)?.id as string | string[] | undefined;
  const id = typeof rawId === "string" ? Number.parseInt(rawId, 10) : NaN;
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentFormData(id as number),
    enabled: Number.isFinite(id) && id > 0,
  });

  if (!Number.isFinite(id) || id <= 0)
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">Invalid department id in URL.</p>
      </div>
    );

  if (isLoading) return <FormLoadingSkeleton fields={5} />;

  if (isError)
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">{error.message}</p>
        <Button onClick={() => refetch()} size="sm" className="mt-2">
          Retry
        </Button>
      </div>
    );

  return (
    <DepartmentForm mode="update" departmentId={id} formData={data?.data} />
  );
}
