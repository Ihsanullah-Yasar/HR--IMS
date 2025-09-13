"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, Clock, User, Plus, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  attendanceBulkCreateSchema,
  AttendanceBulkCreateFormData,
} from "@/lib/Schemas/attendance";
import { AttendanceCreateData, AttendanceSource } from "@/lib/Types/attendance";
import {
  bulkCreateAttendanceRecords,
  getAttendanceCreateFormData,
} from "@/lib/Actions/attendance/attendance";

export default function BulkCreateAttendancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AttendanceBulkCreateFormData>({
    resolver: zodResolver(attendanceBulkCreateSchema),
    defaultValues: {
      records: [
        {
          employeeId: 0,
          checkIn: "",
          checkOut: "",
          source: "manual",
          hoursWorked: undefined,
          logDate: format(new Date(), "yyyy-MM-dd"),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "records",
  });

  // Fetch form data for dropdowns
  const { data: formData, isLoading: formDataLoading } = useQuery({
    queryKey: ["attendance-create-form-data"],
    queryFn: getAttendanceCreateFormData,
  });

  const { mutateAsync: bulkCreateRecords } = useMutation({
    mutationFn: bulkCreateAttendanceRecords,
    onSuccess: () => {
      toast.success("Attendance records created successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
      router.push("/dashboard/attendance");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create attendance records");
    },
  });

  const onSubmit = async (data: AttendanceBulkCreateFormData) => {
    setIsSubmitting(true);
    try {
      const submitData: AttendanceCreateData[] = data.records.map((record) => ({
        employeeId: record.employeeId,
        checkIn: record.checkIn,
        checkOut: record.checkOut || null,
        source: record.source as AttendanceSource,
        hoursWorked: record.hoursWorked || null,
        logDate: record.logDate || format(new Date(), "yyyy-MM-dd"),
      }));

      await bulkCreateRecords(submitData);
    } catch (error) {
      console.error("Error creating attendance records:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRecord = () => {
    append({
      employeeId: 0,
      checkIn: "",
      checkOut: "",
      source: "manual",
      hoursWorked: undefined,
      logDate: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const calculateHoursWorked = (index: number) => {
    const checkInValue = form.watch(`records.${index}.checkIn`);
    const checkOutValue = form.watch(`records.${index}.checkOut`);

    if (checkInValue && checkOutValue) {
      const checkIn = new Date(checkInValue);
      const checkOut = new Date(checkOutValue);
      const diffInHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      if (diffInHours > 0) {
        form.setValue(
          `records.${index}.hoursWorked`,
          parseFloat(diffInHours.toFixed(2))
        );
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
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Bulk Create Attendance Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Record {index + 1}</h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Employee Selection */}
                    <FormField
                      control={form.control}
                      name={`records.${index}.employeeId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Employee</span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
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
                                      ID: {employee.id} • Department ID:{" "}
                                      {employee.departmentId}
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
                      name={`records.${index}.logDate`}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
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
                      name={`records.${index}.checkIn`}
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
                                calculateHoursWorked(index);
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
                      name={`records.${index}.checkOut`}
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
                                calculateHoursWorked(index);
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
                      name={`records.${index}.hoursWorked`}
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
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
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
                      name={`records.${index}.source`}
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
                              <SelectItem value="biometric">
                                Biometric
                              </SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="mobile_app">
                                Mobile App
                              </SelectItem>
                              <SelectItem value="web_portal">
                                Web Portal
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}

              {/* Add Record Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRecord}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Record</span>
                </Button>
              </div>

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
                  {isSubmitting
                    ? "Creating Records..."
                    : `Create ${fields.length} Record${
                        fields.length > 1 ? "s" : ""
                      }`}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
