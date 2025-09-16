"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SalaryForm from "@/components/Forms/salary-form";
import {
  getSalaryEditFormData,
  updateSalary,
} from "@/lib/Actions/salaries/salaries";
import { salaryUpdateSchema, SalaryUpdateFormData } from "@/lib/Schemas/salary";

export default function EditSalaryPage() {
  const router = useRouter();
  const params = useParams();
  const salaryId = parseInt(params.id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: formData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["salary-edit-form-data", salaryId],
    queryFn: () => getSalaryEditFormData(salaryId),
    enabled: !!salaryId,
  });

  const updateSalaryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SalaryUpdateFormData }) =>
      updateSalary(id, data),
    onSuccess: () => {
      toast.success("Salary updated successfully");
      router.push("/dashboard/salaries");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update salary");
    },
  });

  const handleSubmit = async (data: SalaryUpdateFormData) => {
    setIsSubmitting(true);
    try {
      await updateSalaryMutation.mutateAsync({ id: salaryId, data });
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Salary</h1>
          <p className="text-muted-foreground">Update salary information</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Salary</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error.message || "Failed to load salary data"}
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData?.data?.editingSalary) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Salary</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Salary not found</p>
              <Button onClick={() => router.push("/dashboard/salaries")}>
                Back to Salaries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform the salary data for the form
  const initialData = {
    employeeId: formData.data.editingSalary.employeeId,
    currencyCode: formData.data.editingSalary.currencyCode,
    baseAmount: formData.data.editingSalary.baseAmount,
    components: formData.data.editingSalary.components || [],
    effectiveFrom: formData.data.editingSalary.effectiveFrom,
    effectiveTo: formData.data.editingSalary.effectiveTo,
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Salary</h1>
        <p className="text-muted-foreground">
          Update salary information for{" "}
          {formData.data.editingSalary.employee?.name || "employee"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Information</CardTitle>
        </CardHeader>
        <CardContent>
          <SalaryForm
            employees={formData.data.employees}
            currencies={formData.data.currencies}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            initialData={initialData}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
