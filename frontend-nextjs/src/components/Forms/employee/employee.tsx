"use client";
import {
  employeeSchema,
  employeeUpdateSchema,
  EmployeeFormData,
  EmployeeUpdateFormData,
} from "@/lib/Schemas/employee";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createEmployee,
  updateEmployee,
} from "@/lib/Actions/employees/employees";
import { Combobox } from "@/components/ui/combobox";
import React from "react";
import { EmployeeEditFormData } from "@/lib/Types/employee";
import { Switch } from "@/components/ui/switch";

type Mode = "create" | "update";

type EmployeeFormProps = {
  mode: Mode;
  formData?: Partial<EmployeeEditFormData>;
  employeeId?: number;
};

export const EmployeeForm = ({
  mode,
  formData,
  employeeId,
}: EmployeeFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const departmentOptions = React.useMemo(() => {
    if (!formData?.departments) return [];
    return formData.departments.map((dept) => ({
      value: String(dept.id),
      label: `${dept.code} - ${dept.name}`,
      searchValue: `${dept.code} ${dept.name}`.toLowerCase(),
    }));
  }, [formData?.departments]);

  const designationOptions = React.useMemo(() => {
    if (!formData?.designations) return [];
    return formData.designations.map((des) => ({
      value: String(des.id),
      label: `${des.code} - ${
        typeof des.title === "string" ? des.title : (des as any).title?.en ?? ""
      }`,
      searchValue: `${des.code} ${
        typeof des.title === "string" ? des.title : (des as any).title?.en ?? ""
      }`.toLowerCase(),
    }));
  }, [formData?.designations]);

  const userOptions = React.useMemo(() => {
    if (!formData?.users) return [];
    return formData.users.map((u) => ({
      value: String(u.id),
      label: `${u.name} (${u.email})`,
      searchValue: `${u.name} ${u.email}`.toLowerCase(),
    }));
  }, [formData?.users]);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      name: "",
      genderType: undefined,
      maritalStatus: undefined,
      dateOfBirth: "",
      dateOfJoining: "",
      dateOfLeaving: undefined,
      timezone: "UTC",
      consentGiven: false,
      user: undefined,
      department: "",
      designation: "",
    },
  });

  React.useEffect(() => {
    if (mode === "update" && formData?.editingEmployee) {
      const e = formData.editingEmployee;
      form.reset({
        name: e.name || "",
        genderType: (e.genderType as any) ?? undefined,
        maritalStatus: (e.maritalStatus as any) ?? undefined,
        dateOfBirth: e.dateOfBirth ?? "",
        dateOfJoining: e.dateOfJoining ?? "",
        dateOfLeaving: e.dateOfLeaving ?? undefined,
        timezone: e.timezone ?? "UTC",
        consentGiven: e.consentGiven ?? false,
        user: e.userId ? String(e.userId) : undefined,
        department: e.departmentId ? String(e.departmentId) : "",
        designation: e.designationId ? String(e.designationId) : "",
      });
    }
  }, [formData, mode, form]);

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully!");
      router.push("/dashboard/employees");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof EmployeeFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to create employee, Try again");
        console.log(error);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: EmployeeUpdateFormData) =>
      updateEmployee(employeeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated successfully!");
      router.push("/dashboard/employees");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof EmployeeUpdateFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to update employee, Try again");
        console.log(error);
      }
    },
  });

  const onSubmit: SubmitHandler<EmployeeFormData> = (data) => {
    if (mode === "create") createMutation.mutate(data);
    else updateMutation.mutate(data);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Employee" : "Edit Employee"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="e.g., UTC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfJoining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Joining</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfLeaving"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Leaving</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Combobox
                        options={departmentOptions}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select department..."
                        searchPlaceholder="Search departments..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Combobox
                        options={designationOptions}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select designation..."
                        searchPlaceholder="Search designations..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="consentGiven"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Consent Given</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        GDPR consent from employee
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/employees")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Employee"
                  : "Update Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
