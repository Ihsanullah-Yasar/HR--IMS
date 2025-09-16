"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Plus, Trash2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

interface SalaryComponent {
  name: string;
  amount: number;
  type: "allowance" | "deduction";
}

export default function SalaryCalculatorPage() {
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [newComponent, setNewComponent] = useState<SalaryComponent>({
    name: "",
    amount: 0,
    type: "allowance",
  });

  const addComponent = () => {
    if (newComponent.name.trim() && newComponent.amount > 0) {
      setComponents([...components, { ...newComponent }]);
      setNewComponent({ name: "", amount: 0, type: "allowance" });
    }
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totalAllowances = components
      .filter((c) => c.type === "allowance")
      .reduce((sum, c) => sum + c.amount, 0);

    const totalDeductions = components
      .filter((c) => c.type === "deduction")
      .reduce((sum, c) => sum + c.amount, 0);

    const grossSalary = baseAmount + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    return { totalAllowances, totalDeductions, grossSalary, netSalary };
  };

  const totals = calculateTotals();

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ];

  const selectedCurrency = currencies.find((c) => c.code === currency);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Calculator className="h-8 w-8 mr-3" />
          Salary Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate salary with allowances and deductions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="baseAmount">Base Amount</Label>
                <Input
                  id="baseAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={baseAmount}
                  onChange={(e) =>
                    setBaseAmount(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter base salary amount"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="componentName">Component Name</Label>
                  <Input
                    id="componentName"
                    value={newComponent.name}
                    onChange={(e) =>
                      setNewComponent({ ...newComponent, name: e.target.value })
                    }
                    placeholder="e.g., Housing Allowance"
                  />
                </div>
                <div>
                  <Label htmlFor="componentAmount">Amount</Label>
                  <Input
                    id="componentAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newComponent.amount}
                    onChange={(e) =>
                      setNewComponent({
                        ...newComponent,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="componentType">Type</Label>
                  <select
                    id="componentType"
                    value={newComponent.type}
                    onChange={(e) =>
                      setNewComponent({
                        ...newComponent,
                        type: e.target.value as "allowance" | "deduction",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="allowance">Allowance</option>
                    <option value="deduction">Deduction</option>
                  </select>
                </div>
              </div>
              <Button onClick={addComponent} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </CardContent>
          </Card>

          {/* Components List */}
          {components.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {components.map((component, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
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
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {component.type === "allowance" ? "+" : "-"}
                          {formatCurrency(
                            component.amount,
                            selectedCurrency?.symbol || ""
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComponent(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-medium">Base Amount</span>
                  <span className="text-blue-800 font-semibold text-lg">
                    {formatCurrency(baseAmount, selectedCurrency?.symbol || "")}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-medium">
                    Total Allowances
                  </span>
                  <span className="text-green-800 font-semibold text-lg">
                    +
                    {formatCurrency(
                      totals.totalAllowances,
                      selectedCurrency?.symbol || ""
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 font-medium">
                    Total Deductions
                  </span>
                  <span className="text-red-800 font-semibold text-lg">
                    -
                    {formatCurrency(
                      totals.totalDeductions,
                      selectedCurrency?.symbol || ""
                    )}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="text-purple-600 font-bold text-lg">
                      Net Salary
                    </span>
                    <span className="text-purple-800 font-bold text-2xl">
                      {formatCurrency(
                        totals.netSalary,
                        selectedCurrency?.symbol || ""
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Salary:</span>
                  <span>
                    {formatCurrency(
                      totals.grossSalary,
                      selectedCurrency?.symbol || ""
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Allowances (
                    {components.filter((c) => c.type === "allowance").length}):
                  </span>
                  <span>
                    +
                    {formatCurrency(
                      totals.totalAllowances,
                      selectedCurrency?.symbol || ""
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Deductions (
                    {components.filter((c) => c.type === "deduction").length}):
                  </span>
                  <span>
                    -
                    {formatCurrency(
                      totals.totalDeductions,
                      selectedCurrency?.symbol || ""
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Net Salary:</span>
                  <span>
                    {formatCurrency(
                      totals.netSalary,
                      selectedCurrency?.symbol || ""
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setBaseAmount(0);
                setComponents([]);
                setNewComponent({ name: "", amount: 0, type: "allowance" });
              }}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                // Here you could implement save functionality
                console.log("Save calculation", {
                  baseAmount,
                  components,
                  totals,
                });
              }}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
