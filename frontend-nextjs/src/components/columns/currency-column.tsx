import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Currency } from "@/lib/Types/currency";
import Link from "next/link";

interface CurrencyColumnsProps {
  onDeleteClick: (currency: Currency) => void;
}

export default function getCurrencyColumns({
  onDeleteClick,
}: CurrencyColumnsProps): ColumnDef<Currency>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-mono font-bold text-lg">
          {row.getValue("code")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as Currency["name"];
        return (
          <div className="font-medium">
            {name?.en || "Unknown Currency"}
            {name?.ar && (
              <div className="text-sm text-muted-foreground">{name.ar}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
      cell: ({ row }) => (
        <div className="font-semibold text-lg">{row.getValue("symbol")}</div>
      ),
    },
    {
      accessorKey: "decimal_places",
      header: "Decimal Places",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("decimal_places")}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const currency = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/currencies/${currency.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/currencies/${currency.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(currency)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
