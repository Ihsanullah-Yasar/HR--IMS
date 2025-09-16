"use client";

import { Suspense } from "react";
import SalaryTable from "@/components/tables/salaries";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";

export default function SalariesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Salary Management</h1>
        <p className="text-muted-foreground">
          Manage employee salaries, allowances, and deductions
        </p>
      </div>

      <Suspense fallback={<TableLoadingSkeleton columns={8} rows={10} />}>
        <SalaryTable />
      </Suspense>
    </div>
  );
}
