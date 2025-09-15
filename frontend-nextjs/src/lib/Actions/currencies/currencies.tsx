import { api } from "@/lib/Api";
import { ApiResponse } from "@/lib/Types/api";
import {
  Currency,
  CurrencyCreateData,
  CurrencyUpdateData,
  CurrencyEditFormData,
  CurrencyCreateFormData,
} from "@/lib/Types/currency";
import { handleServiceError } from "@/lib/utils/errorHandler";

const CURRENCIES_ENDPOINT = "/currencies";

export const getCurrencies = async (
  queryString: string = ""
): Promise<ApiResponse<Currency[]>> => {
  try {
    const response = await api.get<ApiResponse<Currency[]>>(
      CURRENCIES_ENDPOINT,
      {
        queryString,
      }
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load currencies");
  }
};

export const getCurrencyFormData = async (
  currencyId?: number
): Promise<ApiResponse<CurrencyEditFormData>> => {
  try {
    if (!Number.isFinite(currencyId) || (currencyId as number) <= 0) {
      throw new Error("Invalid currency id");
    }
    const response = await api.get<ApiResponse<CurrencyEditFormData>>(
      `${CURRENCIES_ENDPOINT}/${currencyId}/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getCurrencyCreateFormData = async (): Promise<
  ApiResponse<CurrencyCreateFormData>
> => {
  try {
    const response = await api.get<ApiResponse<CurrencyCreateFormData>>(
      `${CURRENCIES_ENDPOINT}/create/form-data`
    );
    if (!response.data) throw new Error("No data received");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Unable to load form data");
  }
};

export const getCurrencyById = async (
  id: number
): Promise<ApiResponse<Currency>> => {
  try {
    const response = await api.get<ApiResponse<Currency>>(
      `${CURRENCIES_ENDPOINT}/${id}`
    );
    if (response.status === "error") throw new Error("Currency not found");
    return response;
  } catch (error) {
    throw handleServiceError(error, `Failed to fetch currency ${id}`);
  }
};

export const createCurrency = async (
  currencyData: CurrencyCreateData
): Promise<ApiResponse<Currency>> => {
  try {
    const response = await api.post<ApiResponse<Currency>>(
      CURRENCIES_ENDPOINT,
      currencyData
    );
    if (!response.data) throw new Error("Failed to create currency");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to create currency");
  }
};

export const updateCurrency = async (
  id: number,
  currencyData: CurrencyUpdateData
): Promise<ApiResponse<Currency>> => {
  try {
    const response = await api.put<ApiResponse<Currency>>(
      `${CURRENCIES_ENDPOINT}/${id}`,
      currencyData
    );
    if (!response.data) throw new Error("Failed to update currency");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update currency");
  }
};

export const deleteCurrency = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const response = api.delete<ApiResponse<null>>(
      `${CURRENCIES_ENDPOINT}/${id}`
    );
    if (!response) throw new Error("Failed to delete currency");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete currency");
  }
};
