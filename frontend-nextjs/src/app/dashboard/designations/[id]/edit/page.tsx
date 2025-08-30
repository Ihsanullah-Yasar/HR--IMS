"use client";
import { EditDesignation } from "@/components/Forms/designation/editDesignation";

type EditDesignationPageProps = {
  params: {
    id: string;
  };
};

export default function EditDesignationPage({
  params,
}: EditDesignationPageProps) {
  const designationId = parseInt(params.id);

  if (isNaN(designationId)) {
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">Invalid designation ID</p>
      </div>
    );
  }

  return <EditDesignation designationId={designationId} />;
}
