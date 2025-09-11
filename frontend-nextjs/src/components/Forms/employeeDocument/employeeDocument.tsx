"use client";
import {
  employeeDocumentSchema,
  employeeDocumentUpdateSchema,
  EmployeeDocumentFormData,
  EmployeeDocumentUpdateFormData,
} from "@/lib/Schemas/employeeDocument";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createEmployeeDocument,
  updateEmployeeDocument,
} from "@/lib/Actions/employeeDocuments/employeeDocuments";
import { Combobox } from "@/components/ui/combobox";
import React from "react";
import {
  EmployeeDocumentEditFormData,
  DocumentType,
} from "@/lib/Types/employeeDocument";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "create" | "update";

type EmployeeDocumentFormProps = {
  mode: Mode;
  formData?: Partial<EmployeeDocumentEditFormData>;
  documentId?: number;
};

const getDocumentTypeOptions = () => {
  return Object.values(DocumentType).map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
  }));
};

export const EmployeeDocumentForm = ({
  mode,
  formData,
  documentId,
}: EmployeeDocumentFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const employeeOptions = React.useMemo(() => {
    if (!formData?.employees) return [];
    return formData.employees.map((emp) => ({
      value: String(emp.id),
      label: emp.name,
      searchValue: emp.name.toLowerCase(),
    }));
  }, [formData?.employees]);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const form = useForm<EmployeeDocumentFormData>({
    resolver: zodResolver(employeeDocumentSchema) as any,
    defaultValues: {
      employeeId: "",
      type: DocumentType.CONTRACT,
      path: "",
      expiryDate: undefined,
      metadata: undefined,
    },
  });

  React.useEffect(() => {
    if (mode === "update" && formData?.editingDocument) {
      const d = formData.editingDocument;
      form.reset({
        employeeId: String(d.employeeId),
        type: d.type,
        path: d.path,
        expiryDate: d.expiryDate ?? undefined,
        metadata: d.metadata ? JSON.stringify(d.metadata, null, 2) : undefined,
      });
    }
  }, [formData, mode, form]);

  const createMutation = useMutation({
    mutationFn: createEmployeeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
      toast.success("Employee document created successfully!");
      router.push("/dashboard/employee-documents");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        const fieldMapping: Record<string, keyof EmployeeDocumentFormData> = {
          employee_id: "employeeId",
          type: "type",
          document: "path",
          expiry_date: "expiryDate",
          metadata: "metadata",
        };

        Object.entries(errors).forEach(([field, messages]) => {
          const formField =
            fieldMapping[field] || (field as keyof EmployeeDocumentFormData);
          form.setError(formField, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to create employee document, Try again");
        console.log(error);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: EmployeeDocumentUpdateFormData) =>
      updateEmployeeDocument(documentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
      toast.success("Employee document updated successfully!");
      router.push("/dashboard/employee-documents");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        const fieldMapping: Record<
          string,
          keyof EmployeeDocumentUpdateFormData
        > = {
          employee_id: "employeeId",
          type: "type",
          document: "path",
          expiry_date: "expiryDate",
          metadata: "metadata",
        };

        Object.entries(errors).forEach(([field, messages]) => {
          const formField =
            fieldMapping[field] ||
            (field as keyof EmployeeDocumentUpdateFormData);
          form.setError(formField, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to update employee document, Try again");
        console.log(error);
      }
    },
  });

  const onSubmit: SubmitHandler<EmployeeDocumentFormData> = (data) => {
    if (mode === "create" && !selectedFile) {
      form.setError("path", {
        type: "manual",
        message: "Please select a file to upload",
      });
      return;
    }

    if (mode === "create") {
      createMutation.mutate({ ...data, file: selectedFile || undefined });
    } else {
      updateMutation.mutate(data);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("path", file.name);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue("path", "");
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create"
            ? "Create New Employee Document"
            : "Edit Employee Document"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <FormControl>
                      <Combobox
                        options={employeeOptions}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select employee..."
                        searchPlaceholder="Search employees..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getDocumentTypeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document File</FormLabel>
                  <FormControl>
                    {mode === "create" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                          />
                        </div>
                        {selectedFile && (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <span className="text-sm truncate flex-1">
                              {selectedFile.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <Input {...field} className="hidden" />
                      </div>
                    ) : (
                      <Input
                        placeholder="e.g., /documents/contracts/contract_123.pdf"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter JSON metadata (optional)"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/employee-documents")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Document"
                  : "Update Document"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
