"use client";
import {
  leaveTypeUpdateSchema,
  LeaveTypeUpdateFormData,
} from "@/lib/Schemas/leave-type-schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateLeaveType,
  getLeaveTypeFormData,
} from "@/lib/Actions/leave-types/leave-types";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { LeaveType } from "@/lib/Types/leave-type";

type LeaveTypeEditFormProps = {
  leaveTypeId: number;
};

export const LeaveTypeEditForm = ({ leaveTypeId }: LeaveTypeEditFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [colorPreview, setColorPreview] = useState("#3B82F6");

  // Fetch leave type data
  const { data: formData, isLoading } = useQuery({
    queryKey: ["leave-type-form-data", leaveTypeId],
    queryFn: () => getLeaveTypeFormData(leaveTypeId),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<LeaveTypeUpdateFormData>({
    resolver: zodResolver(leaveTypeUpdateSchema),
    defaultValues: {
      code: "",
      name: {
        en: "",
        ar: "",
      },
      description: "",
      days_per_year: 0,
      is_paid: true,
      is_active: true,
      color: "#3B82F6",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (formData?.data?.editingLeaveType) {
      const leaveType = formData.data.editingLeaveType;
      form.reset({
        code: leaveType.code,
        name: {
          en: leaveType.name.en,
          ar: leaveType.name.ar || "",
        },
        description: leaveType.description || "",
        days_per_year: leaveType.days_per_year,
        is_paid: leaveType.is_paid,
        is_active: leaveType.is_active,
        color: leaveType.color || "#3B82F6",
      });
      setColorPreview(leaveType.color || "#3B82F6");
    }
  }, [formData, form]);

  const { mutate: updateLeaveTypeMutation, isPending } = useMutation({
    mutationFn: (data: LeaveTypeUpdateFormData) =>
      updateLeaveType(leaveTypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
      queryClient.invalidateQueries({
        queryKey: ["leave-type-form-data", leaveTypeId],
      });
      toast.success("Leave type updated successfully!");
      router.push("/dashboard/leave-types");
    },
    onError: (error: any) => {
      // Try to parse backend validation error
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof LeaveTypeUpdateFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to update leave type, Try again");
        console.log(error);
      }
    },
  });

  const onSubmit: SubmitHandler<LeaveTypeUpdateFormData> = (data) => {
    updateLeaveTypeMutation(data);
  };

  const handleColorChange = (color: string) => {
    setColorPreview(color);
    form.setValue("color", color);
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Leave Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!formData?.data?.editingLeaveType) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Leave Type Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The requested leave type could not be found.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Leave Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ANNUAL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days_per_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days per Year *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="365"
                          placeholder="21"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Annual Leave" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., إجازة سنوية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter leave type description..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="is_paid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Paid Leave</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          This leave type is paid
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

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          This leave type is available for use
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

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="color"
                          className="w-16 h-10 p-1 border rounded"
                          value={field.value || "#3B82F6"}
                          onChange={(e) => handleColorChange(e.target.value)}
                        />
                        <Input
                          placeholder="#3B82F6"
                          value={field.value || ""}
                          onChange={(e) => handleColorChange(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: colorPreview }}
                          />
                          <Badge variant="outline">{colorPreview}</Badge>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Leave Type"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
