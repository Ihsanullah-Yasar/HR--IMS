"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Calculator,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import {
  getSalaryById,
  calculateSalary,
} from "@/lib/Actions/salaries/salaries";
import { formatCurrency } from "@/lib/utils/currency";

export default function ViewSalaryPage() {
  const router = useRouter();
  const params = useParams();
  const salaryId = parseInt(params.id as string);

  const {
    data: salaryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["salary", salaryId],
    queryFn: () => getSalaryById(salaryId),
    enabled: !!salaryId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Salary Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !salaryData?.data) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Salary Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error?.message || "Salary not found"}
              </p>
              <Button onClick={() => router.push("/dashboard/salaries")}>
                Back to Salaries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const salary = salaryData.data;
  const calculation = calculateSalary(salary);
  const currency = salary.currency?.symbol || salary.currencyCode;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Salary Details</h1>
            <p className="text-muted-foreground">
              {salary.employee?.name || "Employee"} -{" "}
              {salary.currency?.code || salary.currencyCode}
            </p>
          </div>
          <Button
            onClick={() => router.push(`/dashboard/salaries/edit/${salary.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Salary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Employee
              </label>
              <p className="text-lg font-semibold">
                {salary.employee?.name || "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Currency
              </label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {salary.currency?.code || salary.currencyCode}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {typeof salary.currency?.name === "string"
                    ? salary.currency.name
                    : salary.currency?.name?.en || ""}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Base Amount
              </label>
              <p className="text-lg font-semibold">
                {formatCurrency(salary.baseAmount, currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Effective Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Effective Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Effective From
              </label>
              <p className="text-lg font-semibold">
                {new Date(salary.effectiveFrom).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Effective To
              </label>
              <p className="text-lg font-semibold">
                {salary.effectiveTo ? (
                  new Date(salary.effectiveTo).toLocaleDateString()
                ) : (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Current
                  </Badge>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm text-muted-foreground">
                {new Date(salary.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Salary Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Salary Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Base Amount</p>
                <p className="text-lg font-semibold text-blue-800">
                  {formatCurrency(salary.baseAmount, currency)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Allowances</p>
                <p className="text-lg font-semibold text-green-800">
                  +{formatCurrency(calculation.totalAllowances, currency)}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Deductions</p>
                <p className="text-lg font-semibold text-red-800">
                  -{formatCurrency(calculation.totalDeductions, currency)}
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Net Salary</p>
                <p className="text-lg font-semibold text-purple-800">
                  {formatCurrency(calculation.netSalary, currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Components */}
      {salary.components && salary.components.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Salary Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salary.components.map((component, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        component.type === "allowance"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        component.type === "allowance"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {component.type === "allowance"
                        ? "Allowance"
                        : "Deduction"}
                    </Badge>
                    <span className="font-medium">{component.name}</span>
                  </div>
                  <span className="font-semibold">
                    {component.type === "allowance" ? "+" : "-"}
                    {formatCurrency(component.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
