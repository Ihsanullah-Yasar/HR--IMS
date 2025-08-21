"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FormLoadingSkeleton({
  fields = 5,
}: {
  fields?: number; // default to 5 input fields
}) {
  return (
    <Card>
      {/* 1. Card Header: Form Title */}
      <CardHeader className="px-6 py-4">
        <CardTitle>
          <Skeleton className="h-6 w-40" /> {/* "Department Form Title" */}
        </CardTitle>
      </CardHeader>

      {/* 2. Card Content (Form Body) */}
      <CardContent className="space-y-6">
        {/* Render skeleton inputs based on number of fields */}
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Input/Combobox */}
          </div>
        ))}

        {/* Submit button */}
        <div className="pt-4">
          <Skeleton className="h-10 w-32 rounded-md" /> {/* Button loading */}
        </div>
      </CardContent>
    </Card>
  );
}
