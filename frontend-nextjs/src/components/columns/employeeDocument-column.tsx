"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EmployeeDocument, DocumentType } from "@/lib/Types/employeeDocument";

const getDocumentTypeLabel = (type: DocumentType): string => {
  switch (type) {
    case DocumentType.CONTRACT:
      return "Contract";
    case DocumentType.ID_PROOF:
      return "ID Proof";
    case DocumentType.PASSPORT:
      return "Passport";
    case DocumentType.DRIVING_LICENSE:
      return "Driving License";
    case DocumentType.DEGREE_CERTIFICATE:
      return "Degree Certificate";
    case DocumentType.EXPERIENCE_CERTIFICATE:
      return "Experience Certificate";
    case DocumentType.OTHER:
      return "Other";
    default:
      return type;
  }
};

const getDocumentTypeVariant = (
  type: DocumentType
): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case DocumentType.CONTRACT:
      return "default";
    case DocumentType.ID_PROOF:
      return "secondary";
    case DocumentType.PASSPORT:
      return "outline";
    case DocumentType.DRIVING_LICENSE:
      return "outline";
    case DocumentType.DEGREE_CERTIFICATE:
      return "secondary";
    case DocumentType.EXPERIENCE_CERTIFICATE:
      return "secondary";
    case DocumentType.OTHER:
      return "outline";
    default:
      return "outline";
  }
};

export default function getEmployeeDocumentColumns({
  onDeleteClick,
}: {
  onDeleteClick: (document: EmployeeDocument) => void;
}): ColumnDef<EmployeeDocument>[] {
  return [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as DocumentType;
        return (
          <Badge variant={getDocumentTypeVariant(type)} className="text-xs">
            {getDocumentTypeLabel(type)}
          </Badge>
        );
      },
      size: 140,
    },
    {
      accessorKey: "employee",
      header: "Employee",
      cell: ({ row }) => {
        const employee = row.getValue("employee") as any;
        const employeeName = employee?.name || "N/A";
        return (
          <div className="font-medium max-w-[200px] truncate">
            {employeeName}
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "path",
      header: "File",
      cell: ({ row }) => {
        const path = row.getValue("path") as string;
        const fileName = path.split("/").pop() || path;
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-[200px] truncate">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expiryDate") as string | null;
        if (!expiryDate) {
          return <div className="text-sm text-muted-foreground">—</div>;
        }

        const isExpired = new Date(expiryDate) < new Date();
        const isExpiringSoon =
          new Date(expiryDate) <
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return (
          <div
            className={`text-sm ${
              isExpired
                ? "text-red-600"
                : isExpiringSoon
                ? "text-yellow-600"
                : "text-muted-foreground"
            }`}
          >
            {new Date(expiryDate).toLocaleDateString()}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
      size: 110,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const document = row.original;
        const router = useRouter();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(`${document.id}` || "")
                }
              >
                Copy Document ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Download file logic
                  window.open(document.path, "_blank");
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/employee-documents/${document.id}/edit`
                  )
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(document)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 80,
    },
  ];
}
