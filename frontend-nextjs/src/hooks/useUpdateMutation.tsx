import { UseFormReturn, FieldValues } from "react-hook-form";
import { useBaseMutation } from "./useBaseMutation";

export function useUpdateMutation<
  TData,
  TVariables,
  TFormValues extends FieldValues = FieldValues
>({
  mutationFn,
  queryKey,
  form,
  redirectTo,
  successMessage = "Updated successfully",
  errorMessage = "Failed to update",
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string | string[];
  form?: UseFormReturn<TFormValues>;
  redirectTo?: string;
  successMessage?: string;
  errorMessage?: string;
}) {
  return useBaseMutation<TData, TVariables, TFormValues>({
    mutationFn,
    queryKey,
    form,
    redirectTo,
    successMessage,
    errorMessage,
  });
}
