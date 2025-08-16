"use client";
import { Button } from "@/components/ui/button";
import { deleteUser, getUsers } from "@/lib/Actions/users/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/advance-table";
import getUserColumns from "@/components/columns/user-column";
import { User } from "@/lib/Types/user";
import { useState } from "react";
import { ApiResponse, Meta } from "@/lib/Types/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { DeleteAlertDialog } from "@/components/ui/delete-alert-dialog";
import { UserTableLoadingSkeleton } from "../shared/skeleton/tableSkeleton";
import { userFilterConfig, userSortOptions } from "../filterConfigs/users";
import DynamicTableFilters from "../table-filters";

export default function UserTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [paginationData, setPagination] = useState({ page: 1, perPage: 10 });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: [
      "users",
      paginationData.page,
      paginationData.perPage,
      searchParams.toString(),
    ],
    queryFn: () => getUsers(searchParams.toString()),
    select: (response) => response as ApiResponse<User[]>,
  });

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) {
    return <UserTableLoadingSkeleton columns={4} rows={10} />;
  }

  if (isError) {
    toast.error("Failed to fetch users");
    return <div>Error: {error.message}</div>;
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await deleteUserMutation(parseInt(userToDelete.id));
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl font-semibold">User list</CardTitle>
            <Link href="/dashboard/users/create">
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <DynamicTableFilters
              title="User Filters"
              sortOptions={userSortOptions}
              filterConfigs={userFilterConfig}
            />

            <DataTable
              columns={getUserColumns({ onDeleteClick: handleDeleteClick })}
              data={data?.data ? data?.data : ([] as User[])}
              meta={data?.meta ? data.meta : ({} as Meta)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Single DeleteAlertDialog at the page level */}
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete"
        itemName={userToDelete ? `user "${userToDelete.name}"` : ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
