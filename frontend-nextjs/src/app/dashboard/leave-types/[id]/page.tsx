"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaveTypeById } from "@/lib/Actions/leave-types/leave-types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Calendar, DollarSign, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";

type ViewLeaveTypePageProps = {
  params: {
    id: string;
  };
};

export default function ViewLeaveTypePage({ params }: ViewLeaveTypePageProps) {
  const router = useRouter();
  const leaveTypeId = parseInt(params.id);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["leave-type", leaveTypeId],
    queryFn: () => getLeaveTypeById(leaveTypeId),
  });

  if (isNaN(leaveTypeId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Leave Type ID
          </h1>
          <p className="text-muted-foreground mt-2">
            The provided leave type ID is not valid.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <TableLoadingSkeleton columns={1} rows={5} />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Leave Type Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            {error?.message || "The requested leave type could not be found."}
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const leaveType = data.data;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{leaveType.name.en}</h1>
            {leaveType.name.ar && (
              <p className="text-lg text-muted-foreground">
                {leaveType.name.ar}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/leave-types/${leaveType.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Code
                </label>
                <p className="text-lg font-semibold">{leaveType.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Days per Year
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {leaveType.days_per_year} days
                </p>
              </div>
            </div>

            {leaveType.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm mt-1">{leaveType.description}</p>
              </div>
            )}

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={leaveType.is_paid ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                <DollarSign className="h-3 w-3" />
                {leaveType.is_paid ? "Paid" : "Unpaid"}
              </Badge>
              <Badge variant={leaveType.is_active ? "default" : "destructive"}>
                {leaveType.is_active ? "Active" : "Inactive"}
              </Badge>
              {leaveType.color && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: leaveType.color }}
                  />
                  {leaveType.color}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm">
                {new Date(leaveType.created_at).toLocaleDateString()}
              </p>
              {leaveType.created_by && (
                <p className="text-xs text-muted-foreground">
                  by {leaveType.created_by.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm">
                {new Date(leaveType.updated_at).toLocaleDateString()}
              </p>
              {leaveType.updated_by && (
                <p className="text-xs text-muted-foreground">
                  by {leaveType.updated_by.name}
                </p>
              )}
            </div>

            {leaveType.deleted_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Deleted
                </label>
                <p className="text-sm">
                  {new Date(leaveType.deleted_at).toLocaleDateString()}
                </p>
                {leaveType.deleted_by && (
                  <p className="text-xs text-muted-foreground">
                    by {leaveType.deleted_by.name}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
