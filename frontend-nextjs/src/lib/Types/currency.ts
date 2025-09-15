import { z } from "zod";

// Base Currency interface
export interface Currency {
  id: number;
  code: string;
  name: {
    en: string;
    ar?: string;
  };
  symbol: string;
  decimal_places: number;
  is_active: boolean;
  created_by?: {
    id: number;
    name: string;
  };
  updated_by?: {
    id: number;
    name: string;
  };
  deleted_by?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Form data interfaces
export interface CurrencyCreateFormData {
  // No additional form data needed for currencies
}

export interface CurrencyEditFormData {
  editingCurrency: Currency;
}

// Create and Update data interfaces
export interface CurrencyCreateData {
  code: string;
  name: {
    en: string;
    ar?: string;
  };
  symbol: string;
  decimal_places: number;
  is_active: boolean;
}

export interface CurrencyUpdateData {
  code?: string;
  name?: {
    en: string;
    ar?: string;
  };
  symbol?: string;
  decimal_places?: number;
  is_active?: boolean;
}

// Zod schemas for validation
export const currencyCreateSchema = z.object({
  code: z.string()
    .min(3, "Currency code must be exactly 3 characters")
    .max(3, "Currency code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency code must be 3 uppercase letters"),
  name: z.object({
    en: z.string().min(1, "English name is required").max(100, "English name must be at most 100 characters"),
    ar: z.string().max(100, "Arabic name must be at most 100 characters").optional(),
  }),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol must be at most 10 characters"),
  decimal_places: z.number().min(0, "Decimal places must be at least 0").max(4, "Decimal places must be at most 4"),
  is_active: z.boolean(),
});

export const currencyUpdateSchema = currencyCreateSchema.partial();

// Form field types
export type CurrencyFormData = z.infer<typeof currencyCreateSchema>;
export type CurrencyUpdateFormData = z.infer<typeof currencyUpdateSchema>;
