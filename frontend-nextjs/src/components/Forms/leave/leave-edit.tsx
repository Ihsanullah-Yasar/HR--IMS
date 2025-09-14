"use client";
import {
  leaveUpdateSchema,
  LeaveUpdateFormData,
} from "@/lib/Schemas/leave-schema";
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
import { updateLeave, getLeaveFormData } from "@/lib/Actions/leaves/leaves";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Leave } from "@/lib/Types/leave";

type LeaveEditFormProps = {
  leaveId: number;
};

export const LeaveEditForm = ({ leaveId }: LeaveEditFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [calculatedDays, setCalculatedDays] = useState<number>(0);

  // Fetch leave data
  const { data: formData, isLoading } = useQuery({
    queryKey: ["leave-form-data", leaveId],
    queryFn: () => getLeaveFormData(leaveId),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<LeaveUpdateFormData>({
    resolver: zodResolver(leaveUpdateSchema),
    defaultValues: {
      employee_id: 0,
      leave_type_id: 0,
      start_date: "",
      end_date: "",
      total_days: 0,
      reason: "",
      status: "pending",
    },
  });

  // Transform employees data for combobox
  const employeeOptions =
    formData?.data?.employees?.map((emp) => ({
      value: emp.id.toString(),
      label: emp.name,
      searchValue: emp.name.toLowerCase(),
    })) || [];

  // Transform leave types data for combobox
  const leaveTypeOptions =
    formData?.data?.leaveTypes?.map((lt) => ({
      value: lt.ltId.toString(),
      label: `${lt.code} - ${lt.name.en}`,
      searchValue: `${lt.code} ${lt.name.en}`.toLowerCase(),
    })) || [];

  // Update form when data is loaded
  useEffect(() => {
    if (formData?.data?.editingLeave) {
      const leave = formData.data.editingLeave;
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);

      setStartDate(start);
      setEndDate(end);

      form.reset({
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        start_date: leave.start_date,
        end_date: leave.end_date,
        total_days: leave.total_days,
        reason: leave.reason,
        status: leave.status,
      });
    }
  }, [formData, form]);

  // Calculate days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDays(diffDays);
      form.setValue("total_days", diffDays);
    }
  }, [startDate, endDate, form]);

  const { mutate: updateLeaveMutation, isPending } = useMutation({
    mutationFn: (data: LeaveUpdateFormData) => updateLeave(leaveId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leave-form-data", leaveId] });
      toast.success("Leave request updated successfully!");
      router.push("/dashboard/leaves");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof LeaveUpdateFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to update leave request, Try again");
        console.log(error);
      }
    },
  });

  const onSubmit: SubmitHandler<LeaveUpdateFormData> = (data) => {
    updateLeaveMutation(data);
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Leave Request</CardTitle>
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

  if (!formData?.data?.editingLeave) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Leave Request Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The requested leave request could not be found.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const leave = formData.data.editingLeave;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Leave Request</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Leave Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={employeeOptions}
                          value={field.value?.toString() || ""}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          placeholder="Select employee..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leave_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={leaveTypeOptions}
                          value={field.value?.toString() || ""}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          placeholder="Select leave type..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate
                                ? format(startDate, "PPP")
                                : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              field.onChange(
                                date?.toISOString().split("T")[0] || ""
                              );
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              field.onChange(
                                date?.toISOString().split("T")[0] || ""
                              );
                            }}
                            disabled={(date) =>
                              date < new Date() ||
                              (startDate ? date < startDate : false)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {calculatedDays > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Total Days: {calculatedDays}</Badge>
                </div>
              )}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reason for leave..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
                {isPending ? "Updating..." : "Update Leave Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
