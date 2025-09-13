"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Clock, Users, Calendar, TrendingUp } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getAttendanceColumns from "../columns/attendance-column";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { TableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { AttendanceRecord } from "@/lib/Types/attendance";
import {
  deleteAttendanceRecord,
  getAttendanceRecords,
} from "@/lib/Actions/attendance/attendance";
import {
  attendanceFilterConfig,
  attendanceSortOptions,
} from "../filterConfigs/attendance";
import DynamicTableFilters from "../table-filters";
import QuickCheckIn from "../quick-checkin";

export default function AttendanceTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const paginationData = { page: 1, perPage: 10 };

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<AttendanceRecord | null>(
    null
  );

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [
      "attendance-records",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getAttendanceRecords(searchParams.toString()),
    select: (response) => response as ApiResponse<AttendanceRecord[]>,
  });

  const { mutateAsync: deleteRecordMutation } = useMutation({
    mutationFn: deleteAttendanceRecord,
    onSuccess: () => {
      toast.success("Attendance record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
    },
  });

  if (isLoading) {
    return <TableLoadingSkeleton columns={8} rows={10} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">{error.message}</p>
        <Button onClick={() => refetch()} size="sm" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  const handleDeleteClick = (record: AttendanceRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      await deleteRecordMutation(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  // Calculate some basic stats from the data
  const records = data?.data || [];
  const totalHours = records.reduce((sum, record) => {
    const hours = record.hoursWorked || 0;
    return sum + (typeof hours === "number" ? hours : 0);
  }, 0);

  const stats = {
    totalRecords: records.length,
    presentToday: records.filter(
      (record) =>
        record.logDate === new Date().toISOString().split("T")[0] &&
        record.checkIn
    ).length,
    totalHours: totalHours,
    averageHours:
      records.length > 0 ? (totalHours / records.length).toFixed(2) : "0",
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold">{stats.totalRecords}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Present Today
                  </p>
                  <p className="text-2xl font-bold">{stats.presentToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Hours
                  </p>
                  <p className="text-2xl font-bold">
                    {Number(stats.totalHours).toFixed(1)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Hours/Day
                  </p>
                  <p className="text-2xl font-bold">{stats.averageHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Check In/Out */}
        <div className="flex justify-center">
          <QuickCheckIn />
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-xl font-semibold">
                Attendance Records
              </CardTitle>
              <div className="flex space-x-2">
                <Link href="/dashboard/attendance/bulk-create">
                  <Button variant="outline" size="sm" className="h-8">
                    <Users className="h-4 w-4 mr-1" /> Bulk Create
                  </Button>
                </Link>
                <Link href="/dashboard/attendance/create">
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Record
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-4">
              <DynamicTableFilters
                title="Attendance Filters"
                sortOptions={attendanceSortOptions}
                filterConfigs={attendanceFilterConfig}
              />

              <div className="rounded-md border overflow-hidden">
                <DataTable
                  columns={getAttendanceColumns({
                    onDeleteClick: handleDeleteClick,
                  })}
                  data={data?.data ? data?.data : ([] as AttendanceRecord[])}
                  meta={data?.meta ? data.meta : ({} as Meta)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Single DeleteAlertDialog at the page level */}
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete"
        itemName={
          recordToDelete
            ? `attendance record for ${
                recordToDelete.employee?.name || "employee"
              }`
            : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
