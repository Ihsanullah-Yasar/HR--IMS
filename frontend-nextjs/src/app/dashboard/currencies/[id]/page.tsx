"use client";
import { useQuery } from "@tanstack/react-query";
import { getCurrencyById } from "@/lib/Actions/currencies/currencies";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, DollarSign, Hash, Globe, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableLoadingSkeleton } from "@/components/shared/skeleton/tableSkeleton";

type ViewCurrencyPageProps = {
  params: {
    id: string;
  };
};

export default function ViewCurrencyPage({ params }: ViewCurrencyPageProps) {
  const router = useRouter();
  const currencyId = parseInt(params.id);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["currency", currencyId],
    queryFn: () => getCurrencyById(currencyId),
  });

  if (isNaN(currencyId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Currency ID
          </h1>
          <p className="text-muted-foreground mt-2">
            The provided currency ID is not valid.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <TableLoadingSkeleton columns={1} rows={5} />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Currency Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            {error?.message || "The requested currency could not be found."}
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currency = data.data;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {currency.code} - {currency.name.en}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currency.symbol} • {currency.decimal_places} decimal places
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/currencies/${currency.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Currency Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Currency Code
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono text-xl">{currency.code}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Symbol
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xl">{currency.symbol}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  English Name
                </label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {currency.name.en}
                </p>
              </div>
              {currency.name.ar && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Arabic Name
                  </label>
                  <p className="text-lg font-semibold">{currency.name.ar}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Decimal Places
              </label>
              <p className="text-lg font-semibold">{currency.decimal_places}</p>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Badge variant={currency.is_active ? "default" : "secondary"}>
                {currency.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={currency.is_active ? "default" : "secondary"}>
                  {currency.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm">
                {new Date(currency.created_at).toLocaleDateString()}
              </p>
              {currency.created_by && (
                <p className="text-xs text-muted-foreground">
                  by {currency.created_by.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm">
                {new Date(currency.updated_at).toLocaleDateString()}
              </p>
              {currency.updated_by && (
                <p className="text-xs text-muted-foreground">
                  by {currency.updated_by.name}
                </p>
              )}
            </div>

            {currency.deleted_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Deleted
                </label>
                <p className="text-sm">
                  {new Date(currency.deleted_at).toLocaleDateString()}
                </p>
                {currency.deleted_by && (
                  <p className="text-xs text-muted-foreground">
                    by {currency.deleted_by.name}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
