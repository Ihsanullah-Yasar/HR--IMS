import { CurrencyEditForm } from "@/components/Forms/currency/currency-edit";

type EditCurrencyPageProps = {
  params: {
    id: string;
  };
};

export default function EditCurrencyPage({ params }: EditCurrencyPageProps) {
  const currencyId = parseInt(params.id);

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
        </div>
      </div>
    );
  }

  return <CurrencyEditForm currencyId={currencyId} />;
}
