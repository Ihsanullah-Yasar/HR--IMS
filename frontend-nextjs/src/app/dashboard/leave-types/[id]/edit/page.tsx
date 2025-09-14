import { LeaveTypeEditForm } from "@/components/Forms/leave-type/leave-type-edit";

type EditLeaveTypePageProps = {
  params: {
    id: string;
  };
};

export default function EditLeaveTypePage({ params }: EditLeaveTypePageProps) {
  const leaveTypeId = parseInt(params.id);

  if (isNaN(leaveTypeId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Leave Type ID
          </h1>
          <p className="text-muted-foreground mt-2">
            The provided leave type ID is not valid.
          </p>
        </div>
      </div>
    );
  }

  return <LeaveTypeEditForm leaveTypeId={leaveTypeId} />;
}
