export type Currency = {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt?: string | null;

  // Audit relations (optional)
  createdByUser?: string | null;
  updatedByUser?: string | null;
  deletedByUser?: string | null;
};

export type currencyCreateData = Omit<
  Currency,
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "createdByUser"
  | "updatedByUser"
  | "deletedByUser"
>;

export type currencyUpdateData = Partial<
  Omit<
    Currency,
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "createdByUser"
    | "updatedByUser"
    | "deletedByUser"
  >
>;
