import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hi'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming locale parameter is valid
    const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';

    return {
        locale: validLocale,
        messages: (await import(`./messages/${validLocale}.json`)).default
    };
});