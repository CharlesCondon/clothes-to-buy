const EXCHANGE_RATES: { [key: string]: number } = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.52,
    JPY: 149.5,
};

export function convertToUSD(amount: number, fromCurrency: string): number {
    if (fromCurrency === "USD") return amount;

    const rate = EXCHANGE_RATES[fromCurrency];
    if (!rate) return amount; // If currency not found, return original amount

    // Convert to USD: amount / rate
    return amount / rate;
}

export function getCurrencySymbol(currency: string): string {
    const symbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        CAD: "CA$",
        AUD: "A$",
        JPY: "¥",
    };
    return symbols[currency] || currency;
}

export function formatUSDConversion(amount: number): string {
    return `≈ $${amount.toFixed(2)}`;
}
