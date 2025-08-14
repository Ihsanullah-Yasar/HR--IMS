import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Meta } from "@/lib/Types/api";
import { useSearchParams, useRouter } from "next/navigation";
interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  meta: Meta;
}

export function DataTablePagination<TData>({
  table,
  meta,
}: DataTablePaginationProps<TData>) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const perpage = searchParams.get("per_page");
  const router = useRouter();

  const handlePagination = (page: number, perPage: number = 10) => {
    // Create a new URLSearchParams object from the current params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("per_page", String(perPage));

    // Push the updated query string
    router.push(`?${params.toString()}`);
  };
  return (
    <>
      <div className="flex items-center justify-center px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {`${meta?.from} to ${meta?.to} of ${meta?.total} row(s) selected.`}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${meta.per_page}`}
            onValueChange={(value) => {
              handlePagination(Number(page) || 1, Number(value));
            }}
          >
            <SelectTrigger className="!h-7 w-[70px]">
              <SelectValue placeholder={meta.per_page} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {meta?.current_page} of {meta?.last_page}
        </div>
      </div>
      <div className="flex justify-center items-center my-4 space-x-2">
        {/* <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => handlePaginationData(1)}
            disabled={meta.current_page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePaginationData(meta.current_page - 1)}
            disabled={meta.current_page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button> */}
        {meta.links?.map((link, idx: number) => {
          let page = null;
          if (link.url) {
            const urlParams = new URL(link.url).searchParams;
            page = urlParams.get("page") ? Number(urlParams.get("page")) : null;
          }

          return (
            <Button
              key={idx}
              variant={link.active ? "default" : "outline"}
              size="icon"
              onClick={() =>
                page && handlePagination(Number(page), Number(perpage) || 10)
              }
              disabled={
                link.url === null || link.active || link.label === "..."
              }
              className={`size-8 ${
                link.label.includes("Previous") ? "w-20" : ""
              } ${link.label.includes("Next") ? "w-16" : ""}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
        {/* <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePaginationData(meta.current_page + 1)}
            disabled={meta.current_page === meta.last_page}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => handlePaginationData(meta?.last_page)}
            disabled={meta.current_page === meta.last_page}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button> */}
      </div>
    </>
  );
}
