import { EditUserForm } from "@/components/Forms/user/editUserForm";

export default function EditUser({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  return <EditUserForm userId={userId} />;
}
