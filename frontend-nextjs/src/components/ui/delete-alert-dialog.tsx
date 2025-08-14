import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useState } from "react";

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  triggerLabel?: string;
  itemName?: string;
  onConfirm: () => Promise<void>;
}

export function DeleteAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  triggerLabel = "Delete",
  itemName = "this record",
  onConfirm,
}: DeleteAlertDialogProps) {
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      // Optionally: toast.success("Deleted successfully");
    } catch (err) {
      console.error("Deletion error:", err);
      setError("Failed to delete. Please try again.");
      // Optionally: toast.error("Deletion failed");
    } finally {
      setLoading(false);
      // Small delay to ensure re-renders don't interfere with portal unmount
      setTimeout(() => onOpenChange(false), 100);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> */}
      <AlertDialogContent className="rounded-2xl shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}{" "}
            <span className="font-medium text-destructive">{itemName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel
            className="rounded-md"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-red-600 rounded-md"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
