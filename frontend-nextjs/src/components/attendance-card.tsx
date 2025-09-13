"use client";

import { useQuery } from "@tanstack/react-query";
import {
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAttendanceRecords } from "@/lib/Actions/attendance/attendance";
import { AttendanceRecord } from "@/lib/Types/attendance";

export function AttendanceCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["attendance-records-dashboard"],
    queryFn: () => getAttendanceRecords("per_page=100"),
    select: (response) => response as { data: AttendanceRecord[] },
  });

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today's Attendance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayRecords =
    data?.data?.filter((record) => record.logDate === today) || [];
  const presentToday = todayRecords.filter((record) => record.checkIn).length;
  const totalEmployees = data?.data?.length || 0;
  const attendanceRate =
    totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const yesterdayRecords =
    data?.data?.filter((record) => record.logDate === yesterdayStr) || [];
  const presentYesterday = yesterdayRecords.filter(
    (record) => record.checkIn
  ).length;
  const yesterdayRate =
    totalEmployees > 0 ? (presentYesterday / totalEmployees) * 100 : 0;

  const trend = attendanceRate - yesterdayRate;
  const isPositiveTrend = trend >= 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Today's Attendance</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {presentToday}/{totalEmployees}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {isPositiveTrend ? <IconTrendingUp /> : <IconTrendingDown />}
            {Math.abs(trend).toFixed(1)}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {attendanceRate.toFixed(1)}% attendance rate{" "}
          {isPositiveTrend ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          )}
        </div>
        <div className="text-muted-foreground">
          {isPositiveTrend ? "Better than yesterday" : "Lower than yesterday"}
        </div>
      </CardFooter>
    </Card>
  );
}
