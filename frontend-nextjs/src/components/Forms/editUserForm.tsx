"use client";

import { getUserById, updateUser } from "@/lib/Actions/users/users";
import { User } from "@/lib/Types/user";
import { useQuery } from "@tanstack/react-query";
import { UserUpdateFormData, userUpdateSchema } from "@/lib/Schemas/user";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser } from "@/lib/Actions/users/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ApiError } from "@/lib/Types/api";

interface EditUserFormProps {
  userId: number;
}

export function EditUserForm({ userId }: EditUserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    select: (response) => response.data as User,
  });

  const { mutate: updateUserMutaion, isPending } = useMutation<
    User,
    ApiError,
    { id: string; data: UserUpdateFormData }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      router.push("/dashboard/users");
    },
    onError: (error: ApiError) => {
      // Try to parse backend error
      if (error?.status === 422 && error?.errors) {
        const errors = error.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof UserUpdateFormData, {
            type: "server",
            message: Array.isArray(messages) ? messages.join(" ") : messages,
          });
        });
      } else {
        toast.error("Failed to update user");
        console.log(error);
      }
    },
  });

  const form = useForm<UserUpdateFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [user, form]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user: {error.message}</div>;

  const editUserHandler: SubmitHandler<UserUpdateFormData> = async (data) => {
    if (!(data.password && data.password.trim().length > 0)) {
      data = {
        name: data.name,
        email: data.email,
      };
    }
    if (user) updateUserMutaion({ id: user.id, data });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Edit Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(editUserHandler)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password_confirmation?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit">
              {form.formState.isSubmitting ? "Loading..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
