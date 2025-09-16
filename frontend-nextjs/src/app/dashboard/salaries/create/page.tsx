"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SalaryForm from "@/components/Forms/salary-form";
import {
  getSalaryFormData,
  createSalary,
} from "@/lib/Actions/salaries/salaries";
import { Employee } from "@/lib/Types/employee";
import { Currency } from "@/lib/Types/currency";
import { salaryCreateSchema, SalaryCreateFormData } from "@/lib/Schemas/salary";

export default function CreateSalaryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: formData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["salary-form-data"],
    queryFn: getSalaryFormData,
  });

  const createSalaryMutation = useMutation({
    mutationFn: createSalary,
    onSuccess: () => {
      toast.success("Salary created successfully");
      router.push("/dashboard/salaries");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create salary");
    },
  });

  const handleSubmit = async (data: SalaryCreateFormData) => {
    setIsSubmitting(true);
    try {
      await createSalaryMutation.mutateAsync(data);
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
          <h1 className="text-3xl font-bold">Create Salary</h1>
          <p className="text-muted-foreground">
            Add a new salary record for an employee
          </p>
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
          <h1 className="text-3xl font-bold">Create Salary</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error.message || "Failed to load form data"}
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create Salary</h1>
        <p className="text-muted-foreground">
          Add a new salary record for an employee
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Information</CardTitle>
        </CardHeader>
        <CardContent>
          <SalaryForm
            employees={formData?.data?.employees || []}
            currencies={formData?.data?.currencies || []}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
