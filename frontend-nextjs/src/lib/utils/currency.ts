/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency symbol or code
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  // Handle different currency symbols
  const currencyMap: Record<string, string> = {
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
    JPY: "JPY",
    CAD: "CAD",
    AUD: "AUD",
    CHF: "CHF",
    CNY: "CNY",
    INR: "INR",
    BRL: "BRL",
  };

  // If it's a symbol, try to find the corresponding currency code
  const symbolToCode: Record<string, string> = {
    "$": "USD",
    "€": "EUR",
    "£": "GBP",
    "¥": "JPY",
    "C$": "CAD",
    "A$": "AUD",
    "CHF": "CHF",
    "¥": "CNY",
    "₹": "INR",
    "R$": "BRL",
  };

  const currencyCode = currencyMap[currency] || symbolToCode[currency] || currency;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Parse a currency string to extract the numeric value
 * @param currencyString - The currency string to parse
 * @returns The numeric value
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and parse the number
  const cleaned = currencyString.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * Get currency symbol from currency code
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns The currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF",
    CNY: "¥",
    INR: "₹",
    BRL: "R$",
  };

  return symbolMap[currencyCode] || currencyCode;
}

/**
 * Convert amount from one currency to another (mock implementation)
 * In a real application, you would use a currency conversion API
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency
 * @param toCurrency - The target currency
 * @returns The converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  // Mock exchange rates - in production, use a real API
  const exchangeRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.0,
      BRL: 5.2,
    },
    EUR: {
      USD: 1.18,
      GBP: 0.86,
      JPY: 129.0,
      CAD: 1.47,
      AUD: 1.59,
      CHF: 1.08,
      CNY: 7.59,
      INR: 87.0,
      BRL: 6.12,
    },
    // Add more currencies as needed
  };

  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rate = exchangeRates[fromCurrency]?.[toCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    return amount; // Return original amount if rate not found
  }

  return amount * rate;
}
