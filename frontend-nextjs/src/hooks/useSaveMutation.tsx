"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/Types/api";
import { UseFormReturn, FieldValues } from "react-hook-form";

type Mode = "create" | "update";

type UseSaveMutationOptions<
  TData,
  TCreateVars,
  TUpdateVars,
  TFormValues extends FieldValues = FieldValues
> = {
  mode: Mode;
  queryKey: string | string[]; // which queries to invalidate
  createFn: (variables: TCreateVars) => Promise<TData>;
  updateFn: (variables: TUpdateVars) => Promise<TData>;
  form?: UseFormReturn<TFormValues>; // react-hook-form instance (for 422 errors)
  redirectTo?: string; // redirect path after success
  successMessage?: string | { create: string; update: string };
  errorMessage?: string | { create: string; update: string };
};

export function useSaveMutation<
  TData,
  TCreateVars,
  TUpdateVars,
  TFormValues extends FieldValues = FieldValues
>({
  mode,
  queryKey,
  createFn,
  updateFn,
  form,
  redirectTo,
  successMessage = {
    create: "Created successfully!",
    update: "Updated successfully!",
  },
  errorMessage = {
    create: "Failed to create. Try again.",
    update: "Failed to update. Try again.",
  },
}: UseSaveMutationOptions<TData, TCreateVars, TUpdateVars, TFormValues>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<TData, ApiError, TCreateVars | TUpdateVars>({
    mutationFn: (variables) =>
      mode === "create"
        ? createFn(variables as TCreateVars)
        : updateFn(variables as TUpdateVars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      });
      toast.success(
        typeof successMessage === "string"
          ? successMessage
          : successMessage[mode]
      );
      if (redirectTo) router.push(redirectTo);
    },
    onError: (error: ApiError) => {
      if (error?.status === 422 && error?.errors && form) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error(
          typeof errorMessage === "string" ? errorMessage : errorMessage[mode]
        );
      }
    },
  });
}
