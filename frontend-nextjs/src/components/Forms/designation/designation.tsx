"use client";
import {
  designationSchema,
  DesignationFormData,
  DesignationUpdateFormData,
} from "@/lib/Schemas/designation";
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
import { createDesignation } from "@/lib/Actions/designations/designations";
import { updateDesignation } from "@/lib/Actions/designations/designations";
import { getDesignationFormData } from "@/lib/Actions/designations/designations";
import { Combobox } from "@/components/ui/combobox";
import React from "react";
import { useCreateMutation } from "@/hooks/useCreateMutation";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import { Designation, DesignationEditFormData } from "@/lib/Types/designation";
import { ApiResponse } from "@/lib/Types/api";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Mode = "create" | "update";

type DesignationFormProps = {
  mode: Mode;
  formData?: Partial<DesignationEditFormData>;
  designationId?: number; // needed for update mutation
};

export const DesignationForm = ({
  mode,
  formData,
  designationId,
}: DesignationFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Transform departments data for combobox
  const departmentOptions = React.useMemo(() => {
    if (!formData?.departments) return [];
    return formData.departments.map((dept) => ({
      value: dept.dId.toString(),
      label: `${dept.code} - ${dept.name}`,
      searchValue: `${dept.code} ${dept.name}`.toLowerCase(),
    }));
  }, [formData?.departments]);

  // Set up form with appropriate schema based on mode
  const form = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      code: "",
      title: "",
      baseSalary: 0,
      isActive: true,
      department: "",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDesignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designations"] });
      toast.success("Designation created successfully!");
      router.push("/dashboard/designations");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof DesignationFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to create designation, Try again");
        console.log(error);
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: DesignationUpdateFormData) =>
      updateDesignation(designationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designations"] });
      toast.success("Designation updated successfully!");
      router.push("/dashboard/designations");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof DesignationUpdateFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to update designation, Try again");
        console.log(error);
      }
    },
  });

  const onSubmit: SubmitHandler<DesignationFormData> = (data) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Designation" : "Edit Designation"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., SEN-DEV"
                        {...field}
                        value={field.value?.toUpperCase() || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this designation
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/designations")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Designation"
                  : "Update Designation"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
