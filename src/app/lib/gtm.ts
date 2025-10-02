type WindowWithDataLayer = Window & {
    dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

export const pageview = (url: string) => {
    if (typeof window.dataLayer !== "undefined") {
        window.dataLayer.push({
            event: 'pageview',
            page: url,
        });
    }
};

interface LeadGenerationData {
    email: string;
    phone: string;
    value?: number;
    currency?: string;
}

// evento para GA4 (generate_lead), Meta (Lead) e Google Ads (conversion)
export const trackLeadGeneration = (data: LeadGenerationData) => {
    if (typeof window.dataLayer !== "undefined") {
        window.dataLayer.push({
            event: 'generate_lead',
            ecommerce: {
                value: data.value || 0,
                currency: data.currency || 'BRL',
            },
            user_data: {
                email: data.email,
                phone_number: data.phone.replace(/\D/g, ''), // envia apenas números
            }
        });
    }
};