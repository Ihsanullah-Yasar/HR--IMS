"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function UserTableLoadingSkeleton({
  columns = 5,
  rows = 8,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <Card>
      {/* 1. Card Header: Users List + Add Button */}
      <CardHeader className="px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle>
            <Skeleton className="h-6 w-24" /> {/* "User list" */}
          </CardTitle>
          <Skeleton className="h-8 w-20 rounded-md" /> {/* Add button */}
        </div>
      </CardHeader>

      {/* 2. Card Body */}
      <CardContent className="space-y-4">
        <Card className="p-4 mb-4">
          {/* 2.1 filter title and clear filter */}
          <div className="flex justify-between items-center w-full my-2">
            <Skeleton className="h-5 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
          {/* 2.1 Sort Section */}
          <div>
            {/* Sort Title */}
            <Skeleton className="h-4 w-16 mb-2" />
            {/* Sort By + Sort Direction */}
            <div className="flex gap-3">
              <Skeleton className="h-8 w-[140px]" />
              <Skeleton className="h-8 w-[140px]" />
            </div>
          </div>

          {/* 2.2 Filters Section */}
          <div className="space-y-4">
            {/* Filters Title */}
            <Skeleton className="h-4 w-20" />

            {/* Search Filter */}
            <div>
              <Skeleton className="h-3 w-12 mb-1" /> {/* Search Label */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-[120px]" /> {/* Field Dropdown */}
                <Skeleton className="h-8  min-w-[200px]" /> {/* Input */}
                <Skeleton className="h-8 w-[80px]" /> {/* Apply btn */}
                {/* Status Filter */}
                {/* <div> */}
                {/* <Skeleton className="h-3 w-28 mb-1" />{" "} */}
                {/* "Filter by Status" label */}
                <Skeleton className="h-8 w-[200px]" /> {/* Status Dropdown */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </Card>
        {/* 2.3 Table */}
        <div className="border rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="flex bg-muted py-2 px-4 border-b">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-4 flex-1 mx-1" />
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex items-center py-2 px-4 border-b last:border-0"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-4 flex-1 mx-1"
                />
              ))}
            </div>
          ))}
        </div>

        {/* 2.4 Pagination */}
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-8 w-20" /> {/* Previous */}
          <Skeleton className="h-5 w-24" /> {/* Page indicator */}
          <Skeleton className="h-8 w-20" /> {/* Next */}
        </div>
      </CardContent>
    </Card>
  );
}
