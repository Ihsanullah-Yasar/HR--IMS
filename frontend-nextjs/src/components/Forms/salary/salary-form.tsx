"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calculator } from "lucide-react";
import {
  salaryCreateSchema,
  salaryUpdateSchema,
  SalaryComponentFormData,
} from "@/lib/Schemas/salary";
import { Employee } from "@/lib/Types/employee";
import { Currency } from "@/lib/Types/currency";
import { formatCurrency } from "@/lib/utils/currency";

interface SalaryFormProps {
  employees: Pick<Employee, "id" | "name">[];
  currencies: Pick<Currency, "code" | "name" | "symbol">[];
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
  isEdit?: boolean;
}

export default function SalaryForm({
  employees,
  currencies,
  onSubmit,
  isLoading = false,
  initialData,
  isEdit = false,
}: SalaryFormProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  const schema = isEdit ? salaryUpdateSchema : salaryCreateSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      employeeId: "",
      currencyCode: "",
      baseAmount: 0,
      components: [],
      effectiveFrom: "",
      effectiveTo: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "components",
  });

  const watchedComponents = form.watch("components");
  const watchedBaseAmount = form.watch("baseAmount");
  const watchedCurrency = form.watch("currencyCode");

  const calculateTotals = () => {
    const totalAllowances =
      watchedComponents
        ?.filter((c: SalaryComponentFormData) => c.type === "allowance")
        ?.reduce(
          (sum: number, c: SalaryComponentFormData) => sum + (c.amount || 0),
          0
        ) || 0;

    const totalDeductions =
      watchedComponents
        ?.filter((c: SalaryComponentFormData) => c.type === "deduction")
        ?.reduce(
          (sum: number, c: SalaryComponentFormData) => sum + (c.amount || 0),
          0
        ) || 0;

    const grossSalary = (watchedBaseAmount || 0) + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    return { totalAllowances, totalDeductions, grossSalary, netSalary };
  };

  const totals = calculateTotals();
  const selectedCurrency = currencies.find((c) => c.code === watchedCurrency);

  const addComponent = () => {
    append({
      name: "",
      amount: 0,
      type: "allowance",
    });
  };

  const removeComponent = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Selection */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={employee.id.toString()}
                        >
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency Selection */}
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} -{" "}
                          {typeof currency.name === "string"
                            ? currency.name
                            : currency.name?.en || currency.code}{" "}
                          ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base Amount */}
            <FormField
              control={form.control}
              name="baseAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter base amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Effective From */}
            <FormField
              control={form.control}
              name="effectiveFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective From *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Effective To */}
            <FormField
              control={form.control}
              name="effectiveTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective To</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Salary Components */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Salary Components</CardTitle>
                  <CardDescription>
                    Add allowances and deductions to the base salary
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addComponent}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Component
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No components added yet. Click "Add Component" to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                    >
                      <FormField
                        control={form.control}
                        name={`components.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Component Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Housing Allowance"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`components.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`components.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="allowance">
                                  Allowance
                                </SelectItem>
                                <SelectItem value="deduction">
                                  Deduction
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeComponent(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salary Calculator */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Salary Calculation</CardTitle>
                  <CardDescription>
                    Preview of the calculated salary breakdown
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCalculator(!showCalculator)}
                >
                  <Calculator className="h-4 w-4 mr-1" />
                  {showCalculator ? "Hide" : "Show"} Calculator
                </Button>
              </div>
            </CardHeader>
            {showCalculator && (
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Base Amount</p>
                    <p className="text-lg font-semibold text-blue-800">
                      {formatCurrency(
                        totals.grossSalary - totals.totalAllowances,
                        selectedCurrency?.symbol || ""
                      )}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Total Allowances</p>
                    <p className="text-lg font-semibold text-green-800">
                      +
                      {formatCurrency(
                        totals.totalAllowances,
                        selectedCurrency?.symbol || ""
                      )}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Total Deductions</p>
                    <p className="text-lg font-semibold text-red-800">
                      -
                      {formatCurrency(
                        totals.totalDeductions,
                        selectedCurrency?.symbol || ""
                      )}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Net Salary</p>
                    <p className="text-lg font-semibold text-purple-800">
                      {formatCurrency(
                        totals.netSalary,
                        selectedCurrency?.symbol || ""
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEdit
                ? "Update Salary"
                : "Create Salary"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
