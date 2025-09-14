import { LeaveEditForm } from "@/components/Forms/leave/leave-edit";

type EditLeavePageProps = {
  params: {
    id: string;
  };
};

export default function EditLeavePage({ params }: EditLeavePageProps) {
  const leaveId = parseInt(params.id);

  if (isNaN(leaveId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Leave Request ID
          </h1>
          <p className="text-muted-foreground mt-2">
            The provided leave request ID is not valid.
          </p>
        </div>
      </div>
    );
  }

  return <LeaveEditForm leaveId={leaveId} />;
}
