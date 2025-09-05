"use client";
import { useParams } from "next/navigation";
import { EditEmployee } from "@/components/Forms/employee/editEmployee";

export default function EditEmployeeWrapper() {
  const params = useParams();
  const id = Number(params?.id);
  if (!Number.isFinite(id)) return null;
  return <EditEmployee employeeId={id} />;
}
