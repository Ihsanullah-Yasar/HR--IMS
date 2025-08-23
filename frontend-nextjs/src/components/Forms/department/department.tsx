"use client";
import {
  departmentSchema,
  DepartmentFormData,
  DepartmentUpdateFormData,
} from "@/lib/Schemas/department";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createDepartment } from "@/lib/Actions/departments/departments";
import { updateDepartment } from "@/lib/Actions/departments/departments";
import { getDepartmentFormData } from "@/lib/Actions/departments/departments";
import { Combobox } from "@/components/ui/combobox";
import { User } from "@/lib/Types/user";
import React from "react";
import { useCreateMutation } from "@/hooks/useCreateMutation";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import { Department, DepartmentEditFormData } from "@/lib/Types/department";
import { ApiResponse } from "@/lib/Types/api";
type Mode = "create" | "update";

type DepartmentFormProps = {
  mode: Mode;
  formData?: Partial<DepartmentEditFormData>;
  departmentId?: number; // needed for update mutation
};

export const DepartmentForm = ({
  mode,
  formData,
  departmentId,
}: DepartmentFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch departments for parent department selection
  //   const { data: formData, isLoading: formDataLoading } = useQuery({
  //     queryKey: ["department-form-data", departmentId],
  //     queryFn: () => getDepartmentFormData(departmentId),
  //     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  //   });

  // Transform departments data for combobox
  const departmentOptions = React.useMemo(() => {
    if (!formData?.departments) return [];
    return formData.departments.map((dept: Department) => ({
      value: dept.dId.toString(),
      label: `${dept.code} - ${dept.name}`,
      searchValue: `${dept.code} ${dept.name}`.toLowerCase(), // Lowercase for better searching
    }));
  }, [formData?.departments]);

  // Transform managers data for combobox
  const managerOptions = React.useMemo(() => {
    if (!formData?.managers) return [];
    return formData.managers.map((manager: User) => ({
      value: manager.id.toString(),
      label: manager.name,
      searchValue: manager.name.toLowerCase(),
      email: manager.email, // Include email for additional context if needed
    }));
  }, [formData?.managers]);

  //   const { mutate: createDepartmentMutaion, isPending } = useMutation({
  //     mutationFn: createDepartment,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["departments"] });
  //       toast.success("Department created successfully!");
  //       router.push("/dashboard/departments");
  //     },
  //     onError: (error: any) => {
  //       // Try to parse backend validation error
  //       if (error?.status === 422 && error?.errors) {
  //         const errors = error.errors;
  //         Object.entries(errors).forEach(([field, messages]) => {
  //           form.setError(field as keyof DepartmentFormData, {
  //             type: "server",
  //             message: Array.isArray(messages)
  //               ? messages.join(" ")
  //               : String(messages),
  //           });
  //         });
  //       } else {
  //         toast.error("Failed to create department, Try again");
  //         console.log(error);
  //       }
  //     },
  //   });
  console.log("Parent dept", formData?.editingDepartment?.parentDepartment);
  const defaultValues = formData?.editingDepartment;
  const form = useForm<DepartmentFormData>({
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      timezone: defaultValues?.timezone || "UTC",
      parentDepartment: defaultValues?.parentDepartment ?? null,
      manager: defaultValues?.manager ?? null,
    },
    resolver: zodResolver(departmentSchema),
  });

  const createMutation = useCreateMutation<
    ApiResponse<Department>,
    DepartmentFormData,
    DepartmentFormData
  >({
    mutationFn: createDepartment, // (data) => returns Department
    queryKey: "departments",
    form,
    redirectTo: "/dashboard/departments",
    successMessage: "Department created successfully!",
  });

  const updateMutation = useUpdateMutation<
    ApiResponse<Department>,
    { id: number; data: DepartmentFormData },
    DepartmentFormData
  >({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    queryKey: "departments",
    form,
    redirectTo: "/dashboard/departments",
    successMessage: "Department updated successfully!",
  });

  const onSubmit: SubmitHandler<DepartmentFormData> = (data) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: departmentId!, data });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create Department" : "Update Department"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter department code (e.g., IT, HR-ADMIN)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.code?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter timezone (e.g., UTC, America/New_York)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.timezone?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Department</FormLabel>
                  <FormControl>
                    <Combobox
                      options={departmentOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select parent department (optional)"
                      searchPlaceholder="Search departments..."
                      emptyText="No departments found."
                      //   disabled={formDataLoading}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.parentDepartment?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager</FormLabel>
                  <FormControl>
                    <Combobox
                      options={managerOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select manager (optional)"
                      searchPlaceholder="Search users..."
                      emptyText="No users found."
                      //   disabled={formDataLoading}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.manager?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                mode === "create"
                  ? createMutation.isPending
                  : updateMutation.isPending
                //   || formDataLoading
              }
            >
              {mode === "create"
                ? createMutation.isPending
                  ? "Creating..."
                  : "Create Department"
                : updateMutation.isPending
                ? "Updating..."
                : "Update Department"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
