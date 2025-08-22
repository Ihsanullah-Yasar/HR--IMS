"use client";
import { departmentSchema, DepartmentFormData } from "@/lib/Schemas/department";
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
import {
  getDepartments,
  updateDepartment,
} from "@/lib/Actions/departments/departments";
import { getUsers } from "@/lib/Actions/users/users";
import { Combobox } from "@/components/ui/combobox";
import { User } from "@/lib/Types/user";
import React from "react";
import { useSaveMutation } from "@/hooks/useSaveMutation";
import { Department } from "@/lib/Types/department";
import { ApiResponse } from "@/lib/Types/api";
type Mode = "create" | "update";

type DepartmentFormProps = {
  mode: Mode;
  defaultValues?: Partial<DepartmentFormData>;
  departmentId?: number; // needed for update mutation
};

export const DepartmentForm = ({
  mode,
  defaultValues,
  departmentId,
}: DepartmentFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch departments for parent department selection
  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({
    queryKey: ["departments", "all"],
    queryFn: () => getDepartments(""),
  });

  // Fetch users for manager selection
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "all"],
    queryFn: () => getUsers(""),
  });

  // Transform departments data for combobox
  const departmentOptions = React.useMemo(() => {
    if (!departmentsData?.data) return [];
    return departmentsData.data.map((dept: Department) => ({
      value: dept.dId.toString(),
      label: `${dept.code} - ${dept.name}`,
      searchValue: `${dept.code} ${dept.name}`, // Searchable by both code and name
    }));
  }, [departmentsData]);

  // Transform users data for combobox
  const userOptions = React.useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.map((user: User) => ({
      value: user.id.toString(),
      label: user.name,
      searchValue: user.name, // Searchable by name
    }));
  }, [usersData]);

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
  console.log("Parent dept", defaultValues?.parentDepartment);
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

  // Mutations
  //   const mutation = useMutation({
  //     mutationFn:
  //       mode === "create"
  //         ? createDepartment
  //         : (data: DepartmentFormData) =>
  //             updateDepartment(departmentId as number, data),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["departments"] });
  //       toast.success(
  //         mode === "create"
  //           ? "Department created successfully!"
  //           : "Department updated successfully!"
  //       );
  //       router.push("/dashboard/departments");
  //     },
  //     onError: (error: any) => {
  //       if (error?.status === 422 && error?.errors) {
  //         Object.entries(error.errors).forEach(([field, messages]) => {
  //           form.setError(field as keyof DepartmentFormData, {
  //             type: "server",
  //             message: Array.isArray(messages)
  //               ? messages.join(" ")
  //               : String(messages),
  //           });
  //         });
  //       } else {
  //         toast.error(
  //           mode === "create"
  //             ? "Failed to create department. Try again."
  //             : "Failed to update department. Try again."
  //         );
  //       }
  //     },
  //   });
  const mutation = useSaveMutation<
    ApiResponse<Department>,
    DepartmentFormData,
    { id: number; data: DepartmentFormData },
    DepartmentFormData
  >({
    mode,
    queryKey: "departments",
    createFn: createDepartment,
    updateFn: ({ id, data }) => updateDepartment(id, data),
    form,
    redirectTo: "/dashboard/departments",
    successMessage: {
      create: "Department created successfully",
      update: "Department updated successfully",
    },
    errorMessage: {
      create: "Failed to create department",
      update: "Failed to update department",
    },
  });

  const onSubmit: SubmitHandler<DepartmentFormData> = async (data) => {
    if (mode === "create") {
      mutation.mutate(data); // TCreateVars
    } else {
      mutation.mutate({ id: departmentId!, data }); // TUpdateVars
    }
  };
  //   const CreateDepartmentHandler: SubmitHandler<DepartmentFormData> = async (
  //     data
  //   ) => {
  //     createDepartmentMutaion(data);
  //   };

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
                      disabled={departmentsLoading}
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
                      options={userOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select manager (optional)"
                      searchPlaceholder="Search users..."
                      emptyText="No users found."
                      disabled={usersLoading}
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
                mutation.isPending || departmentsLoading || usersLoading
              }
            >
              {mutation.isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Department"
                : "Update Department"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
