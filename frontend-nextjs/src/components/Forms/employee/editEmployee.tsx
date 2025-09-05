"use client";
import { EmployeeForm } from "./employee";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeFormData } from "@/lib/Actions/employees/employees";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";
import { Button } from "@/components/ui/button";

type EditEmployeeProps = {
  employeeId: number;
};

export const EditEmployee = ({ employeeId }: EditEmployeeProps) => {
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["employee-form-data", employeeId],
    queryFn: () => getEmployeeFormData(employeeId),
    staleTime: 5 * 60 * 1000,
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

  return (
    <EmployeeForm mode="update" formData={data?.data} employeeId={employeeId} />
  );
};
