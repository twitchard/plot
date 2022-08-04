export declare function formatNumber(locale?: string): (value: any) => string | undefined;
export declare function formatMonth(locale?: string, month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined): (i: Date | number | null | undefined) => string | undefined;
export declare function formatWeekday(locale?: string, weekday?: "long" | "short" | "narrow" | undefined): (i: Date | number | null | undefined) => string | undefined;
export declare function formatIsoDate(date: Date): string;
export declare function formatAuto(locale?: string): (value: any) => string | number | undefined;
export declare const formatDefault: (value: any) => string | number | undefined;
