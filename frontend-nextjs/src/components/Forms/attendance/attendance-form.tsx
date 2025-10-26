"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  attendanceCreateSchema,
  AttendanceCreateFormData,
} from "@/lib/Schemas/attendance";
import {
  AttendanceRecord,
  AttendanceCreateData,
  AttendanceSource,
} from "@/lib/Types/attendance";
import {
  createAttendanceRecord,
  getAttendanceCreateFormData,
} from "@/lib/Actions/attendance/attendance";

interface AttendanceFormProps {
  initialData?: AttendanceRecord;
  isEdit?: boolean;
}

export default function AttendanceForm({
  initialData,
  isEdit = false,
}: AttendanceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AttendanceCreateFormData>({
    resolver: zodResolver(attendanceCreateSchema),
    defaultValues: {
      employeeId: initialData?.employeeId || undefined,
      checkIn: initialData?.checkIn
        ? format(new Date(initialData.checkIn), "yyyy-MM-dd'T'HH:mm")
        : "",
      checkOut: initialData?.checkOut
        ? format(new Date(initialData.checkOut), "yyyy-MM-dd'T'HH:mm")
        : "",
      source: initialData?.source || AttendanceSource.MANUAL,
      hoursWorked: initialData?.hoursWorked || undefined,
      logDate: initialData?.logDate || format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Fetch form data for dropdowns
  const { data: formData, isLoading: formDataLoading } = useQuery({
    queryKey: ["attendance-create-form-data"],
    queryFn: getAttendanceCreateFormData,
  });

  const { mutateAsync: createRecord } = useMutation({
    mutationFn: createAttendanceRecord,
    onSuccess: () => {
      toast.success("Attendance record created successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
      router.push("/dashboard/attendance");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create attendance record");
    },
  });

  const onSubmit = async (data: AttendanceCreateFormData) => {
    setIsSubmitting(true);
    try {
      const submitData: AttendanceCreateData = {
        employeeId: data.employeeId,
        checkIn: data.checkIn,
        checkOut: data.checkOut || null,
        source: data.source as AttendanceSource,
        hoursWorked: data.hoursWorked || null,
        logDate: data.logDate || format(new Date(), "yyyy-MM-dd"),
      };

      await createRecord(submitData);
    } catch (error) {
      console.error("Error creating attendance record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate hours worked when both check-in and check-out are provided
  const checkInValue = form.watch("checkIn");
  const checkOutValue = form.watch("checkOut");

  const calculateHoursWorked = () => {
    if (checkInValue && checkOutValue) {
      const checkIn = new Date(checkInValue);
      const checkOut = new Date(checkOutValue);
      const diffInHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      if (diffInHours > 0) {
        form.setValue("hoursWorked", parseFloat(diffInHours.toFixed(2)));
      }
    }
  };

  if (formDataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading form data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>{isEdit ? "Edit" : "Create"} Attendance Record</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Employee Selection */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Employee</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.data?.employees?.map((employee) => (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {employee.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ID: {employee.id} •{" "}
                                {employee.departmentId || "No Department"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="logDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check In Time */}
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check In Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          calculateHoursWorked();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check Out Time */}
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Out Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          calculateHoursWorked();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hours Worked */}
              <FormField
                control={form.control}
                name="hoursWorked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Worked</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="24"
                        placeholder="Auto-calculated"
                        {...field}
                        value={field.value || undefined}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Source */}
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="biometric">Biometric</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="web_portal">Web Portal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Record"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
