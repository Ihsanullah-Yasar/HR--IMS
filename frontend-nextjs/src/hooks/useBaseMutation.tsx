"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/Types/api";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

type CommonMutationOptions<
  TData,
  TVariables,
  TFormValues extends FieldValues
> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string | string[];
  form?: UseFormReturn<TFormValues>;
  redirectTo?: string;
  successMessage: string;
  errorMessage: string;
};

export function useBaseMutation<
  TData,
  TVariables,
  TFormValues extends FieldValues = FieldValues
>({
  mutationFn,
  queryKey,
  form,
  redirectTo,
  successMessage,
  errorMessage,
}: CommonMutationOptions<TData, TVariables, TFormValues>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      });
      toast.success(successMessage);
      if (redirectTo) router.push(redirectTo);
    },
    onError: (error) => {
      if (error?.status === 422 && error.errors && form) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as Path<TFormValues>, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(" ")
              : String(messages),
          });
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });
}
