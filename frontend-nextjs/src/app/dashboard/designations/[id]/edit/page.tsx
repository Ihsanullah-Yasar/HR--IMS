"use client";
import { EditDesignation } from "@/components/Forms/designation/editDesignation";
import { use } from "react";

type EditDesignationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditDesignationPage({
  params,
}: EditDesignationPageProps) {
  const resolvedParams = use(params);
  const designationId = parseInt(resolvedParams.id);

  if (isNaN(designationId)) {
    return (
      <div className="flex flex-col items-center align-center py-8">
        <p className="text-red-500">Invalid designation ID</p>
      </div>
    );
  }

  return <EditDesignation designationId={designationId} />;
}
