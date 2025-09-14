"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaveById } from "@/lib/Actions/leaves/leaves";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";

type ViewLeavePageProps = {
  params: {
    id: string;
  };
};

export default function ViewLeavePage({ params }: ViewLeavePageProps) {
  const router = useRouter();
  const leaveId = parseInt(params.id);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["leave", leaveId],
    queryFn: () => getLeaveById(leaveId),
  });

  if (isNaN(leaveId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Leave Request ID
          </h1>
          <p className="text-muted-foreground mt-2">
            The provided leave request ID is not valid.
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
            Leave Request Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            {error?.message ||
              "The requested leave request could not be found."}
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const leave = data.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      cancelled: { variant: "outline" as const, label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {config.label}
      </Badge>
    );
  };

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
            <h1 className="text-3xl font-bold">Leave Request #{leave.id}</h1>
            <p className="text-lg text-muted-foreground">
              {leave.employee?.name} - {leave.leaveType?.name?.en}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/leaves/${leave.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Leave Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Employee
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {leave.employee?.name || "Unknown Employee"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Leave Type
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  {leave.leaveType?.color && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: leave.leaveType.color }}
                    />
                  )}
                  {leave.leaveType?.name?.en || "Unknown Type"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Start Date
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(leave.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  End Date
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(leave.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Total Days
                </label>
                <p className="text-lg font-semibold">{leave.total_days} days</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Reason
              </label>
              <p className="text-sm mt-1 bg-gray-50 p-3 rounded-md">
                {leave.reason}
              </p>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              {getStatusBadge(leave.status)}
              {leave.approvedBy && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Approved by {leave.approvedBy.name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">{getStatusBadge(leave.status)}</div>
            </div>

            {leave.approved_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Approved At
                </label>
                <p className="text-sm">
                  {new Date(leave.approved_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(leave.approved_at).toLocaleTimeString()}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm">
                {new Date(leave.created_at).toLocaleDateString()}
              </p>
              {leave.created_by && (
                <p className="text-xs text-muted-foreground">
                  by {leave.created_by.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm">
                {new Date(leave.updated_at).toLocaleDateString()}
              </p>
              {leave.updated_by && (
                <p className="text-xs text-muted-foreground">
                  by {leave.updated_by.name}
                </p>
              )}
            </div>

            {leave.deleted_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Deleted
                </label>
                <p className="text-sm">
                  {new Date(leave.deleted_at).toLocaleDateString()}
                </p>
                {leave.deleted_by && (
                  <p className="text-xs text-muted-foreground">
                    by {leave.deleted_by.name}
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
