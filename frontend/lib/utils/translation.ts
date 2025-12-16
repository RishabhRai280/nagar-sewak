// Free translation utility using MyMemory Translation API
// No API key required, completely free

export async function translateText(text: string, from: string, to: string): Promise<string> {
    if (!text || text.trim() === '') return '';

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
        );

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData) {
            return data.responseData.translatedText;
        }

        return '';
    } catch (error) {
        console.error('Translation error:', error);
        return '';
    }
}

// Translate from English to Hindi
export async function translateToHindi(text: string): Promise<string> {
    return translateText(text, 'en', 'hi');
}

// Translate from Hindi to English
export async function translateToEnglish(text: string): Promise<string> {
    return translateText(text, 'hi', 'en');
}
