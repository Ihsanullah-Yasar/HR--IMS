"use client";
import React from "react";
import {
  currencyUpdateSchema,
  CurrencyUpdateFormData,
} from "@/lib/Schemas/currency-schema";
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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateCurrency,
  getCurrencyFormData,
} from "@/lib/Actions/currencies/currencies";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Currency } from "@/lib/Types/currency";

type CurrencyEditFormProps = {
  currencyId: number;
};

export const CurrencyEditForm = ({ currencyId }: CurrencyEditFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch currency data
  const { data: formData, isLoading } = useQuery({
    queryKey: ["currency-form-data", currencyId],
    queryFn: () => getCurrencyFormData(currencyId),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<CurrencyUpdateFormData>({
    resolver: zodResolver(currencyUpdateSchema),
    defaultValues: {
      code: "",
      name: {
        en: "",
        ar: "",
      },
      symbol: "",
      decimal_places: 2,
      is_active: true,
    },
  });

  // Update form when data is loaded
  React.useEffect(() => {
    if (formData?.data?.editingCurrency) {
      const currency = formData.data.editingCurrency;
      form.reset({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        decimal_places: currency.decimal_places,
        is_active: currency.is_active,
      });
    }
  }, [formData, form]);

  const { mutate: updateCurrencyMutation, isPending } = useMutation({
    mutationFn: (data: CurrencyUpdateFormData) =>
      updateCurrency(currencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      queryClient.invalidateQueries({
        queryKey: ["currency-form-data", currencyId],
      });
      toast.success("Currency updated successfully!");
      router.push("/dashboard/currencies");
    },
    onError: (error: any) => {
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof CurrencyUpdateFormData, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error("Failed to update currency, Try again");
        console.log(error);
      }
    },
  });

  const onSubmit: SubmitHandler<CurrencyUpdateFormData> = (data) => {
    updateCurrencyMutation(data);
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!formData?.data?.editingCurrency) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Currency Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The requested currency could not be found.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Currency</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Currency Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="USD"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          maxLength={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol *</FormLabel>
                      <FormControl>
                        <Input placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., US Dollar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., الدولار الأمريكي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decimal_places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decimal Places *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="4"
                        placeholder="2"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Settings</h3>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        This currency is available for use
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Currency"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
