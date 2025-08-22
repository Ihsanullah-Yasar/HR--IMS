"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/Types/api";

export function useDeleteMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  redirectTo,
  successMessage = "Deleted successfully",
  errorMessage = "Failed to delete",
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string | string[];
  redirectTo?: string;
  successMessage?: string;
  errorMessage?: string;
}) {
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
      toast.error(errorMessage || error.message || "Unexpected error");
    },
  });
}
