"use client";
import { useQuery } from "@tanstack/react-query";
import { EmployeeForm } from "@/components/Forms/employee/employee";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/Api";

export default function Page() {
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["employee-create-form-data"],
    queryFn: async () => {
      const response = await api.get<any>("/employees/create");
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <TableLoadingSkeleton columns={1} rows={10} />;
  if (isError)
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">{error.message}</p>
        <Button onClick={() => refetch()} size="sm" className="mt-2">
          Retry
        </Button>
      </div>
    );

  return <EmployeeForm mode="create" formData={data?.data} />;
}
