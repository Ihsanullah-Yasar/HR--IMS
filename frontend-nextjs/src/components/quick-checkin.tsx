"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, User } from "lucide-react";
import { format } from "date-fns";
import {
  createAttendanceRecord,
  getAttendanceCreateFormData,
} from "@/lib/Actions/attendance/attendance";
import { AttendanceCreateData, AttendanceSource } from "@/lib/Types/attendance";

interface QuickCheckInProps {
  employeeId?: number;
}

export default function QuickCheckIn({ employeeId }: QuickCheckInProps) {
  const queryClient = useQueryClient();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch employees for selection
  const { data: formData } = useQuery({
    queryKey: ["attendance-create-form-data"],
    queryFn: getAttendanceCreateFormData,
  });

  const { mutateAsync: createRecord } = useMutation({
    mutationFn: createAttendanceRecord,
    onSuccess: () => {
      toast.success("Attendance record created successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create attendance record");
    },
  });

  const handleCheckIn = async () => {
    if (!employeeId) {
      toast.error("Please select an employee first");
      return;
    }

    setIsCheckingIn(true);
    try {
      const now = new Date();
      const data: AttendanceCreateData = {
        employeeId,
        checkIn: now.toISOString(),
        checkOut: null,
        source: AttendanceSource.WEB_PORTAL,
        hoursWorked: null,
        logDate: format(now, "yyyy-MM-dd"),
      };

      await createRecord(data);
    } catch (error) {
      console.error("Error checking in:", error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) {
      toast.error("Please select an employee first");
      return;
    }

    setIsCheckingOut(true);
    try {
      const now = new Date();
      const data: AttendanceCreateData = {
        employeeId,
        checkIn: now.toISOString(),
        checkOut: now.toISOString(),
        source: AttendanceSource.WEB_PORTAL,
        hoursWorked: 0, // Will be calculated by backend
        logDate: format(now, "yyyy-MM-dd"),
      };

      await createRecord(data);
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const selectedEmployee = formData?.data?.employees?.find(
    (emp) => emp.id === employeeId
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Quick Check In/Out</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedEmployee ? (
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <User className="h-4 w-4" />
            <div>
              <div className="font-medium">{selectedEmployee.name}</div>
              <div className="text-sm text-muted-foreground">
                ID: {selectedEmployee.id} • Department ID:{" "}
                {selectedEmployee.departmentId}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Select an employee to check in/out
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={handleCheckIn}
            disabled={!employeeId || isCheckingIn || isCheckingOut}
            className="flex-1"
            variant="outline"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isCheckingIn ? "Checking In..." : "Check In"}
          </Button>

          <Button
            onClick={handleCheckOut}
            disabled={!employeeId || isCheckingIn || isCheckingOut}
            className="flex-1"
            variant="outline"
          >
            <XCircle className="h-4 w-4 mr-2" />
            {isCheckingOut ? "Checking Out..." : "Check Out"}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Current time: {format(new Date(), "HH:mm:ss")}
        </div>
      </CardContent>
    </Card>
  );
}
